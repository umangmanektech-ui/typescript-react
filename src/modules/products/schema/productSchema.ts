import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required('Product title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: yup
    .string()
    .trim()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  price: yup
    .number()
    .typeError('Price must be a valid number')
    .required('Price is required')
    .positive('Price must be greater than 0'),
  discountPercentage: yup
    .number()
    .typeError('Discount must be a number')
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr)),
  stock: yup
    .number()
    .typeError('Stock must be an integer')
    .required('Stock count is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  brand: yup
    .string()
    .trim()
    .optional(),
  category: yup
    .string()
    .trim()
    .required('Please select a category'),
  thumbnail: yup
    .string()
    .trim()
    .url('Thumbnail must be a valid URL')
    .optional()
    .transform((curr, orig) => (orig === '' ? undefined : curr)),
});

export type ProductFormValues = yup.InferType<typeof productValidationSchema>;
