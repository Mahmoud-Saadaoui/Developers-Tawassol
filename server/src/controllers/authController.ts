import { Router, type Request, type Response } from 'express';
import { User, hashPassword, comparePassword, toSafeJSON } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies';
import { validate } from '../middleware/validate';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';
import { loginSchema, registerSchema } from '../validators/auth';

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw ApiError.badRequest('Email already in use');

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      provider: 'local',
    });

    setAuthCookie(res, user.id);
    res.status(201).json({ user: toSafeJSON(user) });
  }),
);

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash',
    );
    if (!user || !(await comparePassword(user, password))) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    setAuthCookie(res, user.id);
    res.json({ user: toSafeJSON(user) });
  }),
);

router.post(
  '/logout',
  asyncHandler(async (_req: Request, res: Response) => {
    clearAuthCookie(res);
    res.json({ message: 'Logged out' });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) throw ApiError.notFound('User not found');
    res.json({ user: toSafeJSON(user) });
  }),
);

export default router;
