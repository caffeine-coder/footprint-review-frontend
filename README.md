# Product Footprint Review - Frontend

A small React app for reviewing product carbon footprint submissions. Stack used are React, TypeScript, Vite, Redux Toolkit, Axios and Mantine.

## Stack choice

- **React and TypeScript** - Used React because I'm familiar with it and TypeScript to keep the data models and component props typed.
- **Redux Toolkit** - Used to manage the footprint data and selected submission across components.
- **Mantine** - Good reusable components
- **Axios** - Used for API requests and handling responses.
- **Jest and React Testing Library** - Added for a few basic unit and component tests.

I kept the project structure simple with separate folders for API calls, components, hooks and Redux state.

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

## Trade-offs

I tried to keep the implementation simple and focus on the review flow rather than adding too many features.

- Used Mantine instead of building all the UI components from scratch.
- Kept it as spa instead of introducing routing.
- Used server-side pagination with a fixed page size of 10.
- Kept the search debounce in a small custom hook.
- Didn't add client-side caching since the API already supports pagination and filtering.
- Added a few basic tests rather than trying to cover every component.

## Future improvements

- More test coverage
- Add caching for already fetched data
- Improve API error messages shown to users.
- Work more on accessibility

## AI usage

- I used AI to understand the emissions data model because this domain was new to me, and to help set up the initial app skeleton. 
- Used AI to refine pipeline scripts a bit to fasten the process
- Core logic, components and data handling were completey written and adjusted by me, with some implementation suggestions and debugging help from AI. 
- To enhance readme
