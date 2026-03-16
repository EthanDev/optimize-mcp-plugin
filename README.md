# Optimize MCP Plugin for Claude Code

Institutional knowledge management for AI-assisted development. This plugin connects Claude Code to your [Optimize MCP](https://optimizemcp.com) knowledge base, enabling Claude to automatically search architectural rules, business policies, and historical decisions before writing code.

## Prerequisites

- An [Optimize MCP](https://optimizemcp.com) account
- An API key (starts with `omcp_`)

## Installation

```bash
git clone https://github.com/EthanDev/optimize-mcp-plugin.git
claude --plugin-dir ./optimize-mcp-plugin
```

## Configuration

Set the following environment variables:

```bash
export OPTIMIZE_API_URL="https://api.optimizemcp.click"
export OPTIMIZE_API_KEY="omcp_your_api_key_here"
```

Add these to your shell profile (`.zshrc`, `.bashrc`) or use a `.env` file in your project.

## Usage

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/optimize-mcp:search <query>` | Search the knowledge base | `/optimize-mcp:search authentication patterns` |
| `/optimize-mcp:namespaces` | List available namespaces | `/optimize-mcp:namespaces` |
| `/optimize-mcp:export [format] [namespace]` | Export rules to a file | `/optimize-mcp:export markdown backend` |
| `/optimize-mcp:resolve <winner> <loser> <reason>` | Resolve a rule conflict | `/optimize-mcp:resolve rule-42 rule-15 "JWT is now standard"` |

### Skills (automatic)

The plugin includes three skills that Claude uses automatically based on context:

- **Knowledge-First Architecture** — When you ask Claude to design, create, or refactor something, it proactively searches the knowledge base for relevant rules before recommending an approach.

- **Conflict-Aware Development** — When search results contain conflicting rules, Claude surfaces both sides, explains the conflict, and guides you through resolution.

- **Knowledge Export Workflow** — When you ask Claude to create `.claude.md` files or project documentation, it exports rules from the knowledge base in the right format.

### Example workflows

**Designing a new feature:**
```
You: "Let's add a caching layer to the user service"
Claude: [automatically searches knowledge base]
Claude: "Your knowledge base has Rule #42: 'Use Valkey instead of Redis for new
        caching layers due to licensing.' Shall I design with Valkey?"
```

**Exporting rules for a project:**
```
You: /optimize-mcp:export markdown backend
Claude: "Exported 23 rules from the backend namespace to .claude.md"
```

**Resolving a conflict:**
```
You: /optimize-mcp:search auth tokens
Claude: "Found 2 rules, but CONFLICT DETECTED: Rule #12 (JWT) vs Rule #45
        (session cookies). Which should we keep?"
You: "Keep JWT, it's our current standard"
Claude: [resolves conflict, deprecates Rule #45]
```

## MCP Tools

This plugin connects to four MCP tools on your Optimize MCP server:

| Tool | Description |
|------|-------------|
| `search_internal_knowledge` | Search rules by query with optional namespace and category filters |
| `list_namespaces` | List available knowledge namespaces |
| `export_knowledge` | Export rules as markdown or JSON |
| `resolve_rule_conflict` | Resolve conflicts between two rules |

## Support

- Documentation: [optimizemcp.com/docs](https://optimizemcp.com/docs)
- Issues: [github.com/EthanDev/optimize-mcp-plugin/issues](https://github.com/EthanDev/optimize-mcp-plugin/issues)
