# Product Requirements Document (PRD): KG iQ - Bills Tracker

**Version:** 0.3
**Date:** 2025-04-19
**Author:** KG iQ Development Team

## 1. Introduction

KG iQ - Bills Tracker is a web application designed to help individuals and families manage their finances by providing a clear visual timeline of income events (paychecks, direct deposits) and bill payments. Its core differentiator is the ability to intentionally allocate funds from specific income sources to specific bills, promoting conscious spending and better cash flow management. The application features a clean, interactive calendar as its central UI element.

## 2. Goals

* Provide users with a clear, visual representation of upcoming income and expenses on a calendar.
* Enable users to easily track expected income and scheduled bill payments.
* Facilitate intentional allocation of funds from specific income events to cover specific bills.
* Support splitting bill payments across multiple dates with individual tracking.
* Track the remaining balance of income pools after allocations.
* Simplify the management of recurring income and bills.
* Allow tracking of partial or split bill payments.
* Offer basic reporting on spending categories relative to income periods.
* Serve as an effective learning project for full-stack development using React, Vite, Tailwind, Supabase, and Netlify.

## 3. Target Audience

* Individuals or families seeking better visibility and control over their cash flow timing.
* Users who want to be more intentional about how specific income covers specific expenses.
* Users comfortable with web applications for managing personal finances.

## 4. Core Features (Functional Requirements)

### 4.1 User Authentication

* Users must be able to sign up, log in, and log out securely.
* User data (income, bills, allocations) must be tied to their account and kept private.
* (Tech: Supabase Auth - Email/Password initially).

### 4.2 Central Calendar View

* Display a monthly/weekly calendar view as the primary interface.
* Visually differentiate income events and bill events on the calendar (e.g., color-coding, icons).
* Status-based color coding for bill events (unpaid, scheduled, paid, canceled).
* Allow users to navigate between months/weeks.
* Clicking on a date could potentially initiate adding a new event for that date.
* Clicking on an event should open a detail view or modal.
* Support drag-and-drop for rescheduling allocation payments.
* (Tech: `FullCalendar` React component).
* Visual indicators for bill payment status (unpaid, scheduled, paid, canceled).

### 4.3 Income Event Management

* Users can create new income events (Source, Expected Date, Expected Amount).
* Users can mark income events as recurring (e.g., bi-weekly, monthly) with appropriate scheduling logic.
* Users can view, edit, and delete income events.
* System should track the total expected income within selected timeframes.
* Track unallocated income with clear visual progress indicators.
* (Optional V1.1): Track actual deposit date and amount if different from expected.

### 4.4 Bill Event Management

* Users can create new bill events (Payee, Description (optional), Due Date, Amount Due, Payment Method (optional)).
* Users can mark bill events as recurring (e.g., monthly, annually).
* Users can view, edit, and delete bill events.
* System tracks bill status (unpaid, scheduled, partially paid, paid, canceled).
* Users can manually change bill status.
* System tracks remaining balance for bills that are partially paid.
* Provide a dedicated bill management interface with filtering and sorting.

### 4.5 Income Pool Tracking

* The system calculates and displays the total amount of income received (or expected) within a period that has *not yet* been allocated to a bill.
* Visual progress bars showing allocation percentage.
* Summary statistics for income allocation status.

### 4.6 Allocation Mechanism

* Users must be able to link specific bill events (or portions thereof) to specific income events.
* When viewing an income event, users should see a list of bills allocated to it and the remaining unallocated amount from that specific income event.
* When viewing a bill event, users should see which income event(s) are allocated to pay it.
* The system must prevent over-allocation from a single income event.
* Support for partial allocations to a bill, maintaining the remaining balance.
* Bill status automatically updates based on allocation amounts (scheduled when partially allocated, paid when fully allocated).
* Support for allocation scheduling with specific dates for each partial payment.
* Tracking individual allocation status (pending, paid, canceled).
* Ability to edit and delete existing allocations.

### 4.7 Split Payment Tracking

* Users can record partial payments towards a bill.
* Each allocation can have its own scheduled date and status.
* The system must track the remaining amount due on a bill after partial payments.
* The bill event on the calendar should visually indicate its status (Unpaid, Partially Paid, Paid).
* Users should be able to schedule future partial payments if desired.
* Allow for rescheduling payments via drag-and-drop or edit form.

### 4.8 Allocation Management Interface

* Dedicated interface for viewing and managing all allocations.
* Filtering and sorting options (by date, status, bill, income source).
* Actions to edit, reschedule, mark as paid, or delete allocations.
* Visual representation of allocation relationships.

### 4.9 Basic Reporting

* Provide simple reports showing spending breakdown (categorized, if categories are added) per income event or time period (e.g., month).
* Summary statistics for income allocations and bill coverage.
* Visual progress indicators for overall financial state.

## 5. Non-Functional Requirements

### 5.1 Technology Stack

* Frontend: `React` (with `Vite`), `TypeScript`
* Styling: `Tailwind CSS`
* Backend & Database: `Supabase` (PostgreSQL, Auth, Realtime optional)
* Deployment: `Netlify`

### 5.2 Performance

* The application should load quickly and interactions (rendering events, opening modals) should feel responsive. Database queries should be optimized.
* Minimize forced reflows and unnecessary re-renders to improve UI performance.

### 5.3 Security

* User data must be secured via authentication. Sensitive keys (Supabase API keys) must not be exposed client-side inappropriately (use environment variables). Row Level Security (RLS) should be enabled in Supabase.

### 5.4 Usability

* The interface should be clean, intuitive, and easy to navigate. Minimal financial jargon. The calendar should be the clear focal point.
* Consistent visual feedback for statuses and actions.
* Drag-and-drop interactions where appropriate.

### 5.5 Maintainability

* Code should be well-organized, commented where necessary, and follow React best practices. TypeScript should be used for type safety.
* Shared types should be centralized in a types directory to ensure consistency across components.

## 6. Design & UI/UX

* Clean, modern aesthetic leveraging `Tailwind CSS` utility classes.
* Adherence to KG iQ branding guidelines (colors, fonts, logo placement if applicable).
* Focus on visual clarity for the calendar and event representation.
* Responsive design for usability on different screen sizes (desktop focus initially).
* Clear visual indicators for different bill statuses (unpaid, scheduled, paid, canceled).
* Progress bars for showing allocation and payment status.
* Consistent color coding across the application.

## 7. Release Criteria (MVP - Minimum Viable Product)

* User Authentication (Signup, Login, Logout).
* Basic Calendar display.
* CRUD operations for Income Events (non-recurring only for MVP).
* CRUD operations for Bill Events (non-recurring only for MVP).
* Display income and bill events on the calendar.
* Allocation Mechanism: Ability to select a bill event and allocate income to it, with support for partial payments.
* Visual indicators for bill payment status on the calendar.
* Basic display of unallocated income pool (sum of unallocated amounts from income events).
* Financial summary dashboard showing income, bills, allocations and coverage.

## 8. Future Considerations

* Advanced recurring event options (more complex rules).
* Budget goal setting and tracking (e.g., 60/20/20 rule visualization).
* More sophisticated reporting and data export.
* Bill payment reminders/notifications.
* Integration with financial APIs (e.g., Plaid) - *Significant complexity increase*.
* Mobile-specific UI improvements or PWA features.
* Event categorization and filtering.
* Debt tracking/paydown tools.
* Budgeting forecasts and what-if scenarios.
* Multi-currency support.
* Savings goals and tracking.

## 9. Development Roadmap & Status

### Completed Features:
* User Authentication
* Basic Calendar View
* Income Event Creation
* Bill Event Creation
* Basic Allocation Mechanism
* Enhanced Bill Status System
* Visual Indicators for Allocation Status
* Financial Summary with Progress Bars

### In Progress:
* Enhanced Allocation System with Split Payment Support
* Individual Allocation Status Tracking
* Drag-and-drop Rescheduling
* Allocation Management Interface

### Backlog:
* Recurring Events
* Budget Categorization
* Reporting and Analytics
* Payment Reminders