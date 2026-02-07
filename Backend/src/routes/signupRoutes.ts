import {Router } from 'express';
import { signUpController } from '../controller/signUpController';

const router = Router();

router.post('/', signUpController);

export default router;