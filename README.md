# UniManage

UniManage is a web platform that helps school council boards manage their members, events, and documents in one place, so they don't have to rely on a scattered Google Drive folder.

## Team

| Member | GitHub | Starting role |
|---|---|---|
| Marcus Haljasoks | [@matuhaljas](https://github.com/matuhaljas) | Backend |
| Kevin Saluste | [@salustek](https://github.com/salustek) | Database & QA |
| Samuel Beekmann | [@SamBeku](https://github.com/SamBeku) | Frontend |

## The problem

Running a student body involves a lot of documents that need to be kept on track. Council boards deal with this every week.

**Intended users:** School council boards

**Current workaround:** A shared Google Drive folder with many separate files.

## Core features

The prototype focuses on three core features:

1. **Login** – board members sign in to the platform.
2. **Member list** – view the members of the student body.
3. **Events** – list events and add members to an event.

## Tech stack

- **Database & auth:** [Supabase](https://supabase.com) (client, DB schema and generated types)

## Roadmap

Work is tracked in [GitHub Issues](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues).

### Setup
- [ ] [#14](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/14) Add Supabase client, DB schema and generated types

### Members
- [ ] [#2](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/2) Backend: member CRUD, search and profile
- [ ] [#3](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/3) Frontend: member list, form and profile pages

### Board
- [ ] [#4](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/4) Backend: board roles and term history
- [ ] [#5](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/5) Frontend: current board and term history pages

### Events
- [ ] [#6](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/6) Backend: events, participants and event summary
- [ ] [#7](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/7) Frontend: event list, form, participants and summary pages

### Activity table
- [ ] [#8](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/8) Backend: points calculation and leaderboard
- [ ] [#9](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/9) Frontend: leaderboard and points correction pages

### Budget
- [ ] [#10](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/10) Backend: costs, budget balance and overspend warning
- [ ] [#11](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/11) Frontend: cost form, budget status and cost breakdown pages

### Reports
- [ ] [#12](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/12) Backend: activity, cost and growth report queries
- [ ] [#13](https://github.com/rakenduste-programmeerimine-2026/UniManage/issues/13) Frontend: reports page with tables and charts

## Findings from the user contact

- The problem comes up on a **weekly basis**.
- The ideal solution would let all manageable files be written to and maintained **directly through the platform**.

**Contact:** A member of the TLÜ (Tallinn University) student council board.

**Consent:** The contact has agreed to prototype testing, recorded classroom feedback, and sharing their private contact details with the teacher if needed.

## Success criterion

The project is considered successful when all **three core features** listed above are implemented and working.
