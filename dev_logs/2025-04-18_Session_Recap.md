# KG iQ Bills Tracker - Session Recap: 2025-04-18

**Session Duration:** Approx. 6 hours 15 minutes (Ending ~11:14 PM EDT)

**Focus Allocation (Estimated):**
* **Environment Configuration & Troubleshooting:** ~3 hours 00 minutes
    * *Includes cross-platform Node version debugging (NVM/Volta/Manual conflicts), `npx`/Tailwind install issues, Git commit/`.gitignore` fixes, editor linting issues.*
* **Planning & Foundational Development:** ~3 hours 15 minutes
    * *Includes initial project planning, PRD/README drafting, Vite initialization, Tailwind configuration, basic Layout/Theme setup, Supabase client setup, React Router provider setup.*

**Summary of Activities:**

Today marked the kickoff for the KG iQ Bills Tracker project. The session focused heavily on establishing a robust and consistent cross-platform (macOS/Windows) development environment and laying the foundational groundwork for the application.

**Key Accomplishments (Forward Momentum):**

* **Project Definition:** Defined project scope, goals, tech stack (React, Vite, TS, Tailwind v3, Supabase, Netlify), and MVP via PRD.
* **Initial Setup:** Initialized Vite project, created core documentation (`README.md`, `PRD.md`, `TASKS.md`).
* **Cross-Platform Strategy:** Defined best practices for consistency using Git, Volta (for Node version management), npm lock files, VS Code workspace settings/extensions, `.env` handling, and `.gitattributes`.
* **Mac Environment Setup:** Successfully cloned the repository onto macOS and configured Volta.
* **Tailwind CSS:** Installed and configured Tailwind CSS (v3) with custom KG iQ brand colors and basic dark mode (`media` strategy).
* **Basic Layout:** Created and integrated a `Layout.tsx` component providing a header, footer, and main content structure.
* **Supabase Client:** Created the `supabaseClient.ts` utility for centralized client initialization using environment variables.
* **React Router:** Installed `react-router-dom` and set up the necessary `<BrowserRouter>` provider in `main.tsx`.
* **VS Code:** Created `.vscode/extensions.json` to recommend helpful extensions.

**Challenges & Resolutions (Remediation Effort):**

1.  **Node Version Conflict on Mac (Major Roadblock):** Significant time (~1h 45m) spent troubleshooting Node version management due to conflicts between existing NVM and manual Node installs overriding the intended Volta setup.
    * **Fix:** Required systematic diagnosis (`which node`, `echo $PATH`, checking profile files). Resolved by correctly commenting out NVM in `.zshrc`, confirming Volta's setup in `.zshenv`, identifying/removing the conflicting PKG install with `sudo rm /usr/local/bin/node`.

2.  **`npx tailwindcss init -p` Failure:** Repeated failures (~17m) of `npx` to run `tailwindcss` (v4).
    * **Fix:** Debug logs and checking `package.json` revealed a missing `"bin"` field in the installed package. Switching to Tailwind v3 (`npm install -D tailwindcss@3`) resolved the issue.

3.  **Accidental Git Commit of `.env`:** An `.env` file (with incorrect project keys) was committed and pushed (~50m, overlapping with Node issue).
    * **Fix:** Confirmed push status, prioritized immediate key rotation for the exposed project (`kgiq-portfolio`), updated `.gitignore`, and removed the file from Git tracking using `git rm --cached .env` followed by a new commit.

4.  **Editor Error (`@tailwind`):** VS Code flagged `@tailwind` directives as unknown (~20m).
    * **Fix:** Verified Tailwind extension was active, restarted VS Code. Issue persisted. Applied workspace setting `"css.lint.unknownAtRules": "ignore"` in `.vscode/settings.json` as a workaround.

5.  **Minor Issues:** Addressed pasting comments into the terminal, using an incorrect npm tag, saving the shell profile to the wrong directory, and `App.tsx` not being updated correctly initially.

**Current Status & Next Steps:**

The project foundation is solid and running consistently on macOS. The basic layout and dark theme (using KG iQ colors) are implemented. All major environment and Git issues encountered today have been resolved.

The next step is **T7: Implement basic Auth components**, starting with `LoginForm.tsx`.