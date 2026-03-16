---
description: Export knowledge base rules to a file
argument_description: "[format] [namespace]" — optional format (markdown/json) and namespace filter
---

Export rules from the knowledge base using the `export_knowledge` MCP tool.

**Instructions:**

1. Parse `$ARGUMENTS` for optional format and namespace:
   - If arguments contain "json", set format to "json"; otherwise default to "markdown"
   - If arguments contain a word that isn't "json" or "markdown", treat it as a namespace filter
   - If no arguments provided, export all namespaces in markdown format
2. Call `list_namespaces` first so you can validate the namespace if one was specified
3. Call `export_knowledge` with the parsed format and namespace
4. Ask the user where to save the output (suggest `.claude.md` for markdown, `knowledge-export.json` for JSON)
5. Write the file and confirm the export with a count of rules exported
6. Remind the user that this is a point-in-time snapshot
