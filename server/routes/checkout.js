import { Router } from "express";
import { Resend } from "resend";
import CartItem from "../models/CartItem.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, address, city, postalCode, notes } = req.body;
    if (!name || !email || !phone || !address || !city || !postalCode) {
      return res.status(400).json({ error: "All fields except notes are required" });
    }

    const items = await CartItem.find({ user: req.userId }).populate("product");
    if (items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const itemsHtml = items.map(i => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #ddd">${i.product.name}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right">$${i.product.price.toFixed(2)}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right">$${(i.product.price * i.quantity).toFixed(2)}</td>
      </tr>
    `).join("");

    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

    const html = `
      <h2>New Order from ${name}</h2>
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Postal Code:</strong> ${postalCode}</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      <h3>Order Items</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Product</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Price</th>
            <th style="padding:8px;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:8px;text-align:right;font-weight:bold">Grand Total</td>
            <td style="padding:8px;text-align:right;font-weight:bold">$${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "TechStore <onboarding@resend.dev>",
      to: ["mostafaxsakr@gmail.com"],
      subject: `New Order from ${name} — $${total.toFixed(2)}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send order email" });
    }

    await CartItem.deleteMany({ user: req.userId });

    res.json({ message: "Order placed successfully" });
  } catch (e) { next(e); }
});

export default router;
