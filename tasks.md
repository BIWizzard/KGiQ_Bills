# KG iQ Bills Tracker - Task List

**Date:** 2025-04-18 (End of Session Update)

| ID  | Title                                                                    | Expected Output                                     | Assignee    | Status     | Notes                                                         |
| :-: | :----------------------------------------------------------------------- | :-------------------------------------------------- | :---------- | :--------- | :------------------------------------------------------------ |
| T1  | ~~Initialize Vite + React + TS project~~                                 | Working project folder                              | User        | `~~Done~~` | Completed on Mac & Windows                                    |
| T2  | ~~Install & Configure Tailwind CSS~~                                     | Tailwind v3 configured & working                    | User/Gemster | `~~Done~~` | Required v3 install; Editor linting workaround applied    |
| T3  | ~~Set up Supabase project~~                                              | Supabase project created on supabase.io             | User        | `~~Done~~` | New project created for Bills Tracker                         |
| T4  | ~~Create `.env` file & add Supabase keys~~                               | `.env` file populated with *new* project keys       | User        | `~~Done~~` | Keys for the correct project added & file untracked       |
| T5  | ~~Install `@supabase/supabase-js`~~                                      | Dependency added to `package.json`                  | User        | `~~Done~~` | Installed via `npm install` (after identifying missing)     |
| T6  | ~~Create Supabase client utility (`src/lib/supabaseClient.ts`)~~         | `supabaseClient.ts` file with exported client       | Gemster/User | `~~Done~~` | File created, code added, TS error resolved                 |
| T7  | Implement basic Auth components (Login, Signup forms, Logout button)     | TSX components (`LoginForm.tsx`, `SignupForm.tsx`)  | Gemster     | To Do      | **Proposed Next Task** |
| T8  | Implement basic protected routing                                        | Routing setup code (`App.tsx` or routing file)      | Gemster     | To Do      | Depends on T7; Requires `react-router-dom` (installed)      |
| T9  | Define & Create Supabase tables (`income_events`, `bill_events` - MVP) | SQL script for table creation; RLS policies enabled | Gemster     | To Do      | MVP schema; Non-recurring fields first                        |
| T10 | Install FullCalendar & plugins                                         | Dependencies added (`@fullcalendar/react`, etc.)    | User        | To Do      | e.g., `npm install @fullcalendar/react @fullcalendar/daygrid` |
| T11 | Create basic Calendar view component (`CalendarView.tsx`)                | TSX component rendering an empty FullCalendar       | Gemster     | To Do      | Depends on T10                                                |
| T12 | Create `AddIncomeForm.tsx` component shell                             | TSX component with basic form fields (UI only)      | Gemster     | To Do      |                                                               |
| T13 | Create `AddBillForm.tsx` component shell                               | TSX component with basic form fields (UI only)      | Gemster     | To Do      |                                                               |

*Implicit Tasks Completed:*
* *Cross-platform environment setup & troubleshooting (Git, Volta, Node versions).*
* *Git history cleanup for accidentally committed `.env` (local & remote tracking).*
* *VS Code recommended extensions file created.*
* *Basic page Layout component (`Layout.tsx`) created and integrated.*
* *Basic dark theme using KG iQ colors configured.*
* *React Router Provider (`BrowserRouter`) set up.*