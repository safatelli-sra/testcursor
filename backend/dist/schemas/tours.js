"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourUpdateSchema = exports.tourCreateSchema = exports.tourBase = void 0;
const zod_1 = require("zod");
exports.tourBase = {
    collaboratorId: zod_1.z.string().min(1),
    assignedStoreId: zod_1.z.string().min(1).optional(),
    name: zod_1.z.string().min(1).max(128),
    missionType: zod_1.z.string().min(1).max(64),
    department: zod_1.z.string().min(1).max(64).optional(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    notes: zod_1.z.string().max(1024).optional(),
};
exports.tourCreateSchema = zod_1.z
    .object(exports.tourBase)
    .refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
});
exports.tourUpdateSchema = zod_1.z
    .object({
    collaboratorId: zod_1.z.string().min(1).optional(),
    assignedStoreId: zod_1.z.string().min(1).optional(),
    name: zod_1.z.string().min(1).max(128).optional(),
    missionType: zod_1.z.string().min(1).max(64).optional(),
    department: zod_1.z.string().min(1).max(64).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().max(1024).optional(),
})
    .refine((data) => !(data.startDate && data.endDate) ||
    (data.startDate && data.endDate && data.endDate > data.startDate), {
    message: 'endDate must be after startDate',
    path: ['endDate'],
});
