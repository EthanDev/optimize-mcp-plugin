---
description: Search the institutional knowledge base for rules, patterns, and decisions
argument_description: Search query (e.g., "authentication patterns", "database migrations")
---

Search the knowledge base using the `search_internal_knowledge` MCP tool with the user's query.

**Instructions:**

1. Take `$ARGUMENTS` as the search query
2. If the query is empty, ask the user what they'd like to search for
3. Call `search_internal_knowledge` with `query` set to `$ARGUMENTS`
4. Present results in a clear format:
   - For each matching rule: show the title, category, a brief summary, similarity score, and source attribution
   - If conflicts are detected, flag them prominently
   - If no results found, suggest refining the query or trying different terms
5. Keep the output concise — summarize rules rather than dumping raw content
