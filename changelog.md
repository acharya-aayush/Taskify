Taskify Changelog
Tbh IDK why GPT’s pushing for this detailed changelog yrr... Anyway, here’s what I’ve randomly added to the project. No one’s gonna read it, so... whatever.

[v1.3.0] - 2025-05-05
Optimized
Disabled recurring tasks because, surprise surprise, it broke everything.

Infinite loops? Not the flex I thought it was.

Maybe one day I’ll fix it. Or maybe not. Don't hold your breath.

But yeah, it was intentional... totally.

Performance
Used useMemo everywhere because apparently good devs do that.

App’s like... 0.001ms faster. Don’t expect miracles.

Cached tasks so your potato PC might handle like, 10+ tasks.

useCallback on EVERYTHING because... some tutorial said to, okay?

Fixed
That “deleteTask not defined” error? Yeah, still clueless how that happened.

Fixed by copy-pasting the same code again.

Classic. Restart it, done.

Technical Updates
Optimized the LocalStorage hook. No one cares.

Cross-tab syncing, like anyone's opening this on two tabs.

Better state handling, but... like, nobody will notice.

Less console spam—finally, you're welcome.

Memory
Made it “memory efficient” or whatever that means.

Chrome tab now uses 99% RAM instead of 100%. Progress, right?

Fewer re-renders. Bet you can't tell the difference.

Added more refs so things don't get recreated for no reason.

Files Updated
useTasks.ts: Overhauled (doesn’t look any different tho)

useTaskFilters.ts: UseMemo—because I had to.

useLocalStorage.ts: Added cross-tab syncing. Who asked for this?

useRecurringTasks.ts: Disabled it. Too much work.

[v1.2.0] - 2025-05-04
Added
Recurring tasks because I clearly didn’t know when to stop.

Tasks reset daily/weekly/monthly—IDK, just pick one.

Subtasks reset too because, sure, why not add more chaos?

Removed
Got rid of the reminder bell thing. Honestly, I don’t care about notifications.

Backend code’s still chilling in case I wanna bring it back. Spoiler: I won’t.

Visual Updates
Shadows. Borders. Inputs looking fresher. Because UI matters.

Fixed dark mode colors so I don't burn my retinas anymore.

Technical Updates
Recurring settings component that I spent way too much time on.

Fixed state management, it was all over the place.

Typescript, typescript, typescript... I just do what they say.

[v1.0.0] - 2025-05-15
Features
The generic todo app. We’ve all seen it a million times.

Neumorphic design, obviously. For my crush, who ghosted.

Local storage so your tasks don’t just disappear (thanks, I guess).

Dark mode. Because I’m not a savage.

Easter eggs I wasted too much time on.

Stats, charts, progress bars—because why not?

[Upcoming v2.0.0] - 2025-Q3
Future Features (I’ll probably never get to them):
Task reminders (pfft, like anyone wants that).

Subtasks, nested tasks, checklists—IDK, some organizational stuff.

Calendar view (because nobody asked for that level of complexity).
