import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required('Product title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: yup
    .string()
    .trim()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters'),
  price: yup
    .number()
    .typeError('Price must be a valid number')
    .required('Price is required')
    .positive('Price must be greater than 0'),
  category: yup
    .string()
    .trim()
    .required('Please select a category'),
  stock: yup
    .number()
    .typeError('Stock must be an integer')
    .required('Stock count is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  sku: yup
    .string()
    .trim()
    .required('SKU is required')
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU cannot exceed 50 characters'),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .min(0, 'Rating cannot be less than 0')
    .max(5, 'Rating cannot exceed 5')
    .nullable()
    .transform((curr, orig) => (orig === '' || orig === null || orig === undefined ? 5 : curr)),
  tags: yup
    .string()
    .optional(),
});

export type ProductFormValues = yup.InferType<typeof productValidationSchema>;
