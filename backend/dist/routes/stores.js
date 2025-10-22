"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const validate_1 = require("../middleware/validate");
const stores_1 = require("../schemas/stores");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.post('/', (0, validate_1.validateBody)(stores_1.storeCreateSchema), async (req, res) => {
    const created = await prisma_1.default.competitorStore.create({ data: req.body });
    res.status(201).json(created);
});
router.get('/', async (_req, res) => {
    const stores = await prisma_1.default.competitorStore.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(stores);
});
router.get('/nearby', (0, validate_1.validateQuery)(zod_1.z.object({
    lat: zod_1.z.coerce.number().gte(-90).lte(90),
    lng: zod_1.z.coerce.number().gte(-180).lte(180),
    radiusKm: zod_1.z.coerce.number().positive().max(200),
})), async (req, res) => {
    const { lat, lng, radiusKm } = req.query;
    // naive filtering by bounding box first
    const kmPerDegreeLat = 110.574;
    const kmPerDegreeLng = 111.320 * Math.cos((lat * Math.PI) / 180);
    const dLat = radiusKm / kmPerDegreeLat;
    const dLng = radiusKm / kmPerDegreeLng;
    const minLat = lat - dLat;
    const maxLat = lat + dLat;
    const minLng = lng - dLng;
    const maxLng = lng + dLng;
    const stores = await prisma_1.default.competitorStore.findMany({
        where: {
            latitude: { gte: minLat, lte: maxLat },
            longitude: { gte: minLng, lte: maxLng },
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json(stores);
});
router.patch('/:id', (0, validate_1.validateBody)(stores_1.storeUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const updated = await prisma_1.default.competitorStore.update({ where: { id }, data: req.body });
    res.json(updated);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.competitorStore.delete({ where: { id } });
    res.status(204).send();
});
exports.default = router;
