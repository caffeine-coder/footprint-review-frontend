# Product Footprint Review - Frontend

A small React app for reviewing product carbon footprint submissions. Stack used are React, TypeScript, Vite, Redux Toolkit, Axios and Mantine.

## Run with Docker

You'll need Docker Desktop. Start the [backend](https://github.com/caffeine-coder/footprint-review-backend) first.

```bash
git clone https://github.com/caffeine-coder/footprint-review-frontend.git
cd footprint-review-frontend
docker compose up --build -d
```

Open `http://localhost:3000`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@demo.local | footprint_demo_2026 |
| Editor | editor@demo.local | footprint_demo_2026 |
| Viewer | viewer@demo.local | footprint_demo_2026 |

Admin and Editor can approve or reject submissions. Viewer can only view them.

## Run locally without Docker

Start the backend, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deployment

I also created a small automation through gihtub actions to host this on AWS. Every push to main triggers a build to publish docker image to Aws ecr and it then is deployed to ec2 through a document setup. Used a subdomain from my existing portfolio domain to access the app.

Open `https://footprint.thecaffeinecoder.com`

## Features

- Login and role-based access
- List, search and filter submissions
- Pagination and risk flags
- View details and review history
- Approve or reject with an optional comment
- Loading, empty and error states

The UI calls the backend through `/api`. Nginx handles this in Docker and Vite handles it during local development. The Docker setup uses `host.docker.internal`, so it is intended for Docker Desktop.

## AI usage

- I used AI to understand the emissions data model because this domain was new to me, and to help set up the initial app skeleton. 
- Used AI for automation scripts a bit to fasten the process
- Core logic, components and data handling were completey written and adjusted by me, with some implementation suggestions and debugging help from AI. 
- I reviewed and tested the application myself and can explain how it works.
