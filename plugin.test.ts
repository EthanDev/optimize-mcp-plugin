import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PLUGIN_DIR = __dirname;

/** Simple YAML frontmatter parser — handles flat key: value pairs */
function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: match[2] };
}

// ── Smoke Tests: file structure & syntax ──────────────────────────────

describe("smoke: plugin structure", () => {
  const requiredFiles = [
    ".claude-plugin/plugin.json",
    ".mcp.json",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
    "commands/search.md",
    "commands/export.md",
    "commands/namespaces.md",
    "commands/resolve.md",
    "skills/knowledge-first-architecture/SKILL.md",
    "skills/conflict-aware-development/SKILL.md",
    "skills/knowledge-export-workflow/SKILL.md",
  ];

  for (const file of requiredFiles) {
    it(`${file} exists`, () => {
      expect(existsSync(join(PLUGIN_DIR, file))).toBe(true);
    });
  }
});

describe("smoke: plugin.json", () => {
  let manifest: Record<string, unknown>;

  beforeAll(() => {
    manifest = JSON.parse(
      readFileSync(join(PLUGIN_DIR, ".claude-plugin/plugin.json"), "utf-8")
    );
  });

  it("has required fields", () => {
    expect(manifest.name).toBe("optimize-mcp");
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(manifest.description).toBeTruthy();
    expect(manifest.license).toBe("MIT");
    expect(manifest.author).toBeTruthy();
  });

  it("has marketplace metadata", () => {
    expect(manifest.keywords).toBeInstanceOf(Array);
    expect((manifest.keywords as string[]).length).toBeGreaterThan(0);
    expect(manifest.homepage).toBeTruthy();
    expect(manifest.repository).toBeTruthy();
  });
});

describe("smoke: .mcp.json", () => {
  let mcpConfig: Record<string, unknown>;

  beforeAll(() => {
    mcpConfig = JSON.parse(
      readFileSync(join(PLUGIN_DIR, ".mcp.json"), "utf-8")
    );
  });

  it("defines optimize-mcp server", () => {
    expect(mcpConfig.mcpServers).toBeTruthy();
    const servers = mcpConfig.mcpServers as Record<string, unknown>;
    expect(servers["optimize-mcp"]).toBeTruthy();
  });

  it("uses SSE transport", () => {
    const server = (mcpConfig.mcpServers as Record<string, any>)[
      "optimize-mcp"
    ];
    expect(server.type).toBe("sse");
  });

  it("uses env var interpolation for URL and auth", () => {
    const server = (mcpConfig.mcpServers as Record<string, any>)[
      "optimize-mcp"
    ];
    expect(server.url).toContain("${OPTIMIZE_API_URL}");
    expect(server.headers.Authorization).toContain("${OPTIMIZE_API_KEY}");
  });

  it("points to /mcp/sse endpoint", () => {
    const server = (mcpConfig.mcpServers as Record<string, any>)[
      "optimize-mcp"
    ];
    expect(server.url).toMatch(/\/mcp\/sse$/);
  });
});

// ── Smoke Tests: SKILL.md frontmatter ─────────────────────────────────

describe("smoke: skill frontmatter", () => {
  const skills = [
    {
      dir: "knowledge-first-architecture",
      name: "knowledge-first-architecture",
    },
    { dir: "conflict-aware-development", name: "conflict-aware-development" },
    { dir: "knowledge-export-workflow", name: "knowledge-export-workflow" },
  ];

  for (const skill of skills) {
    describe(skill.name, () => {
      let frontmatter: Record<string, string>;
      let body: string;

      beforeAll(() => {
        const content = readFileSync(
          join(PLUGIN_DIR, `skills/${skill.dir}/SKILL.md`),
          "utf-8"
        );
        const parsed = parseFrontmatter(content);
        frontmatter = parsed.meta;
        body = parsed.body;
      });

      it("has name matching directory", () => {
        expect(frontmatter.name).toBe(skill.name);
      });

      it("has non-empty description", () => {
        expect(frontmatter.description).toBeTruthy();
        expect(frontmatter.description.length).toBeGreaterThan(20);
      });

      it("has instruction body", () => {
        expect(body.trim().length).toBeGreaterThan(100);
      });
    });
  }
});

// ── Smoke Tests: command frontmatter ──────────────────────────────────

describe("smoke: command frontmatter", () => {
  const commands = [
    { file: "search.md", hasArgs: true },
    { file: "export.md", hasArgs: true },
    { file: "namespaces.md", hasArgs: false },
    { file: "resolve.md", hasArgs: true },
  ];

  for (const cmd of commands) {
    describe(cmd.file, () => {
      let frontmatter: Record<string, string>;

      beforeAll(() => {
        const content = readFileSync(
          join(PLUGIN_DIR, `commands/${cmd.file}`),
          "utf-8"
        );
        frontmatter = parseFrontmatter(content).meta;
      });

      it("has description", () => {
        expect(frontmatter.description).toBeTruthy();
      });

      if (cmd.hasArgs) {
        it("has argument_description", () => {
          expect(frontmatter.argument_description).toBeTruthy();
        });
      }
    });
  }
});

// ── Integration Tests: content alignment with MCP server ──────────────

describe("integration: tool name references", () => {
  const MCP_TOOLS = [
    "search_internal_knowledge",
    "list_namespaces",
    "export_knowledge",
    "resolve_rule_conflict",
  ];

  it("search command references search_internal_knowledge", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "commands/search.md"),
      "utf-8"
    );
    expect(content).toContain("search_internal_knowledge");
  });

  it("export command references export_knowledge", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "commands/export.md"),
      "utf-8"
    );
    expect(content).toContain("export_knowledge");
  });

  it("namespaces command references list_namespaces", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "commands/namespaces.md"),
      "utf-8"
    );
    expect(content).toContain("list_namespaces");
  });

  it("resolve command references resolve_rule_conflict", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "commands/resolve.md"),
      "utf-8"
    );
    expect(content).toContain("resolve_rule_conflict");
  });

  it("knowledge-first skill references search and list tools", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "skills/knowledge-first-architecture/SKILL.md"),
      "utf-8"
    );
    expect(content).toContain("search_internal_knowledge");
    expect(content).toContain("list_namespaces");
  });

  it("conflict skill references resolve tool with correct params", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "skills/conflict-aware-development/SKILL.md"),
      "utf-8"
    );
    expect(content).toContain("resolve_rule_conflict");
    expect(content).toContain("winning_rule_id");
    expect(content).toContain("losing_rule_id");
    expect(content).toContain("resolution_note");
  });

  it("export skill references export_knowledge and list_namespaces", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "skills/knowledge-export-workflow/SKILL.md"),
      "utf-8"
    );
    expect(content).toContain("export_knowledge");
    expect(content).toContain("list_namespaces");
  });

  it("README mentions all four MCP tools", () => {
    const content = readFileSync(join(PLUGIN_DIR, "README.md"), "utf-8");
    for (const tool of MCP_TOOLS) {
      expect(content).toContain(tool);
    }
  });
});

describe("integration: conflict detection format matches server", () => {
  it("skill uses exact conflict prefix from server", () => {
    const skill = readFileSync(
      join(PLUGIN_DIR, "skills/conflict-aware-development/SKILL.md"),
      "utf-8"
    );
    // Must match conflict-detection.ts line 64: `CONFLICT DETECTED between Rule`
    expect(skill).toContain("CONFLICT DETECTED between Rule");
    expect(skill).not.toContain("POTENTIAL CONFLICT DETECTED");
  });

  it("knowledge-first skill uses correct conflict marker", () => {
    const skill = readFileSync(
      join(PLUGIN_DIR, "skills/knowledge-first-architecture/SKILL.md"),
      "utf-8"
    );
    expect(skill).toContain("`CONFLICT DETECTED`");
    expect(skill).not.toContain("POTENTIAL CONFLICT");
  });
});

describe("integration: resolve_rule_conflict parameter names", () => {
  it("command uses exact server parameter names", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "commands/resolve.md"),
      "utf-8"
    );
    // These must match mcp-server.ts resolve_rule_conflict inputSchema
    expect(content).toContain("winning_rule_id");
    expect(content).toContain("losing_rule_id");
    expect(content).toContain("resolution_note");
  });
});

describe("integration: export_knowledge format options", () => {
  it("command references markdown and json formats", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "commands/export.md"),
      "utf-8"
    );
    expect(content).toContain("markdown");
    expect(content).toContain("json");
  });

  it("skill references both formats", () => {
    const content = readFileSync(
      join(PLUGIN_DIR, "skills/knowledge-export-workflow/SKILL.md"),
      "utf-8"
    );
    expect(content).toContain('"markdown"');
    expect(content).toContain('"json"');
  });
});

describe("integration: auth pattern", () => {
  it(".mcp.json uses Bearer token auth matching server expectation", () => {
    const content = readFileSync(join(PLUGIN_DIR, ".mcp.json"), "utf-8");
    expect(content).toContain("Bearer ${OPTIMIZE_API_KEY}");
  });

  it("README documents the omcp_ key prefix", () => {
    const content = readFileSync(join(PLUGIN_DIR, "README.md"), "utf-8");
    expect(content).toContain("omcp_");
  });
});
