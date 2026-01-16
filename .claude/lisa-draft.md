# Cal 2.0 - Multi-Agent Inside-Out Sessions

## Interview Notes

**Feature Summary:** Enhance Cal plugin with coordinated multi-agent exploration capabilities based on learnings from the pixley-mvp beta-mvp-inside-out session.

**Components Proposed:**
1. `/cal:inside-out session` - Multi-lens parallel exploration
2. `/cal:profile` - User profile template
3. `/cal:synthesize` - Cross-agent synthesis
4. Formalized lens definitions
5. `/cal:handoff` - Handoff protocol for Lisa/Ralph

---

## Questions & Answers

### Q&A Model
**Q:** AskUserQuestion during exploration vs async journal-based?
**A:** Keep async journal writing - helped get a head start while other agents were running. BUT improve formatting:
- Questions should be at TOP of journal for easy answering
- Stricter document formatting
- CLI should be more proactive in notifying user when questions are ready
- Answers documented below later

### Lens Model
**Q:** Fixed lens catalog vs custom?
**A:** Dynamic - Cal should determine appropriate lenses OR ask user at runtime based on the task at hand. Not a rigid fixed catalog.

### Alignment Docs
**Q:** Formal phase vs organic emergence for shared alignment docs?
**A:** **Accordion pattern** - Sessions have narrow alignment points, then AIs explore and diverge, then narrow alignment again. Always end in alignment before implementing. This is the natural rhythm:
```
Alignment → Divergent exploration → Alignment → Divergent exploration → Final alignment → Implementation
```

### Profile Scope
**Q:** Global vs per-project user profile?
**A:** Global - one profile across all projects at `~/.claude/cal/USER-PROFILE.md`

### Synthesis Owner
**Q:** Cal command vs spec-cleaner agent for synthesis?
**A:** Spec-cleaner agent handles synthesis at accordion alignment points. It's what spec-cleaner already does naturally.

### Session Storage
**Q:** /cal/sessions/ vs /cal/inside-out/ structure?
**A:** Keep /cal/inside-out/ only - extend it to support multi-agent work. Simpler folder structure.

### Handoff Format
**Q:** Cal command vs journal template for handoff?
**A:** Dedicated `/cal:handoff [recipient]` command - extracts from all journals into one handoff doc. More control.

### Orchestration
**Q:** How should Cal orchestrate multi-agent sessions?
**A:** User-directed - Cal suggests agents based on task, user approves/modifies, then Cal launches. User stays in control of what agents run.

### MVP Scope
**Q:** Which components are essential for Cal 2.0?
**A:** ALL FOUR are essential:
1. `/cal:inside-out session` - Multi-agent exploration
2. `/cal:profile` - Global user profile
3. `/cal:handoff` - Structured handoff
4. Improved journal format - Questions at top, stricter formatting

### Delta Protocol
**Q:** Explicit vs implicit delta integration in agent journals?
**A:** Explicit - Agents MUST document BELIEVED/ACTUAL/DELTA when assumptions change. Formal required section.

### File Structure
**Q:** How to organize multi-agent files in /cal/inside-out/?
**A:** Subfolder per topic: `/cal/inside-out/[topic]/` with `general.md`, `atomizer.md`, `synthesis.md` etc. Matches beta-mvp pattern.

### Version
**Q:** Version as 2.0.0 or 1.3.0?
**A:** 2.0.0 - Major version bump signals significant new capabilities.

---

## Future Ideas (Post 2.0)

### Cal Web Dashboard: Open Questions Inbox
- Display open questions from agents across all synced projects
- Multiple chat-like windows for answering questions from different projects
- Unified inbox for async agent Q&A
- Part of Cal Sync web interface (cal.applacat.com)

