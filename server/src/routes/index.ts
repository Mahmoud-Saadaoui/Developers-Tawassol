import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import authRouter from '../controllers/authController';
import oauthRouter from '../routes/oauth';
import uploadRouter from '../controllers/uploadController';
import questionRouter from '../controllers/questionController';
import voteRouter from '../controllers/voteController';
import tagRouter from '../controllers/tagController';
import userRouter from '../controllers/userController';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  }),
);

router.use('/auth', authRouter);
router.use('/auth', oauthRouter);
router.use('/upload', uploadRouter);
router.use('/questions', questionRouter);
router.use('/votes', voteRouter);
router.use('/tags', tagRouter);
router.use('/users', userRouter);

export default router;
