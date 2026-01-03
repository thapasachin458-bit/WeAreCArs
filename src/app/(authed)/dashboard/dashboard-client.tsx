
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { forecastFleetNeeds } from '@/ai/flows/fleet-forecasting-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, Bot, TrendingUp } from 'lucide-react';
import { Booking } from '@/lib/definitions';

export default function DashboardClient() {
  const firestore = useFirestore();
  
  const bookingsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'bookings')) : null
  , [firestore]);
  
  const { data: bookings, isLoading: loadingBookings, error } = useCollection<Booking>(bookingsQuery);

  const [forecast, setForecast] = useState<{
    projectedCarNeeds: string;
    investmentSuggestion: string;
  } | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const activeBookings = bookings?.length ?? 0;

  useEffect(() => {
    if (!loadingBookings && bookings) {
      setLoadingForecast(true);
      forecastFleetNeeds({ activeBookings })
        .then((result) => {
          setForecast(result);
        })
        .catch((error) => {
          console.error('Error getting forecast:', error);
          setForecast({
            projectedCarNeeds: 'Error',
            investmentSuggestion: 'Could not generate suggestion.',
          });
        })
        .finally(() => {
          setLoadingForecast(false);
        });
    }
  }, [activeBookings, loadingBookings, bookings]);
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingBookings ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <div className="text-2xl font-bold">{activeBookings}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Total number of cars currently rented out.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            AI: Projected Fleet Need
          </CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingForecast ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <div className="text-2xl font-bold">
              {forecast?.projectedCarNeeds || 'N/A'}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Estimated cars needed for the next month.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            AI: Investment Suggestion
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingForecast ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="text-lg font-semibold text-primary">
              {forecast?.investmentSuggestion || 'N/A'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
