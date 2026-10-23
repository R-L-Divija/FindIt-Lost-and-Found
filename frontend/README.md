# FindIt — Lost and Found Management System (Frontend)

> **Tagline:** Search. Find. Reunite.  
> Modern, responsive, and accessible React frontend for the FindIt Lost and Found Management System.

---

## 🎨 Visual Design & Theme

- **Primary Purple:** `#6D28D9`
- **Light Lavender Background:** `#F5F3FF`
- **Secondary Accents:** `#7C3AED`, `#5B21B6`, `#EDE9FE`
- **Logo Concept:** Shield with magnifying glass
- **Typography:** Plus Jakarta Sans & Inter
- **Style:** Clean rounded cards, soft drop shadows, glassmorphism headers, subtle micro-animations, and full mobile responsiveness.

---

## 🚀 Tech Stack

- **Framework:** React 19 with Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router DOM (v7)
- **API Client:** Axios (with Bearer token request interceptor and error normalization)
- **Icons:** Lucide React

---

## 📁 Project Architecture

```
frontend/
├── public/
│   └── favicon.svg           # Custom shield + magnifying glass SVG favicon
├── src/
│   ├── assets/               # Brand assets and graphics
│   ├── components/           # Reusable UI components
│   │   ├── ConfirmModal.jsx      # Confirmation dialog for destructive actions
│   │   ├── ContactModal.jsx      # Contact owner & claim item inquiry modal
│   │   ├── DashboardHeader.jsx   # Top navigation for dashboard pages with notification & profile menu
│   │   ├── EditReportModal.jsx   # Modal for editing item details (title, category, etc.)
│   │   ├── EmptyState.jsx        # Polished empty state with action CTAs
│   │   ├── Footer.jsx            # Modern brand footer with links and security badges
│   │   ├── ItemCard.jsx          # Responsive card with image preview, badge, and metadata
│   │   ├── ItemCardSkeleton.jsx  # Pulse skeleton loaders
│   │   ├── Logo.jsx              # Vector shield with magnifying glass brand logo
│   │   ├── Navbar.jsx            # Top navigation bar with responsive mobile menu
│   │   └── Sidebar.jsx           # Dashboard navigation sidebar matching design reference
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication state, persistent JWT, and user session
│   ├── layouts/
│   │   ├── DashboardLayout.jsx   # Layout with persistent sidebar and dashboard header
│   │   ├── ProtectedRoute.jsx    # Guard that redirects unauthenticated users to /signin
│   │   └── PublicLayout.jsx      # Layout with public navbar and footer
│   ├── pages/
│   │   ├── LandingPage.jsx       # 1. Hero with backpack illustration, search bar, stats, recent items
│   │   ├── SignUpPage.jsx        # 2. Account registration form with friendly illustration
│   │   ├── SignInPage.jsx        # 3. Sign in form with security badge illustration
│   │   ├── DashboardPage.jsx     # 4. User dashboard with 4 metric cards and recent submissions
│   │   ├── SearchPage.jsx        # 5. Search & browse with type, category, and location filters
│   │   ├── ItemDetailsPage.jsx   # 6. Item view with large photo, metadata, contact owner & share
│   │   ├── ReportLostPage.jsx    # 7. Lost item submission with live photo preview
│   │   ├── ReportFoundPage.jsx   # 8. Found item submission with live photo preview
│   │   ├── MyReportsPage.jsx     # 9. Manage reports with All/Lost/Found pills, Edit & Delete modals
│   │   └── ProfilePage.jsx       # 10. Account information, avatar manager, and member role
│   ├── services/
│   │   └── api.js                # Axios client, auth & item endpoints, multipart upload handler
│   ├── App.jsx                   # Central router configuration
│   ├── index.css                 # Base theme variables and Tailwind imports
│   └── main.jsx                  # Application entry point
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
└── vite.config.js            # Vite configuration with Tailwind CSS plugin
```

---

## 🛠️ Setup & Installation Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Backend API**: Running on `http://localhost:5000`

### 2. Environment Configuration
Create a `.env` file in the `frontend` root directory:

```bash
# Copy example
cp .env.example .env
```

Ensure `.env` contains:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
cd frontend
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

---

## 🔌 Backend API Integration

The frontend connects to the existing backend endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user account |
| `POST` | `/api/auth/signin` | Sign in with email and password |
| `GET` | `/api/auth/me` | Fetch authenticated user session |
| `GET` | `/api/items` | Search & filter items (`type`, `category`, `location`, `search`) |
| `GET` | `/api/items/:id` | Retrieve single item details |
| `GET` | `/api/items/my-reports` | Retrieve authenticated user's submitted reports |
| `POST` | `/api/items` | Submit a new lost/found report |
| `PATCH` | `/api/items/:id` | Update report details (`title`, `description`, `category`, `location`, `date`) |
| `DELETE` | `/api/items/:id` | Delete report with confirmation modal |
| `POST` | `/api/uploads/item-image` | Upload image file (`image` multipart form-data) to Cloudinary |

---

## 🔒 Security & UX Best Practices

- JWT is stored securely in `localStorage` and automatically attached via Axios interceptor.
- Unauthenticated access to `/dashboard`, `/report-lost`, `/report-found`, `/my-reports`, and `/profile` redirects to `/signin`.
- Image uploads support live image previews before submission.
- Destructive actions (like report deletion) require explicit user confirmation.
- Safe fallbacks and empty states for empty search results or network interruptions.
