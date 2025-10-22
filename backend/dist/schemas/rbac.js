"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSetRolesSchema = exports.userUpdateSchema = exports.userCreateSchema = exports.roleSetPermissionsSchema = exports.roleUpdateSchema = exports.roleCreateSchema = exports.permissionUpdateSchema = exports.permissionCreateSchema = void 0;
const zod_1 = require("zod");
exports.permissionCreateSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .min(3)
        .max(64)
        .regex(/^[a-z][a-z0-9._:-]*$/, 'invalid permission key format'),
    description: zod_1.z.string().max(255).optional(),
});
exports.permissionUpdateSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .min(3)
        .max(64)
        .regex(/^[a-z][a-z0-9._:-]*$/)
        .optional(),
    description: zod_1.z.string().max(255).nullable().optional(),
});
exports.roleCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(64),
    description: zod_1.z.string().max(255).optional(),
    permissionIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.roleUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(64).optional(),
    description: zod_1.z.string().max(255).nullable().optional(),
});
exports.roleSetPermissionsSchema = zod_1.z.object({
    permissionIds: zod_1.z.array(zod_1.z.string()).min(0),
});
exports.userCreateSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255),
    password: zod_1.z.string().min(8).max(128),
    firstName: zod_1.z.string().min(1).max(64),
    lastName: zod_1.z.string().min(1).max(64),
    isActive: zod_1.z.boolean().optional(),
    roleIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.userUpdateSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255).optional(),
    password: zod_1.z.string().min(8).max(128).optional(),
    firstName: zod_1.z.string().min(1).max(64).optional(),
    lastName: zod_1.z.string().min(1).max(64).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.userSetRolesSchema = zod_1.z.object({
    roleIds: zod_1.z.array(zod_1.z.string()).min(0),
});
