# KG iQ Bills Tracker - Lessons Learned Log

*This log captures key takeaways and best practices identified during development, aiming to improve efficiency and avoid repeating issues.*

## Session 1: 2025-04-18 (Initial Setup & Environment Configuration)

### 1. Rigorous Environment Baselining & Consistency (Node Versioning)

* **Issue:** Significant time lost troubleshooting conflicting Node.js installations (NVM, Homebrew PKG, Manual Install) overriding the intended Volta setup on macOS.
* **Lesson:** Before starting work (especially when switching machines or after installs), **always explicitly verify** the active `node`, `npm`/`yarn` versions AND the command path (`which node`, `echo $PATH`) *within the project directory* to ensure the correct version manager (Volta) is active and prioritized.
* **Best Practice (New Projects):** Standardize on **one** Node version manager (Volta recommended for cross-platform). Ensure it's the *only* one active in shell startup files (`.zshenv`, `.zprofile`, `.zshrc`, `.bash_profile`) on *all* dev machines. Pin the project's Node version (`package.json` `"volta"` key or `.nvmrc`) immediately and commit it.

### 2. Verify Core Tooling (`npx`, Package Installations) Early

* **Issue:** `npx tailwindcss init` failed repeatedly due to a seemingly corrupted local package (`tailwindcss@4` missing `bin` field), requiring a version downgrade to `tailwindcss@3`. `npm install` reported success misleadingly.
* **Lesson:** If a CLI command via `npx`/`yarn dlx` fails unexpectedly, suspect package installation issues. Quickly verify the package exists correctly in `node_modules` (check `package.json`, check for expected binary/script via `bin` field). Try running the command directly (`node node_modules/.../cli.js ...`) to bypass `npx` discovery.
* **Best Practice (New Projects):** Add simple "smoke tests" after installing core CLI tools (e.g., `npx tailwindcss --help`). Be ready to try slightly older stable versions if the absolute latest exhibits issues with the chosen Node/npm setup.

### 3. Strict Git Hygiene for Secrets

* **Issue:** `.env` file containing secrets was accidentally committed and pushed. Required immediate key rotation and careful Git history cleanup.
* **Lesson:** Always double-check `git status` and `git diff --staged` *before* committing, specifically looking for sensitive files. Avoid `git add .` or `git commit -a` without careful review.
* **Best Practice (New Projects):** Initialize Git immediately. Create and commit a comprehensive `.gitignore` (including `.env`, `.env.*`, `!.env.example`) *before the first code commit*. Create and commit `.env.example` early.

### 4. Editor Configuration & Workspace Settings

* **Issue:** VS Code flagged valid `@tailwind` directives as errors, requiring a settings workaround (`css.lint.unknownAtRules: "ignore"`).
* **Lesson:** If the build tool (`vite`/`npm run dev`) succeeds but the editor shows syntax errors for framework-specific rules, suspect editor/extension configuration first. Restart VS Code & relevant language servers.
* **Best Practice (New Projects):** Use `.vscode/settings.json` and `.vscode/extensions.json` from the start. Commit project-specific settings (formatters, lint rule adjustments like `css.lint.unknownAtRules`) and extension recommendations early. Install recommended extensions promptly.

### 5. Incremental Verification

* **Issue:** Several problems were discovered later than necessary because intermediate steps weren't fully verified (assuming installs worked, assuming profile edits were saved/effective).
* **Lesson:** After each significant configuration or setup step, run a quick verification command (`node -v`, `which node`, `git status`, `npm run dev`, check browser console) to confirm the expected outcome *before* proceeding.
* **Best Practice (New Projects):** Create/follow a simple scaffolding checklist incorporating these verification steps.

---
*(Add new lessons below this line in future sessions)*