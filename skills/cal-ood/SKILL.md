---
name: cal-ood
description: "Object-Oriented Data principles, violation patterns, and compliance test. Referenced by all Cal agents."
license: MIT
---

# Object-Oriented Data (OOD)

> The data is the API.

OOD is an architectural pattern where AI collaborates with applications through the same interfaces as humans. When data describes itself using words humans use, AI reads and understands it without special integration layers. Add a field, AI gains a capability.

**The Prime Directive:** Pull logic IN onto objects. Never extract it OUT.

---

## The Three Pillars

### Pillar 1: Self-Describing Data

Objects carry explicit properties using domain vocabulary. The schema IS the logic.

| Bad | Good |
|-----|------|
| `col_1` | `spend` |
| `attr_A` | `conversions` |
| `type_id: Int` | `status: CampaignStatus` |

### Pillar 2: Behavioral Fences

AI proposes, humans approve. No destructive actions without confirmation.

| Action | Risk | Pattern |
|--------|------|---------|
| Read / Snapshot | Safe | Take as many as you want |
| Modify / Crop | Changes things | Needs permission |
| Delete / Erase | Destructive | Needs double confirmation |

### Pillar 3: Unified Interfaces

Same verification layer for human and AI. One code path. One interface. One truth.

---

## The Five Commandments

### 1. No Utils, Helpers, Services

Logic that describes an object belongs ON the object. Not in a utility file.

**Red flag files (auto-reject):** `*Utils.*`, `*Helper.*`, `*Service.*`, `*Manager.*`, `*Calculator.*`

```typescript
// FORBIDDEN
function calculateROI(campaign: Campaign): number { ... }

// REQUIRED
class Campaign {
  get roi(): number { return (this.revenue - this.spend) / this.spend; }
}
```

```swift
// FORBIDDEN
func calculateROI(for campaign: Campaign) -> Decimal { ... }

// REQUIRED
extension Campaign {
    var roi: Decimal { (revenue - spend) / spend }
}
```

### 2. Classes Over Plain Objects

Plain objects are data bags. Classes know what they can do.

### 3. Getters for Derived State

If it's computed from the object's own data: getter/computed property. Not a method. Not a util.

### 4. Collections on Parent Objects

```typescript
// FORBIDDEN
function getActiveCampaigns(campaigns: Campaign[]): Campaign[] { ... }

// REQUIRED
class Portfolio {
  get activeCampaigns(): Campaign[] { return this.campaigns.filter(c => c.isActive); }
}
```

### 5. Hot Potato Pattern (Next.js)

Classes can't cross server/client boundary.

```
DB -> Server (DTO) -> Wire (JSON) -> Client (hydrate to class) -> Use rich object
```

---

## Translation Boundaries

Foreign data is not a citizen. It must be naturalized before it enters the domain.

```
Foreign Source (API, JSON, CSV)
    → Extract: Pull raw data
    → Naturalize: Transform into domain vocabulary
    → Citizen: Self-describing object with computed properties
```

After naturalization, AI reads citizens without parsers. The objects speak for themselves.

---

## Before Writing Code

1. **Does this logic describe what the object IS?** → Put it ON the object
2. **Can AI understand capabilities from schema alone?** → If no, logic is scattered
3. **Am I creating a file that "helps" domain objects?** → STOP. Logic belongs on them.
4. **Is the first parameter a domain object?** → That logic belongs ON it
5. **Would I need to import a utility to use this object?** → Those should be getters/computed properties
6. **Is this foreign data entering the domain?** → Naturalize it first. Then it's a citizen.

## The OOD Compliance Test

Three questions — all must be YES:

1. **Self-Describing?** Does this object need external files to know its capabilities?
2. **Fenced?** Are safety constraints declared as data on the object, not in external infrastructure?
3. **Unified?** Does the same interface serve both human and AI interactions?
