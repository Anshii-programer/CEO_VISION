# CEO Vision CRM

A responsive CRM dashboard built with React, Vite, and Express. CRM records are saved locally in `backend/data/crm-data.json`.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm

## Run the project

1. Open PowerShell in the project folder:

   ```powershell
   cd "C:\Users\ankit\Desktop\CEO_VISION\CEO_VISION"
   ```

2. Install the root, frontend, and backend packages:

   ```powershell
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

3. Start the frontend and backend together:

   ```powershell
   npm run dev
   ```

4. Open the Vite URL printed in the terminal (usually `http://localhost:5173`). If port 5173 is busy, Vite prints an alternate port, such as `http://localhost:5174`.

The frontend uses the API at `http://localhost:5000/api` by default. Set `VITE_API_URL` in a frontend `.env` file to use a different API URL. The backend port can be changed with `PORT` in the root `.env` file.

### Run in two terminals

If you prefer to start each service separately, run these from the project folder:

Terminal 1:

```powershell
npm run server
```

Terminal 2:

```powershell
npm run client
```

## Features

- Dashboard with summaries, pipeline, activity, calendar, and team panels.
- Routed client, lead, deal, project, task, calendar, employee, ticket, report, analytics, assistant, settings, and notification pages.
- Eight industry workspaces: enterprise, startup, small business, e-commerce, healthcare, education, real estate, and finance.
- Create records, update their status, delete records, search, and export CSV reports.
- API health check at `http://localhost:5000/api/health`.
- Records persist locally in `backend/data/crm-data.json`; this file is created automatically the first time the backend starts.

## Useful commands

```powershell
npm run dev
npm run client
npm run server
npm run build --prefix frontend
npm run lint --prefix frontend
```
