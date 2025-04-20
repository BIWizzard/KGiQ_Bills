# KG iQ Bills Tracker - Task List

**Date:** 2025-04-19 (Session 4 End)

| ID  | Title                                                                    | Expected Output                                     | Assignee    | Status     | Notes                                                           |
| :-: | :----------------------------------------------------------------------- | :-------------------------------------------------- | :---------- | :--------- | :-------------------------------------------------------------- |
| T1  | ~~Initialize Vite + React + TS project~~                                 | Working project folder                              | User        | `Done`     | Completed on Mac & Windows                                      |
| T2  | ~~Install & Configure Tailwind CSS~~                                     | Tailwind v3 configured & working                    | User/Gemster | `Done`     | Required v3 install; Editor linting workaround applied          |
| T3  | ~~Set up Supabase project~~                                              | Supabase project created on supabase.io             | User        | `Done`     | New project created for Bills Tracker                           |
| T4  | ~~Create `.env` file & add Supabase keys~~                               | `.env` file populated with *new* project keys       | User        | `Done`     | Keys for the correct project added & file untracked             |
| T5  | ~~Install `@supabase/supabase-js`~~                                      | Dependency added to `package.json`                  | User        | `Done`     | Installed via `npm install`                                     |
| T6  | ~~Create Supabase client utility (`src/lib/supabaseClient.ts`)~~         | `supabaseClient.ts` file with exported client       | Gemster/User | `Done`    | File created, code added, TS error resolved                     |
| T7  | ~~Implement basic Auth components (Login, Signup forms, Logout button)~~ | Functional Login/Signup forms, Logout               | Gemster/User | `Done`    | Basic structure, state, Supabase calls implemented              |
| T8  | ~~Implement basic protected routing~~                                    | Protected route component, routes defined in App.tsx | Gemster/User | `Done`    | `BrowserRouter`, `<Routes>`, `<Route>`, `ProtectedRoute` setup |
| T9  | ~~Define & Create Supabase tables (`income_events`, `bill_events`)~~     | Tables created in Supabase with RLS                 | Gemster/User | `Done`    | Initial MVP schema                                              |
| T10 | ~~Install FullCalendar & plugins~~                                       | Dependencies added (`@fullcalendar/react`, etc.)    | User        | `Done`     | Installed `react`, `daygrid`                                    |
| T11 | ~~Create basic Calendar view component (`CalendarView.tsx`)~~            | Component renders calendar with events & hover cards | Gemster/User | `Done`    | Fetches/displays data, hover uses Floating UI                   |
| T12 | ~~Implement `AddIncomeForm.tsx` component~~                              | Form adds data to Supabase, includes autocomplete    | Gemster/User | `Done`    | Includes Supabase insert logic                                  |
| T13 | ~~Implement `AddBillForm.tsx` component~~                                | Form adds data to Supabase, includes autocomplete    | Gemster/User | `Done`    | Includes Supabase insert logic                                  |
| T14 | ~~Create `allocations` table~~                                           | Table created in Supabase with RLS                   | Gemster/User | `Done`    | Schema for linking income to bills                              |
| T15 | ~~Implement Allocation UI/Logic~~                                        | UI for linking income to bills, saves to DB          | Gemster/User | `Done`    | UI for linking income to bills with modal                        |
| T16 | ~~Enhance Bill Status and Allocation Visual Indicators~~                 | Bill status tracking & visual feedback               | Gemster/User | `Done`    | Updated schema, UI indicators, partial payments support added  |
| T17 | Implement Enhanced Allocation Management                                 | Editable allocations with individual scheduling      | Gemster/User | `To Do`   | Scheduled dates, status per allocation, drag-and-drop            |
| T18 | Create Allocation Management Interface                                   | Dedicated page for managing allocations              | Gemster     | `To Do`    | List view, filtering, edit/delete functions                      |
| T19 | Add Filter/Sort Options to Calendar View                                 | UI for filtering events by date, status, etc.        | Gemster     | `To Do`    | Future task                                                     |
| T20 | Implement Recurring Events                                               | Support for regularly repeating income and bills     | Gemster     | `To Do`    | Future task                                                     |

*Implicit Tasks Completed:*
* *Cross-platform environment setup & troubleshooting.*
* *Git history cleanup for accidentally committed `.env`.*
* *VS Code recommended extensions file created.*
* *Basic page Layout component created and integrated.*
* *Basic dark theme using KG iQ colors configured.*
* *Refactoring auth state logic from App to HomePage.*
* *Refactoring hover card logic to use Floating UI.*
* *Creation of reusable Modal component.*
* *Financial summary section on homepage with progress bars.*
* *Status-based visual indicators and color coding.*