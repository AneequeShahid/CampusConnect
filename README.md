# CampusConnect 🎓

> **A NoSQL ADBMS project** built on MongoDB + Node.js, demonstrating schema validation, geospatial `2dsphere` queries, recursive `$graphLookup` aggregation, atomic updates (`$inc`, `$addToSet`, `$set`), delete patterns, and real-time Socket.io streaming.

[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Description

**CampusConnect** is a full-stack NoSQL application that demonstrates production MongoDB patterns for an ADBMS deliverable: schema-validated collections, geospatial search, recursive comment threads, atomic counters, soft/hard deletes, and live Socket.io feeds.

It exposes two core surfaces:
- **`/api/carpools`** RUD routes for creating rides, searching via `$nearSphere`, and marking `Full` when capacity is exhausted.
- **`/api/discussions`** CRUD routes for threaded comments using `$graphLookup`, plus live `newComment` broadcasts.

## 🗂️ Project Structure

```
CampusConnect/
├── server.js
├── models.js
├── public/index.html
└── package.json
```

## 📑 Table of Contents

1. [Features](#features)
2. [ADBMS Feature Alignment](#adbms-feature-alignment)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Reference](#api-reference)

---

## ✨ Features

- 🚗 **Geospatial Carpools** — `2dsphere` index on `routeParams.origin` and `routeParams.destination`; `$near` queries.
- 💬 **Recursive Discussions** — `$graphLookup` on `comments.parentCommentId` for nested threads.
- ⚡ **Real-time Socket Streams** — emits `carpoolCreated` and `newComment`.
- 👤 **Schema Validation** — `$jsonSchema` rejects bad emails, invalid roles, and malformed posts.
- 🔄 **Atomic Updates** — `$addToSet` skills, `$inc` upvotes, `$set` availability windows, `$pull` passengers.
- 🗑️ **Delete Patterns** — single `deleteOne`, `deleteMany` date filters, cascade comments + post demo.

---

## 🗺️ ADBMS Feature Alignment

| ADBMS Concept | Implementation | Evidence |
|---|---|---|
| Schema Validation | `$jsonSchema` on `users` / `posts` | `Downloads/adbmsfiles/crud_operations.js` |
| Geospatial `2dsphere` | `carpools.routeParams.origin/destination` | `crud_operations.js` + `Downloads/adbmsfiles/crud_screenshots.html` |
| `$graphLookup` recursion | Nested comment threads | README examples + screenshots |
| Atomic `$inc/$addToSet/$set` | Upvotes, skills, availability | README examples + screenshots |
| Delete patterns | `deleteOne`, `deleteMany`, `$pull` cascade | README examples + screenshots |
| Real-time Socket.io | `carpoolCreated`, `newComment` sockets | `server.js` + `public/index.html` |

Use the `docs/` directory and extracted screenshots for submission verification.

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
git clone https://github.com/ANEEQUESHAHID/CampusConnect.git
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

Open http://localhost:5001 in your browser.

---

## 💻 Usage

### Real-time events (Socket.io)

```js
const socket = io("http://localhost:5001");

socket.on("carpoolCreated", (carpool) => {
  console.log("New ride available:", carpool);
});

socket.on("newComment", (comment) => {
  console.log("New comment posted:", comment);
});
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/users` | List all users |
| `POST` | `/api/carpools` | Post a new carpool ride |
| `GET` | `/api/carpools/search?lng=&lat=&maxDistance=` | Nearby carpools (geospatial) |
| `POST` | `/api/discussions/comment` | Post a comment or reply |
| `GET` | `/api/discussions/thread?postId=` | Recursive comment thread |

### Federation README

This README is part of the CampusConnect federation. For cross-references, canonical origin is `ANEEQUESHAHID/CampusConnect`.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Commit changes with a clear message
3. Open a Pull Request targeting `main`

---

## 📄 License & Contact

MIT License — see [LICENSE](LICENSE) for details.

**Aneeque Shahid** · [@ANEEQUESHAHID](https://github.com/ANEEQUESHAHID) · aneequeshahid495@gmail.com

