**Project:** KG iQ Bills Tracker

**Goal:** Build a React web application for managing family finances, specifically tracking income and bill payments on a calendar and allowing users to allocate income to specific bills.

**Tech Stack:**
* Frontend: React, Vite, TypeScript, Tailwind CSS (v3), React Router v6
* Backend: Supabase (PostgreSQL Database, Auth)
* UI Libraries: FullCalendar (@fullcalendar/react, @fullcalendar/daygrid), Floating UI (@floating-ui/react)
* Version Control: Git, GitHub
* Node Management: Volta (pinned Node v20.11.0)

**Current Status:**
* **Branch:** `dev`
* **Last Commit:** `feat: Task T11 (Calendar View Component with Events Hover)` (or similar, check `git log -1`)
* **Working Features:**
    * User Authentication: Login, Signup forms functional (Signup call not explicitly tested but component exists); Logout functional; Basic protected route for homepage redirects unauth users to `/login`.
    * Database: Supabase project created; `income_events`, `bill_events`, and `allocations` tables created with basic schema and Row Level Security enabling users to access only their own data.
    * Data Entry: `AddIncomeForm` and `AddBillForm` components functional, successfully insert data into respective Supabase tables; include basic autocomplete for 'source' and 'payee' using distinct values fetched via Supabase RPC functions (`get_distinct_income_sources`, `get_distinct_bill_payees`).
    * Calendar View: `CalendarView` component successfully fetches and displays income (green) and bill (wine) events from Supabase for the logged-in user; event amounts formatted as currency; Hovering over events displays a detail card (`IncomeEventCard` or `BillEventCard`) positioned correctly using Floating UI.
    * UI/Layout: Basic `Layout.tsx` component provides header (with logo), main content area, and footer; Dark theme implemented using Tailwind `darkMode: 'media'` and custom KG iQ colors defined in `tailwind.config.js`; Base styles applied via `index.css`.
    * Routing: Basic routing set up using `react-router-dom` (`BrowserRouter`, `Routes`, `Route`) for `/`, `/login`, `/signup`.
    * Config: `.env` file set up and ignored by Git; `.vscode/extensions.json` created.

**Key Code Files (Latest known versions from Session 2):**
* _(Ideally, provide latest local versions if different)_
* `src/components/calendar/CalendarView.tsx` (Displays calendar, fetches events, handles hover)
* `src/pages/HomePage.tsx` (Displays welcome, renders CalendarView for logged-in users)
* `src/App.tsx` (Sets up Layout and Routes)
* `src/components/auth/ProtectedRoute.tsx` (Handles redirect if not logged in)
* `src/components/forms/AddIncomeForm.tsx` (Form with Supabase insert)
* `src/components/forms/AddBillForm.tsx` (Form with Supabase insert)
* `src/lib/supabaseClient.ts` (Supabase client initialization)
* `tailwind.config.js` (Theme config, KG colors)
* `index.css` (Base styles, dark mode)
* `main.tsx` (BrowserRouter setup)

**Supabase Schema Snippets:**
* `income_events` columns: `id, created_at, user_id, source, expected_date, expected_amount, is_recurring, notes`
* `bill_events` columns: `id, created_at, user_id, payee, description, due_date, amount_due, is_recurring, payment_method, notes`
* `allocations` columns: `id, created_at, user_id, income_event_id, bill_event_id, allocated_amount`
* RLS enabled on all three tables based on `user_id = auth.uid()`.
* Functions: `get_distinct_income_sources()`, `get_distinct_bill_payees()` created.

**Next Planned Task:**
* Start implementing the **Allocation Mechanism (T15)**. The initial plan is to add an `eventClick` handler to the calendar in `CalendarView.tsx`. When a *bill* event is clicked, it should open a Modal component displaying bill details and allowing the user to select an income source and amount to allocate, then save this to the `allocations` table.

**Next Planned Task:** Implement Allocation UI/Logic...

**Workflow Note:** Please continue generating DEV LOG entries and updating taskss.md with updated statuses and added, deleted or changed tasks at the end of relevant steps during this session.

**Open Questions/Decisions:**
* Need to define the UI/UX for creating allocations (Modal triggered by clicking a bill event?).
* Need logic for tracking/displaying unallocated income amounts.