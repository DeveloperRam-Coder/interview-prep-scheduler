# Interview Haven - IT Interview Scheduler 🎯

A modern, fully functional interview scheduling application for IT students and professionals. Built with React, TypeScript, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)

## ✨ Features

- 📝 **Multi-step Booking Form** - Intuitive 3-step interview scheduling
- 🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 📄 **PDF/Image Export** - Download confirmation as PDF or image
- 💾 **Data Persistence** - LocalStorage integration for demo purposes
- 🌙 **Dark Mode** - Built-in theme support
- ⚡ **Fast Performance** - Optimized with Vite

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

### Running with the API (MERN)

To use login, register, and CRUD (interviews, profile, admin):

1. **Database (PostgreSQL)**  
   Ensure PostgreSQL is running, then in **`server/.env`** set:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
   ```
   From **`server`** run: `npx prisma db push` then `npx prisma generate`.  
   See **[server/DATABASE_SETUP.md](server/DATABASE_SETUP.md)** for details or SQLite option.

2. **Start backend and frontend**

```bash
# Terminal 1 – backend (from project root)
cd server
npm install
npm run dev

# Terminal 2 – frontend
npm run dev
```

Then open http://localhost:8080. The backend runs on port 5000; the frontend proxies `/api` to it. If you see *"Database unavailable"*, check that PostgreSQL is running and `DATABASE_URL` is correct.

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 3 steps
- **[SETUP.md](./SETUP.md)** - Detailed setup & customization guide
- **[TESTING.md](./TESTING.md)** - Complete testing checklist
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Full project overview

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Dates:** date-fns
- **Notifications:** Sonner
- **PDF Export:** jsPDF + html2canvas

## 🎯 Demo Flow

1. **Home** → Click "Schedule Interview"
2. **Step 1** → Enter personal details
3. **Step 2** → Select interview type
4. **Step 3** → Pick date and time
5. **Success** → View confirmation & download

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Live Demo

**[View Live Demo](#)** _(Add your deployed URL here)_

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Email notifications
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Video call integration
- [ ] Admin dashboard
- [ ] Analytics & reporting

## 📄 License

This project is open source and available for portfolio/demo purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or feedback, please open an issue or reach out through the contact form.

---

**Built with ❤️ for IT students preparing for their dream careers**
