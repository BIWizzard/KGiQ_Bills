# Contributing to KG iQ Bills Tracker

Thank you for your interest in contributing to the KG iQ Bills Tracker! Whether it's reporting a bug, suggesting a feature, or writing code, your contributions are welcome.

## Table of Contents

* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Environment Variables](#environment-variables)
* [Development Workflow](#development-workflow)
    * [Branching Strategy](#branching-strategy)
    * [Code Style & Linting](#code-style--linting)
    * [Commit Messages](#commit-messages)
* [Submitting Changes](#submitting-changes)
    * [Pull Request Process](#pull-request-process)
* [Reporting Bugs & Suggesting Features](#reporting-bugs--suggesting-features)

## Getting Started

### Prerequisites

* **Git:** For version control.
* **Volta:** For managing Node.js and npm versions consistently. ([Install Volta](https://volta.sh/))
* **Node.js & npm:** Volta will automatically install and manage the correct versions pinned in `package.json`.
* **Supabase Account:** You'll need a free Supabase account and a project set up to get API keys.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BIWizzard/KGiQ_Bills.git 
    cd KGiQ_Bills
    ```
2.  **Install Dependencies:** Volta automatically picks up the Node/npm version from `package.json`. Then install project dependencies.
    ```bash
    npm install
    ```

### Environment Variables

1.  **Copy the example file:**
    ```bash
    cp .env.example .env
    ```
2.  **Populate `.env`:** Open the newly created `.env` file and add your Supabase Project URL and Anon Key obtained from your Supabase project dashboard. Remember that Vite requires these variables to be prefixed with `VITE_`.
    ```dotenv
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    *Note: The `.env` file is included in `.gitignore` and should **never** be committed.*

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:5173`.

## Development Workflow

### Branching Strategy

* `main`: Represents the latest stable release. Direct commits are discouraged. Merges happen via Pull Requests from `dev`.
* `dev`: The main integration branch for ongoing development. New features are merged into `dev` first.
* **Feature Branches:** Create new branches off `dev` for specific features or bug fixes (e.g., `feat/add-reporting`, `fix/calendar-display-bug`). Name branches descriptively.

    ```bash
    # Ensure you are on the latest dev branch
    git checkout dev
    git pull origin dev
    # Create your feature branch
    git checkout -b feat/your-feature-name
    ```

### Code Style & Linting

* This project uses **ESLint** and **Prettier** for code linting and formatting (ensure these are configured if not already).
* Please run the linter before committing:
    ```bash
    npm run lint
    ```
* Consider configuring your VS Code editor to use the recommended ESLint and Prettier extensions (defined in `.vscode/extensions.json`) to auto-format on save.

### Commit Messages

* Please follow the **Conventional Commits** specification ([https://www.conventionalcommits.org/](https://www.conventionalcommits.org/)). This helps maintain a clear and automated commit history.
* Examples:
    * `feat(auth): Add signup form component`
    * `fix(calendar): Correct event color contrast`
    * `refactor(layout): Improve navbar responsiveness`
    * `chore: Update dependencies`
    * `docs: Add contributing guidelines`

## Submitting Changes

### Pull Request Process

1.  Ensure your work is committed on your feature branch.
2.  Push your feature branch to the remote repository:
    ```bash
    git push origin feat/your-feature-name
    ```
3.  Go to the repository on GitHub.
4.  Create a new Pull Request (PR) comparing your `feat/your-feature-name` branch against the **`dev` branch**.
5.  Fill in a clear title and description for your PR, explaining the changes and referencing any related issues.
6.  Once the PR is reviewed and approved (if applicable), it can be merged into `dev`.
7.  Periodically, changes from `dev` will be merged into `main` via a separate PR process for releases.

## Reporting Bugs & Suggesting Features

* Please use the **GitHub Issues** tab in the repository to report bugs or suggest new features.
* Provide as much detail as possible, including steps to reproduce for bugs, or clear descriptions and rationale for feature requests.

---

Thank you for contributing!
