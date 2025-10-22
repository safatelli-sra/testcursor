import { Router } from 'express';
import { hash, genSalt } from 'bcryptjs';
import prisma from '../prisma';
import { validateBody } from '../middleware/validate';
import {
  permissionCreateSchema,
  permissionUpdateSchema,
  roleCreateSchema,
  roleUpdateSchema,
  roleSetPermissionsSchema,
  userCreateSchema,
  userUpdateSchema,
  userSetRolesSchema,
} from '../schemas/rbac';

const router = Router();

// Permissions CRUD
router.post('/permissions', validateBody(permissionCreateSchema), async (req, res) => {
  const { key, description } = req.body;
  const permission = await prisma.permission.create({ data: { key, description } });
  res.status(201).json(permission);
});

router.get('/permissions', async (_req, res) => {
  const permissions = await prisma.permission.findMany({ orderBy: { key: 'asc' } });
  res.json(permissions);
});

router.patch('/permissions/:id', validateBody(permissionUpdateSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const updated = await prisma.permission.update({ where: { id }, data: req.body });
  res.json(updated);
});

router.delete('/permissions/:id', async (req, res) => {
  const { id } = req.params as { id: string };
  await prisma.permission.delete({ where: { id } });
  res.status(204).send();
});

// Roles CRUD
router.post('/roles', validateBody(roleCreateSchema), async (req, res) => {
  const { name, description, permissionIds } = req.body as {
    name: string;
    description?: string;
    permissionIds?: string[];
  };
  const role = await prisma.role.create({
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
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: { permissions: { include: { permission: true } } },
  });
  res.json(roles);
});

router.patch('/roles/:id', validateBody(roleUpdateSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const updated = await prisma.role.update({ where: { id }, data: req.body });
  res.json(updated);
});

router.post('/roles/:id/permissions', validateBody(roleSetPermissionsSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const { permissionIds } = req.body as { permissionIds: string[] };

  // Reset and set
  await prisma.rolePermission.deleteMany({ where: { roleId: id } });
  const created = await prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
  });
  res.json({ count: created.count });
});

router.delete('/roles/:id', async (req, res) => {
  const { id } = req.params as { id: string };
  await prisma.role.delete({ where: { id } });
  res.status(204).send();
});

// Users CRUD
router.post('/users', validateBody(userCreateSchema), async (req, res) => {
  const { email, password, firstName, lastName, isActive = true, roleIds } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive?: boolean;
    roleIds?: string[];
  };

  const salt = await genSalt(10);
  const passwordHash = await hash(password, salt);

  const user = await prisma.user.create({
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
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { roles: { include: { role: true } } },
  });
  res.json(users);
});

router.patch('/users/:id', validateBody(userUpdateSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const { password, ...rest } = req.body as { password?: string } & Record<string, unknown>;
  let passwordHash: string | undefined;
  if (password) {
    const salt = await genSalt(10);
    passwordHash = await hash(password, salt);
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { ...rest, ...(passwordHash ? { passwordHash } : {}) },
    include: { roles: { include: { role: true } } },
  });
  res.json(updated);
});

router.post('/users/:id/roles', validateBody(userSetRolesSchema), async (req, res) => {
  const { id } = req.params as { id: string };
  const { roleIds } = req.body as { roleIds: string[] };

  await prisma.userRole.deleteMany({ where: { userId: id } });
  const created = await prisma.userRole.createMany({
    data: roleIds.map((roleId) => ({ userId: id, roleId })),
  });
  res.json({ count: created.count });
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params as { id: string };
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

export default router;
