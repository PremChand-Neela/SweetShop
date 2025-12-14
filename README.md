# 🍬 Sweet Shop Management System

A modern **Sweet Shop Management System** built to manage inventory, sales, transactions, and users with **role-based authentication**.  
The application provides an **Admin & Manager dashboard**, **Point of Sale (POS)** interface, and **inventory analytics** with a clean and responsive UI.

> ⚠️ This version uses **localStorage** for data persistence (no external backend or database).

---

## 📌 Project Overview

The **Sweet Shop Management System** helps sweet shop owners manage daily operations efficiently.  
It supports inventory control, sales processing, transaction tracking, and user management through a single dashboard.

This project demonstrates:
- Role-based authentication
- Dashboard analytics
- Inventory & stock management
- Point of Sale system
- Clean UI and structured frontend architecture

---

## 🔐 Authentication

Secure login with role-based access.

### Demo Accounts
Admin → admin@sweetshop.com
 / admin123
Manager → manager@sweetshop.com
 / manager123

 
- Admin: Full access
- Manager: Inventory & sales access

---

## 📊 Dashboard

The dashboard provides a quick business overview.

### Dashboard Metrics
- Total Revenue
- Total Sales
- Total Products
- Low Stock Alerts
- Recent Sales
- Average Sale Value
- Stock Health Percentage

![Dashboard](./screenshots/dashboard.png)

---

## 📦 Inventory Management

Manage all sweets available in the shop.

### Features
- Add new sweets
- View all products
- Search by name or category
- Low stock filtering
- Update stock quantities
- Delete sweets (Admin only)

![Inventory](./screenshots/inventory.png)

---

## 🛒 Point of Sale (Sales)

Process customer purchases using a POS interface.

### Features
- Product search
- Add items to cart
- Auto price calculation
- Inventory auto-update after sale
- View recent sales

![Sales](./screenshots/sales.png)

---

## 🧾 Transaction History

Tracks all inventory and sales activities.

### Includes
- Sales transactions
- Stock restocks
- Inventory adjustments

![Transactions](./screenshots/transactions.png)

---

## 👥 User Management (Admin Only)

Manage system users and roles.

### Features
- View users
- Add new users
- Assign roles (Admin / Manager)
- Delete users (except self)

![Users](./screenshots/users.png)

---

## 🎨 UI & UX

- Clean and modern design
- Sidebar navigation
- Responsive layout
- Easy-to-use interface

---

## 🧠 Technical Details

### Frontend
- React (Next.js style routing)
- Context API for authentication
- Component-based architecture

### Data Storage
- localStorage
- No backend or external database

### Authentication
- Custom Auth Provider
- Role-based route protection
- Persistent login state

---

## 🛠 Project Structure

/app
├── login
├── dashboard
├── inventory
├── sales
├── transactions
├── users
└── layout.tsx

/context
└── auth-context.tsx

/components
├── Sidebar
├── DashboardCards
├── InventoryTable
├── POSCart
└── UserList
---

## 🧪 Fixes & Improvements

### Fixed Issues
- Login redirect issue resolved
- Redirect loop removed
- Stable navigation after sign-in

### Future Enhancements
- Backend API integration
- Database (MongoDB / PostgreSQL)
- JWT authentication
- Sales reports & charts
- Invoice generation

---

## 🤖 AI Usage

AI tools were used during development.

### How AI Helped
- UI layout planning
- Component scaffolding
- Debugging navigation issues
- Code optimization
- Documentation writing

### Reflection
AI improved development speed and helped resolve logical issues efficiently, while final design and implementation decisions were manually reviewed.

---


---

## ✅ Conclusion

The **Sweet Shop Management System** is a complete frontend application demonstrating:
- Real-world business logic
- Role-based access control
- Inventory & sales management
- Dashboard analytics
- Clean UI design

Suitable for **college projects**, **interviews**, and **portfolio showcases**.


