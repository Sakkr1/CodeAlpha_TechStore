import { Router } from "express";
import CartItem from "../models/CartItem.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.get("/", async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.userId }).populate("product");
    res.json({ items });
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: "productId required" });
    const existing = await CartItem.findOne({ user: req.userId, product: productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json({ item: existing });
    }
    const item = await CartItem.create({ user: req.userId, product: productId, quantity });
    res.status(201).json({ item });
  } catch (e) { next(e); }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: "quantity must be >= 1" });
    const item = await CartItem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { quantity },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Cart item not found" });
    res.json({ item });
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await CartItem.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ error: "Cart item not found" });
    res.json({ message: "Item removed" });
  } catch (e) { next(e); }
});

export default router;
