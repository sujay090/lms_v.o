import express from 'express';
import { loginAdmin, verifyAuth, logout } from '../../controllers/admin/auth.controller';
import { isAuthenticated } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', isAuthenticated, verifyAuth);
router.post('/logout', isAuthenticated, logout);

export default router;
