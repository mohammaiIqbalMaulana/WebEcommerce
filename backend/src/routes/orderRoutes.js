import express from 'express';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTracking,
  createRefund,
  getOrderStats,
  printInvoice
} from '../controllers/orderController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Semua routes butuh authentication
router.use(authenticateToken);

// GET /api/orders - Get all orders (admin only)
router.get('/', requireRole(['superadmin', 'fulfillment']), getAllOrders);

// GET /api/orders/stats - Get order statistics
router.get('/stats', requireRole(['superadmin', 'finance']), getOrderStats);

// GET /api/orders/:id - Get order by ID
router.get('/:id', requireRole(['superadmin', 'fulfillment', 'finance']), getOrderById);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', requireRole(['superadmin', 'fulfillment']), updateOrderStatus);

// PUT /api/orders/:id/tracking - Update tracking info
router.put('/:id/tracking', requireRole(['superadmin', 'fulfillment']), updateTracking);

// POST /api/orders/:id/refund - Create refund
router.post('/:id/refund', requireRole(['superadmin', 'finance']), createRefund);

// GET /api/orders/:id/invoice - Print invoice
router.get('/:id/invoice', requireRole(['superadmin', 'finance']), printInvoice);

export default router;
