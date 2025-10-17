import express from "express";
import multer from "multer";
import { getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
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
  if (!['superadmin', 'admin_produk', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Akses ditolak! Hanya admin yang bisa mengelola kategori." });
  }
  next();
};

// ambil semua kategori
router.get("/", getAllCategories);

// ambil kategori by ID
router.get("/:id", getCategoryById);

// tambah kategori (butuh token login dan role admin)
router.post("/", verifyToken, requireAdmin, upload.single("image"), addCategory);

// update kategori (butuh token login dan role admin)
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), updateCategory);

// hapus kategori (butuh token login dan role admin)
router.delete("/:id", verifyToken, requireAdmin, deleteCategory);

export default router;
