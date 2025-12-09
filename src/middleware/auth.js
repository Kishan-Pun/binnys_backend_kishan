import jwt from "jsonwebtoken";
import { User } from "../modules/users/user.model.js";

// ✅ This middleware reads the JWT, verifies it, and sets req.user
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expect "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain { id, role } if you set it like that in login
    // But we still fetch from DB to be safe and up-to-date
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach a clean user object to req
    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("JWT verify error:", error);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
