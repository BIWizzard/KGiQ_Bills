## KG iQ Bills Tracker - Initial Task List (Phase 1: Setup & Foundations)

**Date:** 2025-04-18

| ID  | Title                                                                    | Expected Output                                     | Assignee    | Status   | Notes                                      |
| :-: | :----------------------------------------------------------------------- | :-------------------------------------------------- | :---------- | :------- | :----------------------------------------- |
| T1  | Initialize Vite + React + TS project | Working project folder | User | ~~Done~~ | Confirmed via output & screenshot |                        |
| T2  | Install & Configure Tailwind CSS                                         | Tailwind configured & base styles applied           | User        | To Do    | Follow README setup                        |
| T3  | Set up Supabase project                                                  | Supabase project created on supabase.io             | User        | To Do    | Get URL and Anon Key                       |
| T4  | Create `.env` file & add Supabase keys                                   | `.env` file populated                               | User        | To Do    | Follow README setup                        |
| T5  | Install `@supabase/supabase-js`                                          | Dependency added to `package.json`                  | User        | To Do    | `npm install @supabase/supabase-js`        |
| T6  | Create Supabase client utility (`src/lib/supabaseClient.ts`)             | `supabaseClient.ts` file with exported client       | Gemster     | To Do    | I can provide this code snippet.         |
| T7  | Implement basic Auth components (Login, Signup forms, Logout button)     | TSX components (`LoginForm.tsx`, `SignupForm.tsx`)  | Gemster     | To Do    | UI + basic Supabase auth calls.          |
| T8  | Implement basic protected routing                                        | Routing setup code (`App.tsx` or routing file)      | Gemster     | To Do    | Use React Router; redirect if not logged in. |
| T9  | Define & Create Supabase tables (`income_events`, `bill_events` - MVP) | SQL script for table creation; RLS policies enabled | Gemster     | To Do    | Focus on non-recurring fields for MVP.     |
| T10 | Install FullCalendar & plugins                                         | Dependencies added (`@fullcalendar/react`, etc.)    | User        | To Do    | `npm install ...`                          |
| T11 | Create basic Calendar view component (`CalendarView.tsx`)                | TSX component rendering an empty FullCalendar       | Gemster     | To Do    | Initial setup, no event data yet.        |
| T12 | Create `AddIncomeForm.tsx` component shell                             | TSX component with basic form fields (UI only)      | Gemster     | To Do    | Source, Date, Amount inputs.             |
| T13 | Create `AddBillForm.tsx` component shell                               | TSX component with basic form fields (UI only)      | Gemster     | To Do    | Payee, Date, Amount inputs.              |