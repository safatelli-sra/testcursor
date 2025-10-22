import { z } from 'zod';

export const storeCreateSchema = z.object({
  name: z.string().min(1).max(128),
  competitor: z.string().min(1).max(128),
  address: z.string().max(128).optional(),
  city: z.string().max(64).optional(),
  country: z.string().max(64).optional(),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  phone: z
    .string()
    .regex(/^[+0-9 ().-]{7,20}$/)
    .optional(),
  website: z.string().url().optional(),
});

export const storeUpdateSchema = storeCreateSchema.partial();
