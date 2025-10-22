import { z } from 'zod';

export const permissionCreateSchema = z.object({
  key: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[a-z][a-z0-9._:-]*$/, 'invalid permission key format'),
  description: z.string().max(255).optional(),
});

export const permissionUpdateSchema = z.object({
  key: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[a-z][a-z0-9._:-]*$/)
    .optional(),
  description: z.string().max(255).nullable().optional(),
});

export const roleCreateSchema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().max(255).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const roleUpdateSchema = z.object({
  name: z.string().min(3).max(64).optional(),
  description: z.string().max(255).nullable().optional(),
});

export const roleSetPermissionsSchema = z.object({
  permissionIds: z.array(z.string()).min(0),
});

export const userCreateSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  isActive: z.boolean().optional(),
  roleIds: z.array(z.string()).optional(),
});

export const userUpdateSchema = z.object({
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).max(128).optional(),
  firstName: z.string().min(1).max(64).optional(),
  lastName: z.string().min(1).max(64).optional(),
  isActive: z.boolean().optional(),
});

export const userSetRolesSchema = z.object({
  roleIds: z.array(z.string()).min(0),
});
