# ResidenceDesk — React Frontend
### Hostel / PG Complaint Management System

A complete React + Vite frontend that works with your Node.js / Express / MongoDB backend.

---

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx            # Email/password login → saves JWT → redirects
│   ├── Register.jsx         # Name/email/password/role → redirects to login
│   ├── Dashboard.jsx        # User's complaints list + stats + create button
│   ├── CreateComplaint.jsx  # Form to submit new complaint
│   └── AdminDashboard.jsx   # All complaints + dropdown to update status
│
├── services/
│   └── api.js               # Axios instance — auto-attaches JWT from localStorage
│
├── App.jsx                  # React Router routes + Protected/Admin route guards
├── main.jsx                 # ReactDOM render + BrowserRouter
└── index.css                # All styles (no Tailwind, no external UI library)
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```
Frontend will run at **http://localhost:3000**

> Make sure your backend is running at **http://localhost:5000**

---

## API Integration

All API calls go through `src/services/api.js`.

| Action               | Method | Endpoint              |
|----------------------|--------|-----------------------|
| Register             | POST   | /api/auth/register    |
| Login                | POST   | /api/auth/login       |
| Get my complaints    | GET    | /api/complaints/my    |
| Get all complaints   | GET    | /api/complaints       |
| Create complaint     | POST   | /api/complaints       |
| Update status        | PUT    | /api/complaints/:id   |

**JWT Token** is saved to `localStorage` after login and automatically attached to every request via Axios interceptor:
```
Authorization: Bearer <token>
```

---

## Pages & Routes

| Route               | Page               | Access     |
|---------------------|--------------------|------------|
| /login              | Login              | Public     |
| /register           | Register           | Public     |
| /dashboard          | Dashboard          | Logged in  |
| /create-complaint   | CreateComplaint    | Logged in  |
| /admin              | AdminDashboard     | Admin only |

- If not logged in → redirect to `/login`
- If logged in as student → redirect to `/dashboard`  
- If logged in as admin → redirect to `/admin`
- Admin route blocks non-admin users

---

## Features

- **Login / Register** with role selection (student / admin)
- **Dashboard** with stats summary (total, pending, in-progress, resolved)
- **Create Complaint** with title, description, and category
- **Admin Dashboard** — see ALL complaints, update status via dropdown
- **Status badges** color-coded: Pending (amber), In Progress (blue), Resolved (green)
- **Auto logout** on 401 Unauthorized (expired/invalid token)
- **Route protection** — unauthenticated users can't access app pages
- Fully responsive — works on mobile and desktop

---

## Tech Stack

| Technology         | Purpose                        |
|--------------------|-------------------------------|
| React 18           | UI framework                   |
| Vite               | Build tool & dev server        |
| React Router DOM 6 | Client-side routing            |
| Axios              | HTTP requests + interceptors   |
| Plain CSS          | Styling (Google Fonts: DM Sans)|

No TypeScript. No Redux. No Context API. No Tailwind. Beginner-friendly.
