# LearningGaints

A role-based Learning Management System (admin + student) built with React, Vite, React Router, and Firebase (Auth + Firestore).

## Getting started

```bash
npm install
npm run dev
```

The app reads Firebase config from environment variables. A working `.env` is already included so it runs immediately. If you rotate your Firebase project, update `.env` (see `.env.example` for the list of keys) — `VITE_ADMIN_EMAIL` controls which registered email is auto-assigned the `admin` role on first login.

## Project structure

```
src/
  main.jsx                     # entry point, wraps App in AuthProvider
  App.jsx                      # routes
  model/
    Categorymodel.js
  services/
    CategoryServices.js        # Firestore CRUD for categories/courses
    CloudinaryServices.js      # image upload helper
  components/
    firebase.js                # Firebase init (reads .env)
    AuthContext.jsx            # auth state + role lookup
    ProtectedRoute.jsx         # route guard by role
    Student_layout.jsx
    admin/
      Admin_layout.jsx
      pages/                   # Home, About, Contact, Courses, Login, Register,
                                # Add_category, Managecategory, Header, Footer
```

## Deploying

This is a standard Vite SPA using client-side routing (`react-router-dom`'s `BrowserRouter`), so your host needs to rewrite all paths to `index.html` or deep links (e.g. `/admin/managecategory`) will 404 on refresh.

- **Vercel**: `vercel.json` (included) already handles this.
- **Netlify**: `public/_redirects` (included) already handles this.
- Either way: set the same variables from `.env` in your host's environment variable settings (Vercel/Netlify dashboard) — don't commit `.env` itself (it's git-ignored).

Build command: `npm run build` — output goes to `dist/`.

## A note on filenames (important if you develop on Windows)

Windows and macOS filesystems are usually case-*insensitive*; Linux (and Vercel/Netlify's build servers) are case-*sensitive*. `import x from "./Foo"` will silently work on Windows even if the real file is `foo.js`, then fail to build the moment it's deployed. Every import path in this project has been matched exactly against its real filename — if you add new files, keep the casing identical between the filename and the import statement.
