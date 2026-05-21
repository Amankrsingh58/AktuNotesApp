const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");

dotenv.config();

const promoteToSuperAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admin = await Admin.findOneAndUpdate(
      { email },
      { role: "super_admin" },
      { new: true }
    );

    if (!admin) {
      console.log(`Admin with email ${email} not found.`);
    } else {
      console.log(`Successfully promoted ${admin.name} to super_admin.`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error promoting admin:", error);
  }
};

const email = process.argv[2];
if (!email) {
  console.log("Please provide an email address: node promoteAdmin.js admin@example.com");
  process.exit(1);
}

promoteToSuperAdmin(email);
