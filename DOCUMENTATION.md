# Project Documentation - ad77designs

## Abstract

**ad77designs** is a premium, modern portfolio website designed for a creative professional (graphic designer). The project features a sleek, high-end aesthetic with dynamic animations, a responsive grid for showcasing projects, and a robust administrative backend for content management. Built with **React 19** and **Vite**, and powered by **Supabase**, it provides a seamless blend of performance, visual excellence, and ease of maintenance.

---

## Introduction

The primary goal of this project was to create a digital showcase that reflects the professional quality and creativity of the user's work. The website is divided into a public-facing gallery and a protected admin dashboard, allowing for real-time updates to projects, hero content, and about information without modifying the codebase.

---

## Technology Stack

### Frontend

- **React 19**: The core library for building the user interface.
- **Vite**: The build tool and development server for fast HMR.
- **Tailwind CSS (v4)**: For modern, utility-first styling with high performance.
- **Framer Motion**: Powering the smooth, premium animations and transitions.
- **Lucide React**: Providing a consistent and beautiful icon system.
- **React Router Dom (v7)**: Handling client-side routing and navigation.
- **React Hot Toast**: Delivering sleek, non-intrusive notifications.

### Backend & Database

- **Supabase**: A Backend-as-a-Service (BaaS) providing:
  - **PostgreSQL Database**: Storing project data, messages, and site content.
  - **Supabase Auth**: Managing secure admin login.
  - **Supabase Storage**: Hosting high-resolution project images.

---

## Key Features

### Public Website

- **Dynamic Hero Section**: Engaging introduction with smooth text animations.
- **Project Showcase**: A responsive grid of project tiles with custom hover effects.
- **Project Details**: Dedicated pages for each project with detailed descriptions and image galleries.
- **About Page**: A professional narrative section with categorized skills.
- **Contact System**: A functional contact form that saves inquiries directly to the database.
- **Premium Loading Screen**: A custom-designed initial loader that ensures a smooth first impression.

### Admin Dashboard

- **Secure Login**: Protected authentication layer for administrative access.
- **Project Management**: Full CRUD (Create, Read, Update, Delete) capabilities for portfolio items.
- **Content Editor**: Update Hero and About section text directly from the dashboard.
- **Message Center**: View and manage inquiries received through the contact form.
- **Real-time Sync**: Changes made in the admin panel reflect instantly on the public site.

---

## Architecture and Directory Structure

The project follows a modular React architecture:

```text
ad77designs/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── admin/      # Admin-specific components (Sidebar, ProjectManager, etc.)
│   │   ├── layout/     # Master layouts (Navbar, Footer, Page Wrapper)
│   │   └── ui/         # Base UI elements (Buttons, Inputs, Loading Screen)
│   ├── context/        # React Context for Auth and global state
│   ├── lib/            # External library configurations (Supabase client)
│   ├── pages/          # Individual page components
│   │   ├── admin/      # Dashboard and Login pages
│   │   └── public/     # Home, About, Projects, etc.
│   ├── assets/         # Static images and icons
│   ├── App.jsx         # Main application routing and configuration
│   └── main.jsx        # Application entry point
├── public/             # Static public assets
└── DOCUMENTATION.md    # This file
```

---

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1.  **Clone the repository**:

    ```bash
    git clone [repository-url]
    cd ad77designs
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

## Deployment

The project is optimized for deployment on **Vercel**.

- Connect the GitHub repository to Vercel.
- Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
- The build command is `npm run build` and the output directory is `dist`.

---

## Maintenance and Support

For updates to the content, use the Admin Dashboard accessible at `/login`. For technical modifications, follow the standard React/Vite development workflow.
