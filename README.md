# Product Footprint Review - Frontend

A small React app for reviewing product carbon footprint submissions. Reviewers can find submissions, check their emissions data and approve or reject them.

Built with React, TypeScript, Vite, Redux Toolkit, Axios and Mantine.

## Run with Docker

Would need docker isntalled in system

 **Start the backend first**, using its own instructions:

https://github.com/caffeine-coder/footprint-review-backend

Then run:

```bash
git clone https://github.com/caffeine-coder/footprint-review-frontend.git
cd footprint-review-frontend
docker compose up --build -d
```

Open **http://localhost:3000**.

To stop the frontend:

```bash
docker compose down
```

The frontend is served by Nginx. It forwards `/api` requests to the backend running on port 8080 through `host.docker.internal`, which works with Docker Desktop. 

## Run locally without Docker

Make sure the backend is already running on `localhost:8080`.

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. Vite proxies `/api` requests to the backend during development.

## Features

- View submissions with emissions, uncertainty and review status
- Filter by status and search by product or supplier
- Debounced search to reduce API requests
- Server-side pagination (10 per page)
- View full details in a modal
- Approve or reject pending submissions with an optional comment
- Risk flags for high emissions and high uncertainty
- Loading, empty and error states

## Design choices

I kept the app as a small set of components, with Redux Toolkit for submission state and Axios for API calls. Mantine provides the table, form controls and modal, and CSS handles the styling. Search and pagination are done by the backend so the frontend doesn't need to fetch every record.

Risk flags use example thresholds (5,000 kg CO2e for high emissions and 30% for high uncertainty). These are only demo rules, not scientific or business-approved limits.

## AI usage

I used AI to understand the emissions data model because this domain was new to me, and to help set up the initial app skeleton. Core logic of app, compoenents and data handling is done by me with some implementation suggestions from AI. I reviewed, adjusted and tested the application logic myself and can explain how it works.
