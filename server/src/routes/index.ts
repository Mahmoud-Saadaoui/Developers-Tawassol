import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import authRouter from '../controllers/authController';
import oauthRouter from '../routes/oauth';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  }),
);

router.use('/auth', authRouter);
router.use('/auth', oauthRouter);

export default router;
