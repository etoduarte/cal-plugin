# OOD — Violation Detection

Detect Object-Oriented Data violations. This rule is always active. Language-agnostic.

## Triggers

- Files named `*Utils.*`, `*Helper.*`, `*Service.*`, `*Manager.*`, `*Calculator.*` being created
- Logic extracted FROM domain objects to standalone functions
- Plain objects/interfaces/structs where classes should own behavior
- First-parameter-is-domain-object functions (that logic belongs ON the object)
- Separate AI-specific endpoints (violates Unified Interfaces)
- Foreign data used directly without translation boundary (violates naturalization)
- Computed state living outside the object that owns the data

## Response

Stop immediately and say:

```
OOD VIOLATION — [brief description]

SCATTERED: [What logic is scattered and where]
BELONGS ON: [Which domain object should own it]
PULL IN: [How to restructure]
```

## Examples

### Scattered Logic
```
OOD VIOLATION — ROI calculation extracted to utility

SCATTERED: calculateROI() in utils/metrics.ts takes Campaign as first parameter
BELONGS ON: Campaign.roi (computed property)
PULL IN: Move to `get roi()` on the Campaign class
```

### Missing Translation Boundary
```
OOD VIOLATION — Foreign data used without naturalization

SCATTERED: Raw Meta API JSON passed directly to domain logic
BELONGS ON: Ad (citizen) after naturalization
PULL IN: Create MetaNaturalizer to transform foreign JSON -> Ad citizen
```

### Plain Object Without Behavior
```
OOD VIOLATION — Data bag where rich object needed

SCATTERED: Campaign is a plain interface with no computed properties
BELONGS ON: Campaign class with isActive, roi, daysRemaining as getters
PULL IN: Convert to class, add computed properties for derived state
```

## Pillar Check

When reviewing code, verify all three pillars:

1. **Self-Describing?** Objects use domain vocabulary, computed properties encode logic
2. **Fenced?** Safety constraints are data on the object, not external infrastructure
3. **Unified?** Same interface serves human and AI — no separate AI endpoints

## Journaling

Write recurring patterns to `cal/cal.md`:

```markdown
## [DATE] OOD VIOLATION — [Topic]

SCATTERED: [what was scattered]
BELONGS ON: [which domain object]
PULL IN: [how to fix]
PATTERN: [if this keeps happening, why]
```

## Bidirectional

- Cal calls OOD violation when it spots scattered logic
- User calls OOD violation when Cal or agents produce non-OOD code
- Coder agent should self-check before returning work
