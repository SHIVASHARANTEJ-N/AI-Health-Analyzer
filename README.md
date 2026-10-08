# AI Health Analyzer

A web application that helps people understand their medical reports. A user signs in, uploads a report or scan, and gets a plain-language explanation along with a risk level and a suggested next step.

This is a student team project made for learning. It is not a medical device and does not replace a doctor's advice.

## Features

- **User accounts.** Each user signs in with their own account.
- **Report upload.** Accepts medical reports and scans such as X-rays and CT scans.
- **Plain-language explanation.** The AI explains what the report shows in simple words.
- **Risk score.** Each report gets a score that falls into one of three levels:

  | Level | What the app suggests |
  |---|---|
  | Low | No serious concern. A routine check with a doctor is suggested. |
  | Medium | Consult a doctor and follow their advice. |
  | High | Treated as critical. The app shows nearby hospitals and doctors so the user can book an appointment. |

## Built with

- React 18 and TypeScript
- Vite
- Tailwind CSS with Radix UI components
- Supabase (backend and storage)
- React Router
- TanStack Query
- Recharts
- React Hook Form and Zod

## How to run

1. Clone the repository:

   ```
   git clone https://github.com/SHIVASHARANTEJ-N/AI-Health-Analyzer.git
   cd AI-Health-Analyzer
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Create a file named `.env` in the project folder with your own Supabase project details:

   ```
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_URL=https://your_project_id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open the local address that Vite prints in the terminal.

## Project structure

| Path | Purpose |
|---|---|
| `src/` | React application code |
| `public/` | Static files |
| `supabase/` | Supabase configuration |

## Disclaimer

The explanations and scores come from an AI model and can be wrong. Always confirm results with a qualified doctor.

## Team

Built as a team project.

Repository maintained by Shiva Sharan Tej Nallamalli

- GitHub: [SHIVASHARANTEJ-N](https://github.com/SHIVASHARANTEJ-N)
- LinkedIn: [shiva-sharan-tej-nallamalli](https://www.linkedin.com/in/shiva-sharan-tej-nallamalli/)
