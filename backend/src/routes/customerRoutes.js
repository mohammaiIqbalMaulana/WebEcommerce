import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  toggleCustomerBan,
  getCustomerNotes,
  addCustomerNote,
  getCustomerStats
} from '../controllers/customerController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Semua routes butuh authentication
router.use(authenticateToken);

// GET /api/customers - Get all customers
router.get('/', requireRole(['superadmin', 'finance']), getAllCustomers);

// GET /api/customers/stats - Get customer statistics
router.get('/stats', requireRole(['superadmin', 'finance']), getCustomerStats);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', requireRole(['superadmin', 'finance']), getCustomerById);

// PUT /api/customers/:id - Update customer
router.put('/:id', requireRole(['superadmin']), updateCustomer);

// PUT /api/customers/:id/ban - Ban/unban customer
router.put('/:id/ban', requireRole(['superadmin']), toggleCustomerBan);

// GET /api/customers/:id/notes - Get customer notes/history
router.get('/:id/notes', requireRole(['superadmin', 'finance']), getCustomerNotes);

// POST /api/customers/:id/notes - Add customer note
router.post('/:id/notes', requireRole(['superadmin', 'finance']), addCustomerNote);

export default router;
