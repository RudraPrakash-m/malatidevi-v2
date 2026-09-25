// src/features/cdpo/validation/supplyOrderValidation.ts

import { z } from 'zod';

export const supplyOrderSchema = z.object({
  financialYear: z.string().min(1, 'Financial year is required'),
  project: z.string().min(1, 'Project is required'),
  sector: z.string().min(1, 'Sector is required'),
  shgName: z.string().min(1, 'Please select an SHG supplier'),
  itemCategory: z.string().min(1, 'Item category is required'),
  awcCount: z.number().positive('Must cover at least 1 AWC'),
  totalUnitsOrdered: z.number().positive('Must order at least 1 unit'),
  expectedDeliveryDate: z.string().min(1, 'Expected delivery date is required'),
  remarks: z.string().optional(),
});

export const deliveryCatalogueSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  shgName: z.string().min(1, 'SHG name is required'),
  awcName: z.string().min(1, 'AWC name is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  totalUnits: z.number().positive('Total units must be positive'),
});

export type SupplyOrderFormValues = z.infer<typeof supplyOrderSchema>;
export type DeliveryCatalogueFormValues = z.infer<typeof deliveryCatalogueSchema>;
