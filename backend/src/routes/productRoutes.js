import express from "express";
import multer from "multer";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  importProducts,
  exportProducts
} from "../controllers/productController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// konfigurasi upload untuk multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.random().toString(36).substr(2, 9) + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// middleware untuk cek role admin
const requireAdmin = (req, res, next) => {
  if (!['superadmin', 'admin_produk', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Akses ditolak! Hanya admin yang bisa mengelola produk." });
  }
  next();
};

// ambil semua produk
router.get("/", getAllProducts);

// ambil produk by ID
router.get("/:id", getProductById);

// tambah produk (butuh token login dan role admin)
router.post("/", verifyToken, requireAdmin, upload.array("images", 10), addProduct);

// update produk (butuh token login dan role admin)
router.put("/:id", verifyToken, requireAdmin, upload.array("images", 10), updateProduct);

// hapus produk (butuh token login dan role admin)
router.delete("/:id", verifyToken, requireAdmin, deleteProduct);

// bulk update produk
router.put("/bulk/update", verifyToken, requireAdmin, bulkUpdateProducts);

// import produk dari CSV
router.post("/import", verifyToken, requireAdmin, upload.single("csv"), importProducts);

// export produk ke CSV
router.get("/export", verifyToken, requireAdmin, exportProducts);

export default router;
