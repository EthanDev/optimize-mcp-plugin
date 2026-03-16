---
description: Resolve a conflict between two knowledge base rules
argument_description: "<winning_rule_id> <losing_rule_id> <reason>" — the rule to keep, the rule to deprecate, and why
---

Resolve a conflict between two rules using the `resolve_rule_conflict` MCP tool.

**Instructions:**

1. Parse `$ARGUMENTS` for the winning rule ID, losing rule ID, and resolution reason
2. If arguments are missing or incomplete:
   - Ask the user for the winning rule ID (the rule to keep active)
   - Ask for the losing rule ID (the rule to deprecate)
   - Ask for a brief reason explaining the decision
3. Confirm the action with the user before proceeding: "This will keep Rule <winning_id> as active and deprecate Rule <losing_id>. Proceed?"
4. Call `resolve_rule_conflict` with:
   - `winning_rule_id`: ID of the rule to keep
   - `losing_rule_id`: ID of the rule to deprecate
   - `resolution_note`: The user's reason
5. Confirm the resolution was successful and summarize the outcome
