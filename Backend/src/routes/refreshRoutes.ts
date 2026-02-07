import { Router } from 'express';
import { refreshController } from '../controller/refreshController';

const router = Router();

// POST /api/auth/refresh
router.post('/', refreshController);

export default router;
