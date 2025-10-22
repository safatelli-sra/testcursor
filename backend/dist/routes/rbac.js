"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = __importDefault(require("../prisma"));
const validate_1 = require("../middleware/validate");
const rbac_1 = require("../schemas/rbac");
const router = (0, express_1.Router)();
// Permissions CRUD
router.post('/permissions', (0, validate_1.validateBody)(rbac_1.permissionCreateSchema), async (req, res) => {
    const { key, description } = req.body;
    const permission = await prisma_1.default.permission.create({ data: { key, description } });
    res.status(201).json(permission);
});
router.get('/permissions', async (_req, res) => {
    const permissions = await prisma_1.default.permission.findMany({ orderBy: { key: 'asc' } });
    res.json(permissions);
});
router.patch('/permissions/:id', (0, validate_1.validateBody)(rbac_1.permissionUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const updated = await prisma_1.default.permission.update({ where: { id }, data: req.body });
    res.json(updated);
});
router.delete('/permissions/:id', async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.permission.delete({ where: { id } });
    res.status(204).send();
});
// Roles CRUD
router.post('/roles', (0, validate_1.validateBody)(rbac_1.roleCreateSchema), async (req, res) => {
    const { name, description, permissionIds } = req.body;
    const role = await prisma_1.default.role.create({
        data: {
            name,
            description,
            permissions: permissionIds
                ? {
                    create: permissionIds.map((permissionId) => ({ permissionId })),
                }
                : undefined,
        },
        include: { permissions: { include: { permission: true } } },
    });
    res.status(201).json(role);
});
router.get('/roles', async (_req, res) => {
    const roles = await prisma_1.default.role.findMany({
        orderBy: { name: 'asc' },
        include: { permissions: { include: { permission: true } } },
    });
    res.json(roles);
});
router.patch('/roles/:id', (0, validate_1.validateBody)(rbac_1.roleUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const updated = await prisma_1.default.role.update({ where: { id }, data: req.body });
    res.json(updated);
});
router.post('/roles/:id/permissions', (0, validate_1.validateBody)(rbac_1.roleSetPermissionsSchema), async (req, res) => {
    const { id } = req.params;
    const { permissionIds } = req.body;
    // Reset and set
    await prisma_1.default.rolePermission.deleteMany({ where: { roleId: id } });
    const created = await prisma_1.default.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
    });
    res.json({ count: created.count });
});
router.delete('/roles/:id', async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.role.delete({ where: { id } });
    res.status(204).send();
});
// Users CRUD
router.post('/users', (0, validate_1.validateBody)(rbac_1.userCreateSchema), async (req, res) => {
    const { email, password, firstName, lastName, isActive = true, roleIds } = req.body;
    const salt = await (0, bcryptjs_1.genSalt)(10);
    const passwordHash = await (0, bcryptjs_1.hash)(password, salt);
    const user = await prisma_1.default.user.create({
        data: {
            email,
            passwordHash,
            firstName,
            lastName,
            isActive,
            roles: roleIds
                ? {
                    create: roleIds.map((roleId) => ({ roleId })),
                }
                : undefined,
        },
        include: { roles: { include: { role: true } } },
    });
    res.status(201).json(user);
});
router.get('/users', async (_req, res) => {
    const users = await prisma_1.default.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { roles: { include: { role: true } } },
    });
    res.json(users);
});
router.patch('/users/:id', (0, validate_1.validateBody)(rbac_1.userUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const { password, ...rest } = req.body;
    let passwordHash;
    if (password) {
        const salt = await (0, bcryptjs_1.genSalt)(10);
        passwordHash = await (0, bcryptjs_1.hash)(password, salt);
    }
    const updated = await prisma_1.default.user.update({
        where: { id },
        data: { ...rest, ...(passwordHash ? { passwordHash } : {}) },
        include: { roles: { include: { role: true } } },
    });
    res.json(updated);
});
router.post('/users/:id/roles', (0, validate_1.validateBody)(rbac_1.userSetRolesSchema), async (req, res) => {
    const { id } = req.params;
    const { roleIds } = req.body;
    await prisma_1.default.userRole.deleteMany({ where: { userId: id } });
    const created = await prisma_1.default.userRole.createMany({
        data: roleIds.map((roleId) => ({ userId: id, roleId })),
    });
    res.json({ count: created.count });
});
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.user.delete({ where: { id } });
    res.status(204).send();
});
exports.default = router;
