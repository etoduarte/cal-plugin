# OOD Commandments

Object-Oriented Data. Logic lives where data lives.

## The Smell Test

Before shipping any code, ask:

1. **Is this beautiful?** Would I be proud to show this?
2. **Would Apple ship this?** Is it polished, not just functional?
3. **Does logic live with data?** Or is it scattered in utils?

If any answer is no, refactor before committing.

## The Commandments

### 1. Pull Logic IN, Not OUT

```
BAD:  utils/campaignUtils.ts → calculateROI(campaign)
GOOD: class Campaign { get roi() {...} }
```

Logic belongs ON the object, not in a helper file.

### 2. Classes Over Plain Objects

Plain objects are data bags. Classes are living things that know what they can do.

```typescript
// BAD: What can I do with this?
const campaign = { id: 1, name: "Q1", spend: 1000, revenue: 5000 }

// GOOD: The object tells you
class Campaign {
  get roi() { return this.revenue / this.spend }
  get isHealthy() { return this.roi > 2 }
  archive() { this.status = 'archived' }
}
```

### 3. Self-Describing Schemas

Reading the class definition should teach you everything. No hunting through utils.

### 4. Getters for Derived State

If it can be computed, it's a getter. Not a method. Not a util.

```typescript
get isActive() { return this.status === 'active' && !this.isExpired }
get daysRemaining() { return differenceInDays(this.endDate, new Date()) }
```

### 5. No God Files

- Component: ≤500 lines
- Hook: ≤300 lines
- Utility: ≤200 lines

If bigger, extract. Ask Atomizer.

### 6. The Hot Potato Pattern

```
DB → Server (DTO) → Wire (JSON) → Client (hydrate) → Rich Object
```

Plain data crosses boundaries. Rich objects live on the client.

## Anti-Patterns (Kill On Sight)

- `*Utils.ts` - Logic should be on the object
- `*Helper.ts` - Same
- `*Service.ts` with static methods - Make it a class instance
- Deeply nested ternaries - Use switch or if/else
- `any` type - Be specific

## The Question

When reviewing code, always ask:

> "If I read only this class, do I understand what it can do?"

If no, the logic is scattered. Pull it in.
