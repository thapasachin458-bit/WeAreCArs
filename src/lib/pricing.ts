import type { BookingFormData, PriceDetails } from './definitions';

const BASE_RENTAL_PER_DAY = 25;

const CAR_TYPE_SURCHARGE = {
  'City Car': 0,
  'Family Car': 50,
  'Sports Car': 75,
  SUV: 65,
};

const FUEL_TYPE_SURCHARGE = {
  Petrol: 0,
  Diesel: 0,
  Hybrid: 30,
  'Full Electric': 50,
};

const UNLIMITED_MILEAGE_PER_DAY = 10;
const BREAKDOWN_COVER_PER_DAY = 2;

export function calculateTotalCost(data: Partial<BookingFormData>): PriceDetails {
  const days = data.numberOfDays || 0;
  
  const baseRental = days * BASE_RENTAL_PER_DAY;
  
  const carTypeSurcharge = data.carType ? CAR_TYPE_SURCHARGE[data.carType] : 0;
  
  const fuelSurcharge = data.fuelType ? FUEL_TYPE_SURCHARGE[data.fuelType] : 0;
  
  const unlimitedMileageCost = data.unlimitedMileage
    ? days * UNLIMITED_MILEAGE_PER_DAY
    : 0;
    
  const breakdownCoverCost = data.breakdownCover
    ? days * BREAKDOWN_COVER_PER_DAY
    : 0;

  const totalCost =
    baseRental +
    carTypeSurcharge +
    fuelSurcharge +
    unlimitedMileageCost +
    breakdownCoverCost;

  return {
    baseRental,
    carTypeSurcharge,
    fuelSurcharge,
    unlimitedMileageCost,
    breakdownCoverCost,
    totalCost,
  };
}
