import { Router } from 'express';
import { meController } from '../controller/meController';

const router = Router();

router.get('/', meController);

export default router;
