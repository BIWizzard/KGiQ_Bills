# KG iQ - Bills Tracker

A web application designed to help manage personal finances by visualizing income and bill payment schedules on a calendar and enabling intentional allocation of funds.

## Overview

KG iQ Bills Tracker helps you gain clarity on your cash flow. Instead of just knowing *what* bills are due, you can plan *which* income will cover *which* expenses. See your paychecks and bills side-by-side on a calendar, allocate funds intentionally, and track your spending against your income.

## Features (Planned)

* Secure User Authentication
* Interactive Calendar View (Monthly/Weekly)
* Create, View, Edit, Delete Income Events (Recurring & Ad Hoc)
* Create, View, Edit, Delete Bill Events (Recurring & Ad Hoc)
* Allocate funds from specific Income Events to specific Bill Events
* Track remaining balance on Income Events after allocation
* Track Bill Payment Status (Unpaid, Partially Paid, Paid)
* Support for Split/Partial Bill Payments
* Basic Spending Reports (Future)
* Budget Goal Tracking (Future)

## Tech Stack

* **Frontend:** React, Vite, TypeScript
* **Styling:** Tailwind CSS
* **Calendar:** FullCalendar (`@fullcalendar/react`)
* **Backend/Database:** Supabase (PostgreSQL, Auth)
* **Deployment:** Netlify

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18 or later recommended)
* npm or yarn
* Git
* A Supabase account ([supabase.io](https://supabase.io/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd kgiq-bills-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    * Create a Supabase project if you haven't already.
    * Find your Project URL and `anon` key in your Supabase project settings (API section).
    * Make a copy of the example environment file:
        ```bash
        cp .env.example .env
        ```
    * Edit the `.env` file and add your Supabase credentials:
        ```dotenv
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
    * **Important:** Ensure Row Level Security (RLS) is enabled on your Supabase tables once created.

4.  **Set up Supabase Database:**
    * Use the Supabase SQL editor or Table editor to create the necessary tables (e.g., `profiles`, `income_events`, `bill_events`, `payments`, `allocations`). Refer to the project documentation or initial migration scripts (once created) for the required schema.

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application should now be running locally, typically at `http://localhost:5173`.

## Deployment

This project is set up for easy deployment via Netlify:

1.  Connect your Git repository to Netlify.
2.  Configure the build settings:
    * **Build command:** `npm run build`
    * **Publish directory:** `dist`
3.  Add your Supabase environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) to the Netlify site's environment variables settings.
4.  Trigger a deploy.

## Contributing

(Details TBD - Guidelines for contributing to the project will be added here)

## License

(Specify License - e.g., MIT)
