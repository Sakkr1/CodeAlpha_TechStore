import User from "../models/User.js";

export async function adminRequired(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
