
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useFirebase } from '@/hooks/use-auth';
import { forecastFleetNeeds } from '@/ai/flows/fleet-forecasting-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, Bot, TrendingUp } from 'lucide-react';

export default function DashboardClient() {
  const [activeBookings, setActiveBookings] = useState(0);
  const [forecast, setForecast] = useState<{
    projectedCarNeeds: string;
    investmentSuggestion: string;
  } | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebase();

  useEffect(() => {
    if (!db) {
        if(!loadingBookings) {
            setError('Firebase is not configured.');
        }
      setLoadingBookings(false);
      return;
    }
    const q = query(collection(db, 'bookings'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setActiveBookings(querySnapshot.size);
        setLoadingBookings(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch active bookings.');
        setLoadingBookings(false);
      }
    );
    return () => unsubscribe();
  }, [db, loadingBookings]);

  useEffect(() => {
    if (!loadingBookings && activeBookings >= 0) {
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
  }, [activeBookings, loadingBookings]);
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
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
