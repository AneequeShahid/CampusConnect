# CampusConnect 🎓

> **A real-time campus social platform** — carpool matching with geospatial search, threaded discussion boards, and live Socket.io updates, powered by MongoDB and Node.js.

[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Description

**CampusConnect** is a full-stack NoSQL-powered web application that connects university students through two core features: a **carpool board** with real-time geospatial matching, and **threaded discussion boards** with recursive comment trees — all delivered live via Socket.io.

The project was built to demonstrate advanced MongoDB concepts: `$nearSphere` geospatial queries on `2dsphere` indexes, recursive `$graphLookup` aggregation pipelines for nested comment threads, polymorphic document schemas (student vs. faculty users), and real-time event broadcasting.

**Who is it for?** Students and developers learning advanced MongoDB and Node.js patterns — geospatial queries, aggregation pipelines, and real-time WebSocket integration.

---

## 📑 Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Contributing](#contributing)
7. [License & Contact](#license--contact)

---

## ✨ Features

- 🚗 **Carpool Board** — create and discover campus rides; geospatial search using MongoDB `$nearSphere` (default 5 km radius)
- 💬 **Threaded Discussions** — post comments with up to 5 levels of nested replies resolved via `$graphLookup`
- ⚡ **Real-time Updates** — Socket.io broadcasts `carpoolCreated` and `newComment` events to all connected clients instantly
- 👤 **Polymorphic Users** — single `users` collection supports both `Student` and `Faculty` schemas
- 🗺️ **Geospatial Indexing** — `2dsphere` index on `startLocation` for fast proximity-based carpool queries
- 🔄 **Mongoose Population** — `driver` and `passengers` fields auto-populated on all carpool responses

---

## 🗂️ Project Structure

```
CampusConnect/
├── server.js         # Express + Socket.io server, all REST routes
├── models.js         # Mongoose schemas: User, Carpool, Comment
├── campusconnect/    # Frontend HTML/JS client
├── public/           # Static assets
└── package.json
```

---

## 🚀 Installation

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| MongoDB | ≥ 7.0 (local or Atlas) |
| npm | ≥ 9 |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/AneequeShahid/CampusConnect.git
cd CampusConnect

# 2. Install dependencies
npm install

# 3. Set your MongoDB connection (optional — defaults to localhost)
export MONGODB_URI="mongodb://127.0.0.1:27017/campusconnect"
# Or on Windows:
# $env:MONGODB_URI = "mongodb://127.0.0.1:27017/campusconnect"

# 4. Start the server
node server.js
```

Open [http://localhost:5001](http://localhost:5001) in your browser.

---

## 💻 Usage

### Real-time events (Socket.io)

Connect a client to `http://localhost:5001` and listen for:

```js
const socket = io('http://localhost:5001');

socket.on('carpoolCreated', (carpool) => {
  console.log('New ride available:', carpool);
});

socket.on('newComment', (comment) => {
  console.log('New comment posted:', comment);
});
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Create a user (Student or Faculty) |
| `GET` | `/api/users` | List all users |
| `POST` | `/api/carpools` | Post a new carpool ride |
| `GET` | `/api/carpools/search?lng=&lat=&maxDistance=` | Find nearby carpools (geospatial) |
| `POST` | `/api/discussions/comment` | Post a comment or reply |
| `GET` | `/api/discussions/thread?postId=` | Fetch full recursive comment thread |

### Example: Find nearby carpools

```bash
curl "http://localhost:5001/api/carpools/search?lng=73.0479&lat=33.6844&maxDistance=3000"
```

Returns all carpools within 3 km of the given coordinates, sorted by proximity.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Commit changes with a clear message
3. Open a Pull Request targeting `main`

---

## 📄 License & Contact

MIT License — see [LICENSE](LICENSE) for details.

**Aneeque Shahid** · [@AneequeShahid](https://github.com/AneequeShahid) · aneequeshahid495@gmail.com
