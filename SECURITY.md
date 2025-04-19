# Security Policy - KG iQ Bills Tracker

## Supported Versions

Currently, only the latest version of the code on the `main` branch is actively maintained. As this project is in early development, specific version support is not yet formally defined.

## Reporting a Vulnerability

The KG iQ Bills Tracker team and community take security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security vulnerability, please **do not** create a public GitHub issue. Instead, send an email with the details to:

**biwizard@kmghub.com**

Please include the following information in your report:

* A clear description of the vulnerability.
* Steps to reproduce the vulnerability.
* Any potential impact you foresee.
* Your name/handle for acknowledgement (optional).

We will endeavor to acknowledge receipt of your vulnerability report within 48 hours and provide a timeline for addressing it.

## Security Measures in Place

* **Supabase Auth:** We rely on Supabase's built-in authentication for user management and session handling.
* **Row Level Security (RLS):** Database tables (`income_events`, `bill_events`, `allocations`) have RLS enabled to ensure users can only access their own data.
* **Environment Variables:** Sensitive keys (Supabase URL, Anon Key) are managed via environment variables (`.env`) and are not committed to the repository (`.gitignore`).
* **Dependency Management:** We aim to keep dependencies up-to-date and periodically run `npm audit` to check for known vulnerabilities in dependencies.

Thank you for helping keep KG iQ Bills Tracker secure!
