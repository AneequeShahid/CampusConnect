# 🎓 CampusConnect — Advanced NoSQL Database Ecosystem

CampusConnect is a scalable, event-driven NoSQL database solution and backend architecture engineered to streamline campus operations, carpool matching, and student discussions. By leveraging polymorphic schemas, native geospatial indexing, and real-time streams, CampusConnect solves complex logistics and networking challenges on university campuses.

---

## 🚀 Key Features

* **Polymorphic Database Schemas**: Designed flexible, non-relational schemas inside MongoDB to handle diverse entities (such as student profiles, administrator posts, and carpool logs) within uniform collections.
* **Geospatial Carpool Routing**: Utilized MongoDB's native 2D Sphere geospatial index (`$nearSphere`, `$geoWithin`) to calculate coordinate-based carpool matching, pairing student drivers with riders along spatial trajectories.
* **Event-Driven Updates**: Developed real-time notifications and feed updates by listening to database write activities using **MongoDB Change Streams**, pushing notifications through WebSockets.
* **Recursive Discussion Threads**: Implemented recursive mapping for nested discussions, comments, and replies using MongoDB's `$graphLookup` aggregation stage, yielding high-performance tree-structure traversals.

---

## 🛠️ Technology Stack

* **Database**: MongoDB (NoSQL)
* **API Architecture**: Node.js & Express.js (REST APIs)
* **Real-time Communication**: WebSockets (Socket.io)
* **Authentication**: JSON Web Tokens (JWT) & bcrypt
* **Geospatial Engine**: GeoJSON & MongoDB Geospatial Indexes

---

## 📂 Database Schema & Architecture

### 1. User & Profiles (Polymorphic)
The `users` collection stores basic credentials along with dynamic fields depending on user type (`student`, `faculty`, `driver`).
```json
{
  "_id": "ObjectId",
  "name": "Jane Doe",
  "email": "janedoe@bnu.edu.pk",
  "role": "student",
  "academic_info": {
    "roll_no": "F2024-0920",
    "department": "Computer Science"
  },
  "driver_info": {
    "is_active_driver": true,
    "license_no": "LHR-88219",
    "vehicle_details": "Honda Civic (LED-1234)"
  }
}
```

### 2. Carpools (Geospatial Trajectory Routing)
The `carpools` collection uses a GeoJSON LineString coordinates list and coordinates points to match passengers near the driver's route.
```json
{
  "_id": "ObjectId",
  "driver_id": "ObjectId",
  "start_location": {
    "type": "Point",
    "coordinates": [74.3587, 31.5204]
  },
  "destination": {
    "type": "Point",
    "coordinates": [74.3292, 31.4015]
  },
  "capacity": 4,
  "passengers": ["ObjectId"],
  "status": "active"
}
```

---

## 🔍 Aggregation Pipelines Example

### Recursive Thread Lookup (`$graphLookup`)
To fetch nested discussion comments recursively up to 5 levels deep:
```javascript
db.posts.aggregate([
  { $match: { _id: ObjectId("post_id_here") } },
  {
    $graphLookup: {
      from: "comments",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "parent_comment_id",
      as: "thread_replies",
      maxDepth: 5,
      depthField: "reply_depth"
    }
  }
])
```

---

## ⚙️ Setup & Installation

1. **Prerequisites**: Ensure MongoDB (v6.0+) and Node.js (v18+) are installed on your system.
2. **Clone and Install**:
   ```bash
   git clone https://github.com/AneequeShahid/CampusConnect.git
   cd CampusConnect
   npm install
   ```
3. **Database Restore**:
   Restore the database collections using the provided BSON dumps:
   ```bash
   mongorestore --db campusconnect ./campusconnect
   ```
4. **Run Server**:
   ```bash
   npm start
   ```

---

## 🎓 Academic Credit
Developed as a project for the Advanced Database Management Systems (ADBMS) course at **Beaconhouse National University (BNU)**.
