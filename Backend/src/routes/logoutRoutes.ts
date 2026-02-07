import { Router } from 'express';
import { logoutController } from '../controller/logoutController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// POST /api/logout
router.post('/', logoutController);

export default router;