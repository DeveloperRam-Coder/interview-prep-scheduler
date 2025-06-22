Here’s how your app works, based on the current structure and code:

---

## **Overview**

This is a minimal IT interview scheduling app for students. It allows users to:
- View a landing page
- Fill out forms to schedule an interview
- See a success page after scheduling
- Get notified of actions via toasts

---

## **Main Pages & Flow**

1. **Landing Page (`/`)**
   - Shows the app’s value proposition and features.
   - Has a button to start scheduling an interview.

2. **Schedule Page (`/schedule`)**
   - Contains a multi-step form (with components like `InterviewTypeSelection`, `InterviewPersonalDetails`, `InterviewScheduling`, `PaymentStep`).
   - Users fill in their details, select interview type, pick a time, and (optionally) pay.
   - On submit, the form data is sent to the backend (if connected).

3. **Success Page (`/success`)**
   - Shown after a successful interview booking.
   - Confirms the booking and may show next steps or a summary.

4. **NotFound Page (`*`)**
   - Shown for any route that doesn’t exist.

---

## **UI Components**

- **Navbar & Footer:** Consistent navigation and branding.
- **Toasts:** Show notifications for actions (success, error, etc.).
- **Animated Logo & Calendar:** Visual enhancements for a modern look.

---

## **How Data Flows**

- **Form Submission:**  
  When a user fills out the scheduling form and submits, the data is sent to the backend API (if running). The backend would save the interview details in a database.
- **Notifications:**  
  Toasts appear for feedback (e.g., “Interview scheduled!” or error messages).
- **Routing:**  
  Uses React Router to switch between pages without reloading.

---

## **What’s Removed**

- All dashboards, resources, practice, and profile features.
- Only the core scheduling flow and supporting UI remain.

---

## **How to Use**

1. **Start the app** (usually with `npm run dev`).
2. Go to `http://localhost:8080` in your browser.
3. Click “Schedule Interview” on the home page.
4. Fill out the form and submit.
5. See the success page and any notifications.

---

If you want to connect the backend for real data storage, you’ll need to run the backend server as well.  
Let me know if you want a step-by-step on that, or if you want to add more features!