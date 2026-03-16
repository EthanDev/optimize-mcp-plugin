---
name: knowledge-first-architecture
description: Automatically search institutional knowledge before making architectural decisions, choosing libraries, designing APIs, or introducing new patterns. Use when the user asks to create, design, refactor, or choose technology.
---

# Knowledge-First Architecture

Before making any architectural decision, you MUST search the institutional knowledge base. This ensures alignment with established patterns, policies, and historical decisions.

## When to activate

- User asks to create a new service, module, or component
- User asks to choose a library, framework, or technology
- User asks to design or refactor an API
- User asks to introduce a new pattern or convention
- User asks to restructure code or change architecture

## Workflow

### 1. Discover available namespaces

Call `list_namespaces` to understand the organization's knowledge structure. This tells you which teams, domains, or categories have documented rules.

### 2. Search for relevant knowledge

Call `search_internal_knowledge` with a query describing the architectural decision. Be specific:

- **Good**: "authentication patterns for microservices"
- **Bad**: "auth"

Use the `namespace` parameter to scope searches when you know the relevant domain. Use the `category` parameter to filter by rule type (e.g., "architecture", "security", "api-design").

### 3. Present findings to the user

When rules are found:
- Summarize each matching rule with its title, category, and key recommendation
- Include the rule's provenance: who authored it, when, and from what source (Slack, PR, manual entry)
- Note the similarity score — high scores (>0.85) indicate strong relevance
- If multiple rules apply, explain how they interact

When no rules are found:
- Tell the user no existing guidance was found for this area
- Proceed with your recommendation but note it's not backed by institutional knowledge

### 4. Check for conflicts

If search results contain a `CONFLICT DETECTED` warning, stop and follow the conflict-aware-development skill instead. Do not proceed with a recommendation until the conflict is resolved.

### 5. Align your recommendation

- If rules exist: frame your recommendation in terms of the established patterns. Explain where your suggestion aligns and where it might deviate.
- If you recommend deviating from an existing rule: explicitly call this out and explain the tradeoff. The user needs to make an informed decision.

## Example

User: "Let's add a Redis cache layer to the API"

1. Call `list_namespaces` to find relevant namespaces
2. Call `search_internal_knowledge` with query "caching strategy Redis" and relevant namespace
3. Present: "Your knowledge base has Rule #42 (authored by @sarah, from Slack #backend, March 2025): 'Use Valkey instead of Redis for new caching layers due to licensing concerns.' This suggests using Valkey instead."
4. Let the user decide whether to follow or override the existing guidance
