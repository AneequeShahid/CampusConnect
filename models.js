const mongoose = require('mongoose');

// 1. User Schema (Polymorphic data structure based on role)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'faculty', 'driver'], default: 'student' },
    department: String,
    rollNo: String,
    vehicleDetails: String // Only populated if user is a driver
}, { timestamps: true });

// 2. Carpool Schema (Geospatial trajectories index)
const CarpoolSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [Longitude, Latitude]
    },
    destination: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [Longitude, Latitude]
    },
    capacity: { type: Number, required: true, min: 1 },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' }
}, { timestamps: true });

// Apply 2dsphere index on startLocation coordinates for nearSphere lookups
CarpoolSchema.index({ startLocation: "2dsphere" });

// 3. Comment Schema (Supports recursive discussion mapping)
const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null } // Points to parent comment
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Carpool = mongoose.model('Carpool', CarpoolSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { User, Carpool, Comment };
