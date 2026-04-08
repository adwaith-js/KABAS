import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function createAuthRouter(): Router {
  const router = Router();

  router.post('/auth/login', (req: Request, res: Response): void => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const validEmail = process.env.INSTRUCTOR_EMAIL ?? 'admin@kabas.edu';
    const validPassword = process.env.INSTRUCTOR_PASSWORD ?? 'kabas2025';

    if (email !== validEmail || password !== validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { email, role: 'instructor' },
      process.env.JWT_SECRET ?? 'kabas-dev-secret',
      { expiresIn: '8h' },
    );

    res.json({ data: { token, email, role: 'instructor' } });
  });

  return router;
}
