import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "yoursecretkey";

export const register = async (req, res) => {
  const { name, email, password, code } = req.body;
  const USER_CODE = process.env.REGISTRATION_CODE;
  const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE;

  let role = "user";

  if (code === ADMIN_CODE) {
    role = "admin";
  } else if (code !== USER_CODE) {
    return res.status(400).json({ message: "Invalid registration code." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });

  res.status(201).json({ message: "User registered", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
// Update name/email
export const updateProfile = async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  await user.save();

  res.json({
    message: "Profile updated",
    user: { name: user.name, email: user.email },
  });
};

// Change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ message: "Current password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
};
