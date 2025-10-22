"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const validate_1 = require("../middleware/validate");
const tours_1 = require("../schemas/tours");
const router = (0, express_1.Router)();
router.post('/', (0, validate_1.validateBody)(tours_1.tourCreateSchema), async (req, res) => {
    const created = await prisma_1.default.tour.create({ data: req.body });
    res.status(201).json(created);
});
router.get('/', async (_req, res) => {
    const tours = await prisma_1.default.tour.findMany({
        orderBy: { startDate: 'desc' },
        include: { collaborator: true, assignedStore: true },
    });
    res.json(tours);
});
router.patch('/:id', (0, validate_1.validateBody)(tours_1.tourUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const updated = await prisma_1.default.tour.update({ where: { id }, data: req.body });
    res.json(updated);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.tour.delete({ where: { id } });
    res.status(204).send();
});
exports.default = router;
