"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeUpdateSchema = exports.storeCreateSchema = void 0;
const zod_1 = require("zod");
exports.storeCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(128),
    competitor: zod_1.z.string().min(1).max(128),
    address: zod_1.z.string().max(128).optional(),
    city: zod_1.z.string().max(64).optional(),
    country: zod_1.z.string().max(64).optional(),
    latitude: zod_1.z.number().gte(-90).lte(90),
    longitude: zod_1.z.number().gte(-180).lte(180),
    phone: zod_1.z
        .string()
        .regex(/^[+0-9 ().-]{7,20}$/)
        .optional(),
    website: zod_1.z.string().url().optional(),
});
exports.storeUpdateSchema = exports.storeCreateSchema.partial();
