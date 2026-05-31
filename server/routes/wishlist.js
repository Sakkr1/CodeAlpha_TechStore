import { Router } from "express";
import WishlistItem from "../models/WishlistItem.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.get("/", async (req, res, next) => {
  try {
    const items = await WishlistItem.find({ user: req.userId }).populate("product");
    res.json({ items });
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId required" });
    const existing = await WishlistItem.findOne({ user: req.userId, product: productId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ liked: false, message: "Removed from wishlist" });
    }
    await WishlistItem.create({ user: req.userId, product: productId });
    res.status(201).json({ liked: true, message: "Added to wishlist" });
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await WishlistItem.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ error: "Wishlist item not found" });
    res.json({ message: "Removed from wishlist" });
  } catch (e) { next(e); }
});

export default router;
