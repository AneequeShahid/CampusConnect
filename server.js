const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Carpool, Comment } = require('./models');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campusconnect";
mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for CampusConnect"))
    .catch(err => console.error("MongoDB connection error: ", err));

// ==========================================
// REST API Routes
// ==========================================

// 1. Create a User (Polymorphic inputs)
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Create a Carpool (Geospatial route)
app.post('/api/carpools', async (req, res) => {
    try {
        const carpool = new Carpool(req.body);
        await carpool.save();
        const populated = await Carpool.findById(carpool._id).populate('driver');
        
        // Emit Socket.io event for real-time update
        io.emit('carpoolCreated', populated);
        
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Find carpools near coordinates ($nearSphere)
app.get('/api/carpools/search', async (req, res) => {
    const { lng, lat, maxDistance } = req.query;
    if (!lng || !lat) {
        return res.status(400).json({ error: "Longitude and Latitude queries are required." });
    }
    try {
        const carpools = await Carpool.find({
            startLocation: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(maxDistance || 5000) // Default 5km max
                }
            }
        }).populate('driver passengers');
        res.json(carpools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Post a comment/reply
app.post('/api/discussions/comment', async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        const populated = await Comment.findById(comment._id).populate('author');
        
        // Emit Socket.io event for live updates
        io.emit('newComment', populated);
        
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch recursive discussion threads ($graphLookup)
app.get('/api/discussions/thread', async (req, res) => {
    const { postId } = req.query;
    if (!postId) {
        return res.status(400).json({ error: "postId is required" });
    }
    try {
        // Query root comments and lookup their replies recursively
        const thread = await Comment.aggregate([
            { 
                $match: { 
                    postId: new mongoose.Types.ObjectId(postId), 
                    parentCommentId: null 
                } 
            },
            {
                $graphLookup: {
                    from: "comments",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parent_comment_id",
                    as: "replies",
                    maxDepth: 5,
                    depthField: "reply_depth"
                }
            }
        ]);
        
        // Populate author information in aggregation results manually
        const populatedThread = await Comment.populate(thread, { path: 'author replies.author' });
        res.json(populatedThread);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend static folder
app.use(express.static('public'));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`CampusConnect Server is running on port ${PORT}`);
});
