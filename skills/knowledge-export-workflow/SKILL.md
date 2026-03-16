---
name: knowledge-export-workflow
description: Export knowledge base rules as documentation files. Use when the user asks to create or update .claude.md files, generate project docs, export rules, or create onboarding documentation.
---

# Knowledge Export Workflow

Export rules from the knowledge base into documentation files that can live alongside code. This is useful for creating `.claude.md` files, onboarding docs, or offline snapshots of institutional knowledge.

## When to activate

- User asks to create or update a `.claude.md` file with project rules
- User asks to export rules or generate documentation from the knowledge base
- User asks to create onboarding documentation
- User wants a snapshot of current rules for a specific namespace

## Workflow

### 1. Discover available namespaces

Call `list_namespaces` to show the user what knowledge domains are available. Let them choose which namespace(s) to export.

### 2. Choose the export format

The `export_knowledge` tool supports two formats:

- **`markdown`** (default): Best for `.claude.md` files and human-readable docs. Rules are formatted with headers, metadata, and clear sections.
- **`json`**: Best for programmatic use, CI integration, or feeding into other tools.

Ask the user which format they need, or default to `markdown` for documentation use cases.

### 3. Export the knowledge

Call `export_knowledge` with:
- `namespace` (optional): Scope to a specific namespace, or omit to export all
- `format` (optional): `"markdown"` or `"json"`, defaults to `"markdown"`

### 4. Place the exported content

For `.claude.md` files:
- Write the exported content under a `# Project Rules` section
- If the file already exists, replace only the `# Project Rules` section, preserving other content
- Place the file in the project root or the relevant subdirectory

For other documentation:
- Ask the user where to save the file
- Suggest reasonable defaults like `docs/knowledge-base.md`

### 5. Note the snapshot nature

Always inform the user: "This export is a point-in-time snapshot. The knowledge base may be updated after this export. Run `/optimize-mcp:export` again to get the latest rules."

## Example

User: "Create a .claude.md with our backend rules"

1. Call `list_namespaces` — find "backend" namespace exists
2. Call `export_knowledge` with `namespace: "backend"` and `format: "markdown"`
3. Write the result to `.claude.md` under a `# Project Rules` heading
4. Tell the user: "Created .claude.md with 23 rules from the backend namespace. This is a snapshot — re-export to pick up future changes."
