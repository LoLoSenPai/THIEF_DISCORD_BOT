const mongoose = require('mongoose');
const { Schema } = mongoose;

// Mongoose model for users
const userSchema = new Schema({
    discordId: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    roles: [{ type: String }]
});
const User = mongoose.model('User', userSchema);

module.exports = User;