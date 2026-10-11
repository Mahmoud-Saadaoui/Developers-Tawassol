import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';
import { deleteImage, uploadImage } from '../services/cloudinaryService';

// Memory storage → buffer → Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest('Only image files are allowed'));
    }
  },
});

const router = Router();

/* ─── Avatar upload ─── */

router.post(
  '/avatar',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded');

    const user = await User.findById(req.userId);
    if (!user) throw ApiError.notFound('User not found');

    // Delete old avatar
    if (user.avatar?.publicId) {
      await deleteImage(user.avatar.publicId);
    }

    const result = await uploadImage(req.file.buffer, 'tawassol/avatars');

    user.avatar = { url: result.url, publicId: result.publicId };
    await user.save();

    res.json({ avatar: user.avatar });
  }),
);

/* ─── Generic image upload ─── */

router.post(
  '/image',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded');

    const result = await uploadImage(req.file.buffer, 'tawassol/images');

    res.json({ url: result.url });
  }),
);

export default router;
