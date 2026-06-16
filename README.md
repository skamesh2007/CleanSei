# CleanSei

Community-driven waste reporting platform for identifying, tracking, and visualizing environmental cleanliness issues in real time.

![Next.js](https://img.shields.io/badge/Next.js-16-red)
![React](https://img.shields.io/badge/React-19-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

---

## Overview

CleanSei enables users to report waste-related issues through geotagged reports and image submissions. The platform aggregates community-generated data to identify waste hotspots, improve visibility into local environmental conditions, and encourage community participation in maintaining cleaner public spaces.

The application combines location-aware reporting, interactive mapping, community engagement features, and real-time synchronization to create a scalable environmental monitoring solution.

### Key Benefits

* Real-time waste reporting and tracking
* Geolocation-based hotspot detection
* Community-driven environmental monitoring
* Interactive map visualization
* Mobile-first user experience
* Cloud-backed data synchronization

---

## Features

### Reporting

* Capture and upload waste reports
* Attach location metadata to reports
* Categorize environmental issues
* Track report status and updates

### Mapping & Visualization

* Interactive hotspot map
* Nearby hotspot discovery
* Location-based report clustering
* Real-time geographic insights

### Community

* Community discussions and announcements
* Contributor leaderboard
* Achievement and badge system
* Daily environmental goals

### User Management

* Firebase Authentication
* User profiles and activity tracking
* Personal contribution statistics
* Progress monitoring

### User Experience

* Responsive mobile-first interface
* Dark and light theme support
* Smooth animations and transitions
* Modern component-based architecture

---

## Architecture

```text
┌───────────────────────┐
│       Frontend        │
│ Next.js + React + TS  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Firebase Authentication│
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Cloud Firestore       │
│ Reports • Users       │
│ Community Data        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Interactive Mapping   │
│ React Leaflet         │
└───────────────────────┘
```

### Application Flow

1. User authenticates through Firebase.
2. User creates a waste report.
3. Report data is stored in Firestore.
4. Map and hotspot views update in real time.
5. Community members can view and interact with reports.

---

## Technology Stack

| Category         | Technologies                     |
| ---------------- | -------------------------------- |
| Frontend         | Next.js 16, React 19, TypeScript |
| Styling          | Tailwind CSS 4                   |
| UI Components    | Shadcn UI, Radix UI              |
| Authentication   | Firebase Authentication          |
| Database         | Cloud Firestore                  |
| Maps             | Leaflet, React Leaflet           |
| Animation        | Framer Motion                    |
| Theme Management | Next Themes                      |
| Code Quality     | ESLint, Prettier                 |
| Deployment       | Vercel                           |

---

## Project Structure

```text
CleanSei/
│
├── app/
│   ├── (main)/
│   │   ├── community/
│   │   ├── profile/
│   │   ├── report/
│   │   └── store/
│   └── auth/
│       ├── login/
│       └── register/
│
├── components/
│   ├── community/
│   ├── home/
│   ├── profile/
│   ├── report/
│   └── ui/
│
├── data/
│   ├── home/
│   └── profile/
│
├── hooks/
│
├── lib/
│   ├── firebase.ts
│   ├── home/
│   ├── profile/
│   └── report/
│
├── public/
│
└── types/
```

### Important Directories

| Directory     | Purpose                              |
| ------------- | ------------------------------------ |
| `app/`        | Next.js App Router pages             |
| `components/` | Reusable UI and feature components   |
| `lib/`        | Business logic and utility functions |
| `hooks/`      | Custom React hooks                   |
| `data/`       | Mock and static application data     |
| `public/`     | Static assets                        |
| `types/`      | Shared TypeScript definitions        |

---

## Installation

### Prerequisites

* Node.js 20+
* npm, pnpm, or yarn
* Firebase Project

### Clone Repository

```bash
git clone https://github.com/skamesh2007/cleansei.git

cd cleansei
```

### Install Dependencies

```bash
npm install
```

### Setup Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Run Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

## Configuration

### Firebase

Configure Firebase credentials inside `.env.local`.

### Firestore

Enable:

* Authentication
* Firestore Database

### Maps

The project uses Leaflet for map rendering and location visualization.

---

## Usage

### Authentication

1. Register a new account.
2. Sign in using Firebase Authentication.
3. Access community and reporting features.

### Create a Report

1. Open the Report page.
2. Capture or upload an image.
3. Attach location information.
4. Submit the report.

### Explore Hotspots

1. Open the dashboard.
2. Navigate to the hotspot map.
3. View nearby waste reports and trends.

---

## Screenshots

### Dashboard

```text
docs/images/dashboard.png
```

### Waste Reporting

```text
docs/images/reporting.png
```

### Hotspot Map

```text
docs/images/hotspot-map.png
```

---

## Performance & Scalability

### Current Optimizations

* Next.js App Router architecture
* Component-based rendering
* Firebase real-time synchronization
* Client-side route optimization
* TypeScript-based static validation

### Scalability Considerations

* Firestore horizontal scaling
* Serverless deployment model
* Modular component architecture
* Independent feature modules

---

## Security

### Authentication

* Firebase Authentication
* Session-based user management

### Data Protection

* Client-side input validation
* Firestore security rules
* Environment variable isolation

### Recommendations

* Restrict Firestore access rules
* Enable rate limiting
* Validate uploaded files
* Audit authentication flows regularly

---

## Testing

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

---

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Vercel

```bash
vercel deploy
```

### CI/CD Pipeline

Recommended workflow:

1. Pull Request Validation
2. Type Checking
3. ESLint Verification
4. Build Verification
5. Production Deployment

---

## Roadmap

* [ ] Report moderation workflow
* [ ] Advanced hotspot analytics
* [ ] Push notifications
* [ ] Gamification improvements
* [ ] Report verification system
* [ ] Administrative dashboard
* [ ] AI-assisted waste classification
* [ ] Progressive Web App support

---

## Contributing

Contributions are welcome.

### Development Workflow

```bash
git checkout -b feature/my-feature
```

```bash
git commit -m "feat: add new functionality"
```

```bash
git push origin feature/my-feature
```

Open a Pull Request describing:

* Problem addressed
* Proposed solution
* Screenshots (if applicable)
* Testing performed

### Coding Standards

* Follow TypeScript best practices
* Use ESLint and Prettier
* Maintain component modularity
* Write clear commit messages


---

## Author

**Kamesh**

Electronics and Communication Engineering Student
Software Developer | Builder | Technology Enthusiast

GitHub: https://github.com/skamesh2007

---

## Acknowledgements

* Next.js
* React
* Firebase
* Leaflet
* React Leaflet
* Tailwind CSS
* Shadcn UI
* Radix UI
* Framer Motion
