import * as z from 'zod';

export const bookingSchema = z
  .object({
    customerFirstName: z
      .string()
      .min(1, 'First name is required.'),
    customerSurname: z
      .string()
      .min(1, 'Surname is required.'),
    customerAddress: z
      .string()
      .min(1, 'Address is required.'),
    customerAge: z
      .number({ invalid_type_error: 'Age must be a number.' })
      .min(18, 'Customer must be at least 18 years old.'),
    hasDrivingLicense: z.enum(['yes', 'no'], {
      required_error: 'You must select an option.',
    }),
    numberOfDays: z
      .number({ invalid_type_error: 'Number of days is required.' })
      .min(1, 'Booking must be for at least 1 day.')
      .max(28, 'Booking cannot exceed 28 days.'),
    carType: z.enum(['City Car', 'Family Car', 'Sports Car', 'SUV'], {
      required_error: 'You must select a car type.',
    }),
    fuelType: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Full Electric'], {
      required_error: 'You must select a fuel type.',
    }),
    paymentMethod: z.enum(['Cash', 'Fonepay', 'Card'], {
      required_error: 'You must select a payment method.',
    }),
    unlimitedMileage: z.boolean().default(false),
    breakdownCover: z.boolean().default(false),
  })
  .refine((data) => data.hasDrivingLicense === 'yes', {
    message: 'Customer must have a valid driving license to book a car.',
    path: ['hasDrivingLicense'],
  });
