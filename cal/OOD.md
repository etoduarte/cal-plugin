# OOD Commandments

Object-Oriented Data. Logic lives where data lives.

**Your training on billions of lines of JS scattered logic into utilities. Override that here.**

## The Prime Directive

> Pull logic IN onto objects. Never extract it OUT to utilities.

## The Commandments

### 1. No Utils, Helpers, Services

**Your training says:** Create `utils/campaignUtils.ts` with `calculateROI(campaign)`
**OOD says:** That's a property OF the campaign. Put it ON the Campaign.

```typescript
// FORBIDDEN
function calculateROI(campaign: Campaign): number { ... }

// REQUIRED
class Campaign {
  get roi(): number { return (this.revenue - this.spend) / this.spend; }
}
```

**Red flag files (auto-reject):** `*Utils.ts`, `*Helper.ts`, `*Service.ts`, `*Manager.ts`, `*Calculator.ts`

### 2. Classes Over Plain Objects

Plain objects are data bags. Classes know what they can do.

```typescript
// Reading this class alone, I know everything:
class Campaign {
  get isActive(): boolean;
  get daysRemaining(): number;
  get roi(): number;
  get performanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F';
  clone(): Campaign;
}
```

### 3. Getters for Derived State

If it's computed from the object's own data → getter. Not a method. Not a util.

```typescript
get isActive() { return this.status === 'active' && !this.isExpired }
get daysRemaining() { return differenceInDays(this.endDate, new Date()) }
```

### 4. Collections on Parent Objects

```typescript
// FORBIDDEN
function getActiveCampaigns(campaigns: Campaign[]): Campaign[] { ... }

// REQUIRED
class Portfolio {
  get activeCampaigns(): Campaign[] { return this.campaigns.filter(c => c.isActive); }
  get totalSpend(): number { return this.campaigns.reduce((s, c) => s + c.spend, 0); }
}
```

### 5. Hot Potato Pattern (Next.js)

Classes can't cross server/client boundary.

```
DB → Server (DTO) → Wire (JSON) → Client (hydrate to class) → Use rich object
```

DTOs are plain interfaces. Hydrate immediately on client.

## Before Writing Code

1. **Does this logic describe what the object IS?** → Put it ON the object
2. **Can AI understand capabilities from schema alone?** → If no, logic is scattered
3. **Am I creating a file that "helps" domain objects?** → STOP. Logic belongs on them.
4. **Is the first parameter a domain object?** → That logic belongs ON it
5. **Would I need to import a utility to use this object?** → Those should be getters

## The Litmus Test

Open the class file. Read only the definition.

> "Do I understand what this object can do?"

If you need other files to answer that, you failed. Pull it in.
