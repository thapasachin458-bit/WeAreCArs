import { Timestamp } from 'firebase/firestore';

export type CarType = 'City Car' | 'Family Car' | 'Sports Car' | 'SUV';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Full Electric';

export interface BookingFormData {
  customerFirstName: string;
  customerSurname: string;
  customerAddress: string;
  customerAge: number;
  hasDrivingLicense: 'yes' | 'no';
  numberOfDays: number;
  carType: CarType;
  fuelType: FuelType;
  unlimitedMileage: boolean;
  breakdownCover: boolean;
}

export interface PriceDetails {
  baseRental: number;
  carTypeSurcharge: number;
  fuelSurcharge: number;
  unlimitedMileageCost: number;
  breakdownCoverCost: number;
  totalCost: number;
}

export interface Booking extends Omit<BookingFormData, 'customerAge'> {
  id: string;
  customerAge: number;
  totalPrice: number;
  createdAt: Timestamp;
}

    