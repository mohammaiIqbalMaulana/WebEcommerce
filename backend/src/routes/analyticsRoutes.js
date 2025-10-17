import express from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getCustomerReport,
  getInventoryReport,
  getProductPerformanceReport
} from '../controllers/analyticsController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Semua routes butuh authentication
router.use(authenticateToken);

// GET /api/analytics/dashboard - Dashboard overview
router.get('/dashboard', requireRole(['superadmin', 'finance']), getDashboardStats);

// GET /api/analytics/sales - Sales report
router.get('/sales', requireRole(['superadmin', 'finance']), getSalesReport);

// GET /api/analytics/customers - Customer report
router.get('/customers', requireRole(['superadmin', 'finance']), getCustomerReport);

// GET /api/analytics/inventory - Inventory report
router.get('/inventory', requireRole(['superadmin', 'admin_produk']), getInventoryReport);

// GET /api/analytics/products - Product performance report
router.get('/products', requireRole(['superadmin', 'admin_produk', 'finance']), getProductPerformanceReport);

export default router;
