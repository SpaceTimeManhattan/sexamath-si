# SEXAMATH.si — Daily SEXA Telemetry Desk (scope draft)
*2026-11-03 · for Jered / UFS review · not built yet · deploy parked*

## Intent
A daily-login surface where a human can:
1. Sign in once per day (streak / continuity optional).
2. View different satellite telemetry readings (start: MESSENGER Mercury MAG + RSS windows already on disk; later: BepiColombo post-MOI, then HEXAD six-planet pack).
3. Run SEXA Math in full in real time **alongside** that telemetry — admissibility gate visible, before/during/after windows marked, HEXAD six channels live.

## Non-goals (v0)
- No claim that gravity is solved (scoreboard stays ~6.75/19 headway).
- No inventing flux numbers or belt windows; windows must be read from files under PREREG.
- No public deploy until Jered approves page + naming locks.
- No Hostile-Advisor individuals named.

## Named construct (pending)
The engineering error of discarding belt-puncture / radiation-belt-crossing telemetry as contamination — formal logic construct: **LOCKED name: The Trash Telemetry Fallacy** (Jered 2026-11-03). Replace site-wide.

Belt lock: all six HEXAD planets have radiation belts (some on/off, synthetic); use that wording site-wide.

## Suggested modules
| Module | Job |
|--------|-----|
| Auth / daily gate | Lightweight login; one session token per calendar day (America/New_York). |
| Telemetry browser | Pick craft + window (MESSENGER 2011 DOY 091–094 first). Plot MAG / tracking overlays. |
| Window marker | Before / during / after tags; refuse “drop during” as default. |
| HEXAD stack view | Six channels; puncture = 1 in / 5 out visualization. |
| SEXA runner | Admissibility-gated pass over the selected windows; show gate pass/fail; export JSON. |
| Momish brief | Fixed copy: discarding puncture intervals is incorrect for this science question. |

## Data sources (on box today)
- `/workspace/belt_six_planets_2026-10-28/` (MESSENGER MAG + RSS ODFs; scorecard)
- RICOLMC-DDF backdrop: DOI 10.17605/OSF.IO/WNV67

## Build order
1. animation.html + real craft imagery (in flight).
2. Stub panel on site (“Coming: daily SEXA telemetry desk”).
3. Read-only telemetry browser (no auth) on local preview.
4. Auth + daily gate after Jered locks construct name + placement.
5. Live SEXA runner wired to real windows.

## Open for Jered
- Construct name (via UFS shortlist).
- Who may log in (advisor circle only vs public).
- Whether BepiColombo live feeds wait until post 21 Nov 2026 MOI.
