import express from 'express';
import {
  getAllSettings,
  getSetting,
  updateSetting,
  bulkUpdateSettings,
  getStoreSettings,
  resetSetting,
  getSettingsAuditLogs
} from '../controllers/settingsController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - no auth required
// GET /api/settings/store - Get public store settings
router.get('/store', getStoreSettings);

// Semua routes di bawah butuh authentication
router.use(authenticateToken);

// GET /api/settings - Get all settings
router.get('/', requireRole(['superadmin']), getAllSettings);

// GET /api/settings/:key - Get setting by key
router.get('/:key', requireRole(['superadmin']), getSetting);

// PUT /api/settings/:key - Update setting
router.put('/:key', requireRole(['superadmin']), updateSetting);

// PUT /api/settings - Bulk update settings
router.put('/', requireRole(['superadmin']), bulkUpdateSettings);

// POST /api/settings/:key/reset - Reset setting to default
router.post('/:key/reset', requireRole(['superadmin']), resetSetting);

// GET /api/settings/audit/logs - Get settings audit logs
router.get('/audit/logs', requireRole(['superadmin']), getSettingsAuditLogs);

export default router;
