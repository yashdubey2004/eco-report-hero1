# ♻️ Ecolink – Bridging Citizens and NGOs for Cleaner Communities

**Ecolink** is a web-based platform that empowers citizens to report garbage and plastic waste in public spaces by uploading photos and location data. The platform automatically notifies nearby NGOs, who collect the waste and mark it as resolved — promoting transparency, accountability, and a cleaner environment.

---

## 🌟 Features

- 🔐 **Dual Login System**  
  Separate, role-based logins for Citizens and NGOs with customized dashboards.

- 📍 **Geo-tagged Photo Reporting**  
  Citizens upload photos; the app auto-fetches their location to accurately report garbage sites.

- 🗂️ **Real-Time Dashboard**  
  - **Citizen View:** Track status of submitted reports.  
  - **NGO View:** See new reports with locations and mark them as completed after collection.

- 🔔 **Instant Notifications**  
  Users are notified when their report is picked up and resolved by an NGO.

- 🏢 **NGO Directory**  
  A section listing all associated NGOs, including their focus areas, contact info, and locations.

- 🚀 **Scalable Architecture**  
  Designed to support AI-based waste classification, leaderboards, gamification, and real-time chat in future updates.

---

## 🔧 Tech Stack

- **Frontend:** Next.js / React  
- **Styling:** Tailwind CSS  
- **Authentication & Backend:** Firebase Authentication + Firestore  
- **Location Services:** HTML Geolocation API  
- **Hosting:** Firebase Hosting (or Vercel)

---

## 🧭 How It Works

1. **Citizen uploads photo** → location is auto-fetched.  
2. **Report is sent** to nearby NGOs based on area.  
3. **NGO receives it** on a real-time dashboard.  
4. **NGO collects waste** and marks it as resolved.  
5. **Citizen is notified** of the resolution.

---

## 📁 Project Structure (Simplified)

