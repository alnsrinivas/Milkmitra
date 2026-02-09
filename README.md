# MilkTmitra 🥛

**A Direct-to-Consumer Dairy Marketplace** *Developed as a Semester Project for Software Engineering (B.Tech CSE)*

---

## 📖 Project Overview
**MilkTmitra** is a full-stack web application designed to bridge the gap between local dairy farmers and urban consumers. By removing middlemen, the platform ensures that farmers receive fair prices for their produce while customers get access to fresh, organic dairy products directly from the source.

This project focuses on applying **Software Engineering principles**, including structured system design, modular architecture, and the Software Development Life Cycle (SDLC).

## ✨ Key Features
- **Dual Dashboard:** Separate, tailored interfaces for **Farmers** (Sellers) and **Customers** (Buyers).
- **Product Management:** Farmers can easily list, update, and manage inventory (Milk, Ghee, Paneer, etc.).
- **Smart Discovery:** Customers can browse and search for dairy farms based on location and product types.
- **Secure Authentication:** User data protection using **JWT (JSON Web Tokens)** and password encryption.
- **Responsive Interface:** A clean, mobile-friendly UI built for accessibility.

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Security** | Bcrypt.js (Hashing) & JWT (Auth) |
| **Tools** | Postman, Git, GitHub |

## 📐 Software Engineering Implementation
To ensure scalability and maintainability, the following engineering practices were used:
1. **Architectural Pattern:** Followed the **MVC (Model-View-Controller)** pattern to separate concerns.
2. **RESTful API Design:** Implemented clean API endpoints for data communication.
3. **Database Schema:** Designed a relational-style schema in a NoSQL environment for optimized queries.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation
1. **Clone the repository:**
   git clone https://github.com/alnsrinivas/Milkmitra
   cd MilkTmitra
2. **Install dependencies:**
   npm install
3. **Environment Setup:**
 Create a .env file in the root folder and add:
   Code snippet
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_random_secret_key
5. **Run the application:**
    npm start
   The app will be running at http://localhost:5000
   
👤 Author

Alam.Lakshmi Naga Srinivas.
