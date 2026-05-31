import mongoose from "mongoose";
import Product from "../models/Product.js";

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const MOCK_PRODUCTS = [
  {
    name: "MacBook Pro 16\" M4",
    description: "Apple M4 chip, 36GB unified memory, 512GB SSD, 16-inch Liquid Retina XDR display. Professional-grade laptop for developers and creators.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1575024357670-2b5164f470c3?w=400&h=400&fit=crop",
    category: "laptops",
    specs: { CPU: "Apple M4 Pro", RAM: "36GB", Storage: "512GB SSD", Display: "16\" Liquid Retina XDR", Battery: "22 hours" },
  },
  {
    name: "iPhone 17 Pro Max",
    description: "A19 Bionic chip, 48MP triple camera system, 6.9-inch Super Retina XDR OLED display with ProMotion. Titanium frame.",
    price: 1199,
    image: "https://images.unsplash.com/photo-1695822958645-b2b058159215?w=400&h=400&fit=crop",
    category: "phones",
    specs: { Chip: "A19 Bionic", Camera: "48MP Triple", Display: "6.9\" OLED 120Hz", Battery: "36 hours video" },
  },
  {
    name: "iPad Air 13\" M3",
    description: "M3 chip, 13-inch Liquid Retina display, supports Apple Pencil Pro. Ultra-thin design perfect for creativity and productivity.",
    price: 799,
    image: "https://images.unsplash.com/photo-1682427286841-1f3ff788752b?w=400&h=400&fit=crop",
    category: "tablets",
    specs: { Chip: "Apple M3", Display: "13\" Liquid Retina", Storage: "128GB", Weight: "1.02 lbs" },
  },
  {
    name: "Samsung Galaxy Tab S10 Ultra",
    description: "14.6-inch Dynamic AMOLED display, MediaTek Dimensity 9300+, 12GB RAM, included S Pen. The ultimate Android tablet.",
    price: 999,
    image: "https://images.unsplash.com/photo-1682426526490-667d4912b8de?w=400&h=400&fit=crop",
    category: "tablets",
    specs: { Processor: "Dimensity 9300+", RAM: "12GB", Display: '14.6" AMOLED 120Hz', "S Pen": "Included" },
  },
  {
    name: "Sony WH-1000XM6",
    description: "Industry-leading noise cancellation with Auto NC Optimizer. 40-hour battery life, LDAC hi-res audio, multipoint connection.",
    price: 349,
    image: "https://images.unsplash.com/photo-1520170350707-b2da59970118?w=400&h=400&fit=crop",
    category: "other",
    specs: { "Noise Cancelling": "Adaptive", Battery: "40 hours", Audio: "LDAC Hi-Res", Weight: "250g" },
  },
  {
    name: "Logitech MX Mechanical Keyboard",
    description: "Full-size mechanical keyboard with wireless Bluetooth and Logi Bolt. Tactile silent switches, smart backlighting, USB-C.",
    price: 179,
    image: "https://images.unsplash.com/photo-1669534323404-e0874377cdab?w=400&h=400&fit=crop",
    category: "other",
    specs: { Switches: "Tactile Silent", Connectivity: "Bluetooth + Bolt", Backlight: "Smart", Battery: "15 days" },
  },
  {
    name: "Dell UltraSharp 32\" 6K Monitor",
    description: "32-inch IPS Black panel with 6K resolution (6144×3456). Delta E < 2 color accuracy, built-in KVM, USB-C 140W charging.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=400&h=400&fit=crop",
    category: "other",
    specs: { Resolution: "6K (6144×3456)", Panel: "IPS Black", Color: "Delta E < 2", Ports: "USB-C 140W" },
  },
];

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) {
    return;
  }
  const docs = MOCK_PRODUCTS.map((p) => ({ ...p, slug: toSlug(p.name) }));
  await Product.insertMany(docs);
}

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);
  await seedProducts();
}
