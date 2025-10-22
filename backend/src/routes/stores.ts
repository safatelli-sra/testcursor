import { Router } from 'express';
import prisma from '../prisma';
import { validateBody, validateQuery } from '../middleware/validate';
import { storeCreateSchema, storeUpdateSchema } from '../schemas/stores';
import { z } from 'zod';

const router = Router();

router.post('/', validateBody(storeCreateSchema), async (req, res) => {
  const created = await prisma.competitorStore.create({ data: req.body });
  res.status(201).json(created);
});

router.get('/', async (_req, res) => {
  const stores = await prisma.competitorStore.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(stores);
});

router.get('/nearby',
  validateQuery(
    z.object({
      lat: z.coerce.number().gte(-90).lte(90),
      lng: z.coerce.number().gte(-180).lte(180),
      radiusKm: z.coerce.number().positive().max(200),
    })
  ),
  async (req, res) => {
    const { lat, lng, radiusKm } = req.query as unknown as {
      lat: number; lng: number; radiusKm: number;
    };

    // naive filtering by bounding box first
    const kmPerDegreeLat = 110.574;
    const kmPerDegreeLng = 111.320 * Math.cos((lat * Math.PI) / 180);
    const dLat = radiusKm / kmPerDegreeLat;
    const dLng = radiusKm / kmPerDegreeLng;

    const minLat = lat - dLat;
    const maxLat = lat + dLat;
    const minLng = lng - dLng;
    const maxLng = lng + dLng;

    const stores = await prisma.competitorStore.findMany({
      where: {
        latitude: { gte: minLat, lte: maxLat },
        longitude: { gte: minLng, lte: maxLng },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(stores);
  }
);

router.patch('/:id', validateBody(storeUpdateSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const updated = await prisma.competitorStore.update({ where: { id }, data: req.body });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params as { id: string };
  await prisma.competitorStore.delete({ where: { id } });
  res.status(204).send();
});

export default router;
