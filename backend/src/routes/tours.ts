import { Router } from 'express';
import prisma from '../prisma';
import { validateBody } from '../middleware/validate';
import { tourCreateSchema, tourUpdateSchema } from '../schemas/tours';

const router = Router();

router.post('/', validateBody(tourCreateSchema), async (req, res) => {
  const created = await prisma.tour.create({ data: req.body });
  res.status(201).json(created);
});

router.get('/', async (_req, res) => {
  const tours = await prisma.tour.findMany({
    orderBy: { startDate: 'desc' },
    include: { collaborator: true, assignedStore: true },
  });
  res.json(tours);
});

router.patch('/:id', validateBody(tourUpdateSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const updated = await prisma.tour.update({ where: { id }, data: req.body });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params as { id: string };
  await prisma.tour.delete({ where: { id } });
  res.status(204).send();
});

export default router;
