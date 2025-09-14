const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// ✅ Schema banao
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    }
});

// ✅ Plugin schema pe lagao
UserSchema.plugin(passportLocalMongoose);

// ✅ Model banao
const User = mongoose.model("User", UserSchema);

module.exports = User;