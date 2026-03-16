---
name: conflict-aware-development
description: Detect and resolve conflicting rules in the knowledge base. Use when search results contain conflict warnings, or when the user mentions contradictory guidelines or outdated practices.
---

# Conflict-Aware Development

When searching the knowledge base, you may encounter conflicting rules. These are flagged automatically with a `CONFLICT DETECTED` warning block. This skill guides you through surfacing and resolving conflicts.

## When to activate

- Search results from `search_internal_knowledge` contain a conflict warning section
- The user mentions contradictory or outdated guidelines
- You notice two rules that give opposing recommendations for the same topic

## Recognizing conflict warnings

Conflict warnings appear at the end of search results in this format:

```
---
CONFLICT DETECTED between Rule <id_a> and Rule <id_b>:
  Both address "<topic>" but were added on different dates.
  Rule <newer_id> (<newer_date>) may supersede Rule <older_id> (<older_date>).
  ACTION: Ask the developer which rule to follow, then use resolve_rule_conflict.
```

## Workflow

### 1. Surface both rules clearly

Present both conflicting rules side by side:
- Rule ID, title, and category
- Author and source (who wrote it, where it came from)
- Date added (newer rules may supersede older ones)
- The actual recommendation each rule makes

### 2. Explain the conflict

Describe why these rules conflict in plain language. For example: "Rule #12 says to use JWT tokens for auth, but Rule #45 says to use session cookies. These were written by different teams at different times."

### 3. Ask the user to decide

Do NOT pick a winner yourself. Present the options:
- **Keep Rule A**: Explain what this means for the codebase
- **Keep Rule B**: Explain what this means for the codebase
- **Keep both**: Only if the rules can coexist with scoping (e.g., different contexts)

Ask: "Which rule should we keep as the active guideline? I'll resolve the conflict in the knowledge base."

### 4. Resolve the conflict

Once the user decides, call `resolve_rule_conflict` with:
- `winning_rule_id`: The ID of the rule to keep
- `losing_rule_id`: The ID of the rule to deprecate
- `resolution_note`: A clear explanation of why this rule was chosen (include the user's reasoning)

### 5. Confirm resolution

After the tool returns successfully, confirm to the user:
- Which rule is now active
- Which rule was deprecated
- That future searches will no longer flag this conflict

## Important notes

- Never silently ignore a conflict warning — always surface it to the user
- The newer rule is not always correct; date is context, not a decision
- Resolution notes become part of the knowledge base history, so write them clearly
