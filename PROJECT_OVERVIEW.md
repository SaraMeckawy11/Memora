# Memora - Comprehensive Project Documentation

## 1. Project Overview
**Memora** is a high-end, modern web application designed to simplify the creation and ordering of personalized photo books. It empowers users to transform their digital memories into professionally designed physical photo books through an intuitive, browser-based editor.

### Mission
To provide a seamless "from upload to doorstep" experience for preserving memories, focusing on ease of use, design flexibility, and reliable professional output.

---

## 2. Product Features

### User-Facing Features
- **Intuitive Creation Flow**: A structured 3-step process (Setup → Design → Review).
- **Advanced Photo Editor**:
  - Drag-and-drop image placement.
  - Real-time layout adjustment and resizing.
  - Multi-page management (defaulting to 10-page books).
  - Rich text support for captions with customizable fonts, colors, and positioning.
- **Save & Resume**: Intelligent draft management using local storage and history managers (Undo/Redo capabilities).
- **Cover Customization**: Separate flow for choosing and designing book covers.
- **PDF Export**: Instant preview and export of the designed book using `jsPDF` and `html2canvas`.
- **E-commerce Integration**: Complete checkout flow including billing/shipping details and payment processing.

### Admin Features
- **Order Management**: Secured dashboard to track, process, and manage customer orders.
- **Authentication**: JWT-based secure access for administrative tasks.

---

## 3. Technology Stack

### Frontend
- **Core**: [Next.js 14](https://nextjs.org/) (App Router)
- **State Management**: React Hooks (useState, useEffect, useSearchParams) & Custom History Manager.
- **UI & Styling**: Vanilla CSS with a focus on premium aesthetics and responsive design.
- **Interactive Elements**:
  - `react-draggable`: For moving images within layouts.
  - `re-resizable`: For adjusting image sizes and layout splits.
- **Exporting**:
  - `jspdf`: For generating print-ready PDFs.
  - `html2canvas`: For capturing DOM elements as images for the PDF.

### Backend (API)
- **Architecture**: Modular Clean Architecture.
- **Runtime**: Node.js with [Express.js](https://expressjs.com/).
- **Language**: TypeScript for type safety and better developer experience.
- **Validation**: [Zod](https://zod.dev/) for robust schema validation.

### Database & Storage
- **ORM**: [Prisma](https://www.prisma.io/).
- **Database**: PostgreSQL (Cloud-hosted, likely Neon or similar).
- **Image Storage**: [Cloudinary](https://cloudinary.com/) (Managing user-uploaded photos).

### Services & Integrations
- **Payments**: [Paymob](https://www.paymob.com/) (Primary payment gateway for Egyptian/Global markets).
- **Emails**: [Nodemailer](https://nodemailer.com/) (For order confirmations and notifications).
- **Deployment**: [Vercel](https://vercel.com/) (Frontend/Next.js).

---

## 4. Architecture & Design

### Modular Clean Architecture (Backend)
The backend is structured into domain-specific modules (e.g., `orders`). Each module encapsulates its business logic, routes, and data access, ensuring the system remains maintainable as it grows.

### State Persistence
Memora uses a hybrid approach to state:
- **Client-Side Drafts**: User progress is managed by a `SaveManager` which handles local persistence and undo/redo stacks, preventing data loss during navigation.
- **Server-Side Orders**: Finalized book configurations and customer data are persisted in the PostgreSQL database once the order is placed.

---

## 5. User Journey
1. **Landing**: User explores themes (Wedding, Travel, Family) and starts a project.
2. **Setup (Step 1)**: User selects the product type (e.g., Hardcover) and book size.
3. **Editor (Step 2)**:
   - User uploads photos to Cloudinary.
   - User arranges photos on pages using various layout options.
   - User adds and styles captions.
4. **Cover Selection**: User designs the front and back cover.
5. **Review (Step 3)**: User previews the entire book and confirms the design.
6. **Checkout**: User enters shipping details and completes payment via Paymob.
7. **Fulfillment**: Order is logged in the system for admin processing and production.

---

## 6. Project Structure
```text
Memora/
├── app/                # Next.js Frontend (App Router)
│   ├── admin/          # Admin Dashboard
│   ├── components/     # Reusable UI components (Editor, Hero, etc.)
│   ├── create/         # Core Editor Experience
│   ├── order/          # Checkout and Payment Flow
│   └── utils/          # Frontend utility functions
├── backend/            # Express.js Backend
│   ├── prisma/         # Database schema and migrations
│   └── src/            # Modular backend source code
├── public/             # Static assets
├── styles/             # Modular CSS stylesheets
└── package.json        # Main project configuration
```
