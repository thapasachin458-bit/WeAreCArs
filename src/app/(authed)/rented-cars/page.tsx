import RentedCarsList from './rented-cars-list';

export default function RentedCarsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Rented Cars
        </h1>
        <p className="text-muted-foreground">
          View all current and past bookings.
        </p>
      </div>
      <RentedCarsList />
    </div>
  );
}
