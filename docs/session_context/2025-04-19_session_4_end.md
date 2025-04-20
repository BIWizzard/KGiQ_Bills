# KG iQ Bills Tracker - Session Context: 2025-04-19 (Session 4 End)

**Project:** KG iQ Bills Tracker

**Goal:** Build a React web application for managing family finances, specifically tracking income and bill payments on a calendar and allowing users to allocate income to specific bills.

**Tech Stack:**
* Frontend: React 19, Vite 6, TypeScript, Tailwind CSS (v3), React Router v7.5
* Backend: Supabase (PostgreSQL Database, Auth)
* UI Libraries: FullCalendar (@fullcalendar/react, @fullcalendar/daygrid), Floating UI (@floating-ui/react)
* Version Control: Git, GitHub
* Node Management: Volta (pinned Node v20.11.0)

**Current Status:**
* **Branch:** `feature/T16-enhanced-bill-status` (Ready for PR to main)
* **Task T16 Status:** Completed - Enhanced Bill Status and Visual Indicators
* **Working Features:**
    * User Authentication: Login, Signup forms functional with Supabase Auth
    * Protected Routes: Homepage redirects unauthenticated users to `/login`
    * Database: Supabase project with enhanced tables including bill status and remaining amount
    * Data Entry: `AddIncomeForm` and `AddBillForm` components with autocomplete and status selection
    * Calendar View: `CalendarView` component with status-based color coding and visual indicators
    * Allocation: Enhanced allocation mechanism with partial payment support and bill status tracking
    * Financial Summary: Homepage displays comprehensive income allocation and bill coverage with progress bars
    * Linting issues resolved throughout the codebase

**Next Task:** T17 - Enhanced Allocation Management System
* **Planned Features:**
    * Add scheduled_date field to allocations (critical for MVP)
    * Add status field to individual allocations (pending, paid, canceled)
    * Implement editable allocations (amount, source, date)
    * Create drag-and-drop rescheduling functionality
    * Develop a dedicated allocation management interface
    * Enable manual status changes for both bills and allocations

**Key Files:**
* `src/components/calendar/CalendarView.tsx` - Calendar component with FullCalendar integration
* `src/components/forms/AllocationForm.tsx` - Form for creating allocations between income and bills
* `src/components/modals/AllocationModal.tsx` - Modal wrapper for the allocation form
* `src/components/common/Modal.tsx` - Reusable modal component
* `src/pages/HomePage.tsx` - Main page with financial summary and calendar
* `src/types/index.ts` - Shared type definitions

**Supabase Schema:**
* `income_events`: `id, created_at, user_id, source, expected_date, expected_amount, is_recurring, notes`
* `bill_events`: `id, created_at, user_id, payee, description, due_date, amount_due, is_recurring, payment_method, notes, status, remaining_amount`
* `allocations`: `id, created_at, user_id, income_event_id, bill_event_id, allocated_amount`
* **Planned Schema Updates:**
    * Add `scheduled_date` to `allocations` table (critical for MVP)
    * Add `status` field to `allocations` table
    * Update triggers to handle individual allocation status

**Workflow Plan for Session 5:**
1. Execute SQL script to update allocations table schema with new fields
2. Update shared type definitions to include allocation status and scheduled date
3. Modify AllocationForm to support scheduled dates
4. Implement allocation editing functionality
5. Develop drag-and-drop functionality for the calendar
6. Create an allocation management page
7. Implement manual status update functionality

**Note on Scheduling:** The ability for users to explicitly select a scheduled date for each allocation is a critical component of the MVP. This scheduling functionality is essential to the core value proposition - allowing users to intentionally decide when payments will occur from specific income sources.