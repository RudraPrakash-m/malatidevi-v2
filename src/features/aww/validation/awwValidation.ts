// src/features/aww/validation/awwValidation.ts

import type {
  AwwShgDetailsFormData,
  AwwDeliveryCatalogueFormData,
  AwwBeneficiaryDistributionFormData,
} from '../types/aww.types';

export const validateShgDetails = (values: Partial<AwwShgDetailsFormData>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.name?.trim()) errors.name = 'Name is required';
  if (!values.item?.trim()) errors.item = 'Item is required';
  if (!values.quantity) errors.quantity = 'Quantity is required';
  if (!values.dueDate?.trim()) errors.dueDate = 'Due Date is required';
  if (!values.deliveryDate?.trim()) errors.deliveryDate = 'Delivery Date is required';

  return errors;
};

export const validateDeliveryCatalogue = (
  values: Partial<AwwDeliveryCatalogueFormData>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.shgName?.trim()) errors.shgName = 'SHG Name is required';
  if (!values.awcName?.trim()) errors.awcName = 'AWC Name is required';
  if (!values.deliveryDate?.trim()) errors.deliveryDate = 'Delivery Date is required';
  if (!values.size?.trim()) errors.size = 'Size is required';
  if (!values.colour?.trim()) errors.colour = 'Colour is required';
  if (!values.gender?.trim()) errors.gender = 'Gender is required';
  if (!values.uniform?.trim()) errors.uniform = 'Uniform is required';
  if (values.orderReceived === undefined || values.orderReceived === '') {
    errors.orderReceived = 'Order Received is required';
  }
  if (values.totalUnits === undefined || values.totalUnits === '') {
    errors.totalUnits = 'Total Units is required';
  }

  return errors;
};

export const validateBeneficiaryDistribution = (
  values: Partial<AwwBeneficiaryDistributionFormData>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.phase?.trim()) errors.phase = 'Phase is required';
  if (!values.date?.trim()) errors.date = 'Date is required';

  return errors;
};
