import { Router, Request, Response } from 'express';

const router = Router();

// Example services list
router.get('/', (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'Cloud Consulting', description: 'Azure, AWS, GCP strategy' },
    { id: 2, title: 'Digital Marketing', description: 'SEO, PPC, Social Media' },
    { id: 3, title: 'AI & ML Solutions', description: 'Custom models and pipelines' },
  ]);
});

export default router;
