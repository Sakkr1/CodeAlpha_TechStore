import { Router } from "express";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";
import { adminRequired } from "../middleware/admin.js";

const router = Router();

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

router.get("/", async (_req, res, next) => {
  try {
    const products = await Product.find().sort("-createdAt");
    res.json({ products });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch (e) { next(e); }
});

router.post("/", authRequired, adminRequired, async (req, res, next) => {
  try {
    const { name, description, price, image, category, specs } = req.body;
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const slug = toSlug(name);
    const product = await Product.create({ name, slug, description, price, image, category, specs });
    res.status(201).json({ product });
  } catch (e) { next(e); }
});

router.delete("/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (e) { next(e); }
});

export default router;
