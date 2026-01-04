'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Booking } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function RentedCarsList() {
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'bookings'), orderBy('createdAt', 'desc')) : null
  , [firestore]);
  
  const { data: bookings, isLoading, error } = useCollection<Booking>(bookingsQuery);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-GB');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold text-destructive">{error.message}</h3>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold">No Bookings Found</h3>
          <p className="text-muted-foreground mt-2">
            Create a new booking to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead className="hidden sm:table-cell">Car Type</TableHead>
              <TableHead className="hidden md:table-cell">Days Booked</TableHead>
              <TableHead className="hidden md:table-cell">Payment By</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Booking Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.customerFirstName} {booking.customerSurname}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{booking.carType}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{booking.numberOfDays}</TableCell>
                <TableCell className="hidden md:table-cell">
                   <Badge variant="outline">{booking.paymentMethod}</Badge>
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(booking.totalPrice)}</TableCell>
                <TableCell className="hidden sm:table-cell text-right">
                  {formatDate(booking.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
