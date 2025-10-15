import express from "express";
import multer from "multer";
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// konfigurasi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// middleware untuk cek role admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Akses ditolak! Hanya admin yang bisa menambah produk." });
  }
  next();
};

// ambil semua produk
router.get("/", getAllProducts);

// ambil produk by ID
router.get("/:id", getProductById);

// tambah produk (butuh token login dan role admin)
router.post("/", verifyToken, requireAdmin, upload.single("image"), addProduct);

// update produk (butuh token login dan role admin)
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), updateProduct);

// hapus produk (butuh token login dan role admin)
router.delete("/:id", verifyToken, requireAdmin, deleteProduct);

export default router;
