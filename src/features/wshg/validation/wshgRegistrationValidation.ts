// src/features/wshg/validation/wshgRegistrationValidation.ts

export const validateWshgRegistration = (values: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.district) errors.district = 'District is required';
  if (!values.project) errors.project = 'Project is required';
  if (!values.wshgRegNo?.trim()) errors.wshgRegNo = 'SHG Registration No is required';
  if (!values.wshgName?.trim()) errors.wshgName = 'SHG Name is required';
  if (!values.contact || values.contact.length !== 10) errors.contact = 'Valid 10-digit mobile number is required';
  if (!values.address?.trim()) errors.address = 'Address is required';
  if (!values.bankName?.trim()) errors.bankName = 'Bank name is required';
  if (!values.bankAccountNo?.trim()) errors.bankAccountNo = 'Bank account number is required';
  if (!values.ifsc?.trim()) errors.ifsc = 'IFSC code is required';

  return errors;
};
