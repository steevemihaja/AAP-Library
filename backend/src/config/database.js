const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Création automatique du compte admin par défaut
    const User = require("../models/User");

    const adminExists = await User.findOne({ email: "admin@library.com" });
    if (!adminExists) {
      await User.create({
        firstName: "Admin",
        lastName: "Library",
        email: "admin@library.com",
        password: "admin123",
        role: "admin",
        active: true,
      });
      console.log("Compte admin créé : admin@library.com / admin123");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
