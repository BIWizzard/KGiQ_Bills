# KG iQ Bills Tracker - Session Context: 2025-04-19 (Session 3 End)

**Project:** KG iQ Bills Tracker

**Goal:** Build a React web application for managing family finances, specifically tracking income and bill payments on a calendar and allowing users to allocate income to specific bills.

**Tech Stack:**
* Frontend: React 19, Vite 6, TypeScript, Tailwind CSS (v3), React Router v7.5
* Backend: Supabase (PostgreSQL Database, Auth)
* UI Libraries: FullCalendar (@fullcalendar/react, @fullcalendar/daygrid), Floating UI (@floating-ui/react)
* Version Control: Git, GitHub
* Node Management: Volta (pinned Node v20.11.0)

**Current Status:**
* **Branch:** `dev`
* **Last Task Completed:** T15 - Implement Allocation UI/Logic
* **Next Task:** T16 - Enhanced Allocation System with Visual Indicators
* **Working Features:**
    * User Authentication: Login, Signup forms functional with Supabase Auth
    * Protected Routes: Homepage redirects unauthenticated users to `/login`
    * Database: Supabase project with `income_events`, `bill_events`, and `allocations` tables
    * Data Entry: `AddIncomeForm` and `AddBillForm` components with autocomplete
    * Calendar View: `CalendarView` component displaying income (green) and bill (wine) events with hover cards
    * Allocation: Basic allocation mechanism allowing users to link bill events to income events
    * Financial Summary: Homepage displays income, bills, and allocation status

**Key Code Files:**
* `src/components/calendar/CalendarView.tsx` - Calendar component with FullCalendar integration
* `src/components/forms/AllocationForm.tsx` - Form for creating allocations between income and bills
* `src/components/modals/AllocationModal.tsx` - Modal wrapper for the allocation form
* `src/components/common/Modal.tsx` - Reusable modal component
* `src/pages/HomePage.tsx` - Main page with financial summary and calendar
* `src/types/index.ts` - Shared type definitions

**Supabase Schema:**
* `income_events`: `id, created_at, user_id, source, expected_date, expected_amount, is_recurring, notes`
* `bill_events`: `id, created_at, user_id, payee, description, due_date, amount_due, is_recurring, payment_method, notes`
* `allocations`: `id, created_at, user_id, income_event_id, bill_event_id, allocated_amount`

**Session 3 Achievements:**
* Implemented a complete allocation system allowing users to link bill events to income events
* Created a modal-based UI triggered by clicking on a bill event
* Added financial summary section showing income, bills, and allocation status
* Fixed error handling in the application, including handling missing tables
* Optimized performance to reduce forced reflows

**Limitations Identified:**
* Bills lack status tracking (unpaid, scheduled, paid)
* No visual indication of allocation status on calendar events
* Partial payments don't update bill's remaining balance
* Multiple allocations to the same bill not fully supported

**Session 4 Plan - T16:**
* Enhance bill events schema to include status and remaining amount
* Modify allocation form to handle partial payments and update bill status
* Add visual indicators to the calendar for different bill statuses
* Improve overall user experience with better feedback on allocation status

**Technical Notes:**
* Allocation mechanism currently treats bills as one-time events without status tracking
* Code organization improved with centralized types directory
* Performance optimizations implemented with React.useMemo
* Callbacks for refresh used to ensure synchronization between calendar and financial summary