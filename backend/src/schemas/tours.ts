import { z } from 'zod';

export const tourBase = {
  collaboratorId: z.string().min(1),
  assignedStoreId: z.string().min(1).optional(),
  name: z.string().min(1).max(128),
  missionType: z.string().min(1).max(64),
  department: z.string().min(1).max(64).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  notes: z.string().max(1024).optional(),
};

export const tourCreateSchema = z
  .object(tourBase)
  .refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });

export const tourUpdateSchema = z
  .object({
    collaboratorId: z.string().min(1).optional(),
    assignedStoreId: z.string().min(1).optional(),
    name: z.string().min(1).max(128).optional(),
    missionType: z.string().min(1).max(64).optional(),
    department: z.string().min(1).max(64).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    notes: z.string().max(1024).optional(),
  })
  .refine(
    (data) =>
      !(data.startDate && data.endDate) ||
      (data.startDate && data.endDate && data.endDate > data.startDate),
    {
      message: 'endDate must be after startDate',
      path: ['endDate'],
    }
  );
