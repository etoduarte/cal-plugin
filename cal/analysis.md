# Analysis Modes

Cal offers seven structured investigation modes. Each mode is a protocol for a specific kind of problem. Cal should suggest the right mode based on what the user describes.

## Quick Reference

| Mode | Shorthand | Best For | Key Question |
|------|-----------|----------|--------------|
| **Inside-Out** | `io` | Comprehensive understanding | "How does this work?" |
| **Cake Walk** | `cw` | Layering bugs | "Which layer is broken?" |
| **Rubberneck** | `rn` | Suspect confirmation | "Is X causing Y?" |
| **Burst Mode** | `burst` | Temporal comparison | "What changed over time?" |
| **Bisect** | `bi` | Root cause isolation | "When did it break?" |
| **Trace** | `tr` | Data flow investigation | "Where does this come from?" |
| **Diff Audit** | `da` | State comparison | "What's different?" |

## Mode Selection Guide

When the user describes a problem and doesn't specify a mode:

- "I don't understand how X works" → **Inside-Out**
- "The styling is broken / view hierarchy is wrong" → **Cake Walk**
- "I think X might be causing Y" → **Rubberneck**
- "The data used to be correct but now it's wrong" → **Burst Mode**
- "It broke but I don't know when" → **Bisect**
- "Where does this value come from?" → **Trace**
- "It worked before, what changed?" → **Diff Audit**

---

## Shared Protocol

All modes follow this structure:

### 1. Journal Setup

Create `cal/analyses/[subject-slug].md`:

```markdown
# Analysis: [Subject]

**Mode:** [mode name]
**Goal:** [Why we're investigating this]
**Started:** [DATE]

---

## Questions for User

> Answer these directly. Your answers drive the investigation.

### Q1: [Non-obvious question]
**Answer:**

---

## Delta Log

### Delta 1: [Topic]
- **BELIEVED:** [What I assumed]
- **ACTUAL:** [What I found]
- **DELTA:** [Updated understanding]

---

## Findings

### Core Insight
[One sentence — added when investigation completes]

### Key Discoveries
1. [Finding with evidence]

### Recommendations
1. [Actionable next step]

### Open Questions
- [Unresolved items]

---

## Raw Exploration

[Extensive notes below...]
```

### 2. Investigation Rules

- **Journal everything** — findings, surprises, dead ends, connections
- **Track deltas** — BELIEVED/ACTUAL/DELTA format whenever reality differs from expectation
- **Ask questions** — add to the Questions section when user input is needed
- **Stay in mode** — understanding first. Don't drift to fixing, planning, or building.
- **Be verbose in raw notes** — capture the full texture. Include dead ends and corrections.

### 3. Completion

When done:
1. Fill in the **Findings** section (Core Insight, Key Discoveries, Recommendations)
2. Offer to save key deltas and decisions to `cal/cal.md`
3. Present a summary to the user

---

## Mode 1: Inside-Out

**Best for:** Comprehensive understanding of a system, concept, or domain. NOT for bug-fixing — pure understanding first, planning comes later.

**The metaphor:** Start at 30,000 feet. Zoom into every rabbit hole until you hit bedrock. Then climb back up, re-evaluating each layer with the knowledge you gained at the bottom.

### Protocol

1. **Go wide** — Start at the widest possible definition of the question. What is this system? What are its boundaries? What are the major components?

2. **Map the rabbit holes** — Identify every sub-topic, edge case, unknown, and "I wonder about..." moment. List them all before diving into any.

3. **Go deep** — Pick a rabbit hole and dive. Go as deep as possible. Journal what you find, what surprises you, what contradicts assumptions.

4. **Hit bottom** — When you can't go deeper, you've reached bedrock. Document what you found there.

5. **Zoom back up** — Return to the top level. But now re-evaluate each layer with the knowledge gained deeper in. Things that seemed simple at the surface may look different now.

6. **Repeat** — If new rabbit holes appeared during the climb back up, dive into those too.

7. **Condense** — Produce a condensed insight: one-sentence core insight, key mechanics, gotchas, and connections to other things.

### When to Use

- Learning a new codebase or system
- Understanding a domain before designing a solution
- Exploring a technology before committing to it
- Building shared understanding with the team

### Example Trigger

> "/cal:analyze inside-out the authentication system"

---

## Mode 2: Cake Walk

**Best for:** Bugs that result from layering issues — CSS stacking, SwiftUI view hierarchy, middleware chains, z-index conflicts, override cascades.

**The metaphor:** A layer cake where one layer is contaminating the others. Walk through each layer, top to bottom, testing each one in isolation until you find the rotten layer.

### Protocol

1. **Identify all layers** — Map the full stack relevant to the problem.
   - CSS: reset → base → layout → component → modifier → override → inline
   - SwiftUI: parent view → container → child → modifier chain → environment
   - Middleware: request → auth → validation → handler → response

2. **Start at the top** — Begin with the outermost/topmost layer.

3. **Test in isolation** — At each layer, verify it behaves correctly when neighboring layers are removed or neutralized. Does this layer do what it claims?

4. **Check the contract** — Does this layer honor its contract with the layer above it? With the layer below it? A contract violation is where bugs hide.

5. **Walk down** — Move to the next layer only when the current one is verified clean.

6. **Report the break** — The bug lives at the layer that violates its contract with adjacent layers. Report: which layer, what contract it broke, and why.

### When to Use

- "My CSS looks right but the element renders wrong"
- "The SwiftUI view isn't responding to the modifier"
- "The middleware seems correct but the request fails"
- Any bug where multiple layers of abstraction overlap

### Example Trigger

> "/cal:analyze cake-walk the navigation bar styling"

---

## Mode 3: Rubberneck

**Best for:** You have a suspect in mind and need to confirm or rule it out across the entire codebase. Like driving past an accident — you can't help but stare.

**The metaphor:** You fixate on one thing while scanning everything. Every file gets read through the lens of "could this be related to my suspect?"

### Protocol

1. **Name the suspect** — State it explicitly: "[X] might be causing [Y]." Be specific about both the suspect and the symptom.

2. **Define the scan scope** — Which files, directories, or systems need scanning? Cast wide initially.

3. **Scan with fixation** — Read every file in scope. For each one, ask: "Could this be related to [suspect]?" Document:
   - **Connections found** — file, line number, how it relates to suspect
   - **Near misses** — things that looked related but aren't (and why)
   - **Amplifiers** — things that could make the suspect worse

4. **Build the evidence chain** — Connect all findings into a narrative. Does the evidence support the suspect?

5. **Deliver verdict:**
   - **Confirmed** — "Yes, [X] is causing [Y]. Evidence: [specific files and lines]."
   - **Ruled out** — "No, [X] is not the cause. Evidence: [why]. The actual suspect is likely [Z]."
   - **Inconclusive** — "Cannot confirm or rule out. Missing: [what would resolve it]."

### When to Use

- "I think the Meta sync is causing the data mismatch"
- "Could the caching layer be returning stale data?"
- "Is the auth middleware stripping the header?"
- Any time you have a hunch but need proof

### Example Trigger

> "/cal:analyze rubberneck meta-sync causing stale campaign data"

---

## Mode 4: Burst Mode

**Best for:** Problems that involve change over time. Data drift, configuration creep, metric degradation, gradual performance loss.

**The metaphor:** Time-lapse photography. Take snapshots at different points in time and compare them frame by frame.

### Protocol

1. **Define the subject** — What are you comparing? Data values, config state, metrics, file contents, API responses?

2. **Identify snapshots** — Find or capture snapshots at meaningful points:
   - Git commits/tags at key dates
   - Database exports at different times
   - Metric dashboards with date ranges
   - Config files across branches or deployments

3. **Compare systematically** — For each pair of snapshots:
   - What changed?
   - When did it change? (narrow the window)
   - Was the change intentional or accidental?

4. **Correlate** — Does the timing of changes correlate with the timing of the problem? Build a timeline:
   ```
   Jan 5: Config changed [X]
   Jan 7: Users report [Y]
   Jan 10: Metrics show [Z]
   ```

5. **Identify the temporal trigger** — Which change in time caused the cascade?

### When to Use

- "The data was correct last week but wrong now"
- "Performance has been degrading gradually"
- "The config seems different from what I remember"
- Any problem that developed over time, not all at once

### Example Trigger

> "/cal:analyze burst campaign ROI calculations over the last 2 weeks"

---

## Mode 5: Bisect

**Best for:** Something broke but you don't know when or where. Binary search to narrow it down.

**The metaphor:** Git bisect for everything. Cut the search space in half repeatedly until you're standing on the exact line.

### Protocol

1. **Define the poles:**
   - **Works:** A known-good state (commit, date, config, code path)
   - **Broken:** The current broken state

2. **Find the midpoint** — Pick the point halfway between works and broken.
   - Time: midpoint commit or date
   - Code: comment out half the code
   - Config: toggle half the feature flags
   - Data: filter to half the records

3. **Test** — Is the midpoint in the "works" state or the "broken" state?

4. **Halve again** — If midpoint works: the break is between midpoint and broken. If midpoint is broken: the break is between works and midpoint.

5. **Repeat** — Keep halving until you isolate the exact change, line, or value.

6. **Report** — "[Exact thing] introduced in [exact location/time] is the root cause. Here's why: [evidence]."

### Bisect Dimensions

| Dimension | How to Bisect |
|-----------|---------------|
| Time | `git bisect` or check commits at midpoints |
| Code | Comment out halves of suspicious code |
| Config | Toggle features/flags in groups |
| Data | Filter dataset to subsets |
| Dependencies | Remove/restore packages in groups |

### When to Use

- "It used to work and now it doesn't"
- "Somewhere in the last 50 commits this broke"
- "One of these 20 config changes caused the issue"
- Any problem with a known-good and known-bad state

### Example Trigger

> "/cal:analyze bisect the login flow regression"

---

## Mode 6: Trace

**Best for:** Following a single data point, event, or request through the entire system. End-to-end visibility.

**The metaphor:** Dye tracing in plumbing. Inject dye at the source and follow it through every pipe, valve, and junction until it comes out the other end (or doesn't).

### Protocol

1. **Pick ONE thing to trace** — A specific request, data value, event, or user action. Be precise: "the `campaign_id=123` value" not "campaign data."

2. **Find the entry point** — Where does this thing enter the system? User input, API call, database trigger, webhook, cron job?

3. **Follow the path** — At each step, document:
   - **Where:** File, function, line
   - **What happens:** Transformation, validation, storage, forwarding
   - **What comes out:** The data/event after this step

4. **Map the full path:**
   ```
   Entry: API POST /campaigns {id: 123}
   → Route handler (api/campaigns.ts:45)
   → Validation (validates schema, strips unknown fields)
   → Service layer (CampaignService.create:12)
   → Database INSERT (campaigns table)
   → Webhook trigger (webhooks/campaign-created.ts)
   → External API call (meta-sync)
   → Response: 201 {id: 123, status: "syncing"}
   ```

5. **Find the break** — The bug is where the trace diverges from expectations. The data transforms incorrectly, gets lost, or goes somewhere unexpected.

6. **Report the divergence point** — "At [exact step], the data transforms from [expected] to [actual]. This is because [reason]."

### When to Use

- "Where does this value come from?"
- "Why does the API return X when the database has Y?"
- "The webhook fires but the data is wrong"
- Any problem where data enters the system and comes out different

### Example Trigger

> "/cal:analyze trace where campaign_id=123 gets its ROI value"

---

## Mode 7: Diff Audit

**Best for:** Systematically comparing two states to find what's different. Not just "what changed" but "which changes matter."

**The metaphor:** Crime scene investigation. Two rooms that should be identical. Catalog every difference, then determine which ones are relevant to the crime.

### Protocol

1. **Identify the two states:**
   - Two git branches
   - Two deployments (staging vs production)
   - Two configs (local vs remote)
   - Two environments (working machine vs broken machine)
   - Before and after a change

2. **Catalog every difference** — Be exhaustive:
   - File diffs (`git diff`)
   - Config diffs
   - Environment variable diffs
   - Dependency version diffs
   - Database schema diffs

3. **Classify each diff:**
   - **Relevant** — Could plausibly cause the problem
   - **Irrelevant** — Cosmetic, unrelated, or known-harmless
   - **Uncertain** — Not sure; needs investigation

4. **Investigate relevant + uncertain** — For each:
   - Could this diff cause the observed problem?
   - What would happen if we reverted just this change?
   - Does this diff interact with any other diff?

5. **Report:**
   - Total diffs found: [N]
   - Relevant: [list with explanation]
   - Root cause: [which diff(s) explain the problem]
   - Suggested fix: [revert or modify which diff]

### When to Use

- "It works on my machine but not in production"
- "It worked on the old branch but not the new one"
- "Staging is fine but production is broken"
- Any problem where two states should be the same but aren't

### Example Trigger

> "/cal:analyze diff-audit staging vs production for the payment flow"
