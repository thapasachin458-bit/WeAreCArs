
'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';

import { bookingSchema } from '@/lib/schemas';
import type { BookingFormData, PriceDetails, CarType, FuelType } from '@/lib/definitions';
import { calculateTotalCost } from '@/lib/pricing';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Car, Fuel, Gauge, ShieldCheck, Users, MapPin, CalendarDays, Wallet } from 'lucide-react';

type FormData = z.infer<typeof bookingSchema>;

function PriceBreakdown({ priceDetails }: { priceDetails: PriceDetails }) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Base Rental</span>
        <span>{formatCurrency(priceDetails.baseRental)}</span>
      </div>
      <div className="flex justify-between">
        <span>Car Type Surcharge</span>
        <span>{formatCurrency(priceDetails.carTypeSurcharge)}</span>
      </div>
      <div className="flex justify-between">
        <span>Fuel Surcharge</span>
        <span>{formatCurrency(priceDetails.fuelSurcharge)}</span>
      </div>
      {priceDetails.unlimitedMileageCost > 0 && (
        <div className="flex justify-between">
          <span>Unlimited Mileage</span>
          <span>{formatCurrency(priceDetails.unlimitedMileageCost)}</span>
        </div>
      )}
      {priceDetails.breakdownCoverCost > 0 && (
        <div className="flex justify-between">
          <span>Breakdown Cover</span>
          <span>{formatCurrency(priceDetails.breakdownCoverCost)}</span>
        </div>
      )}
      <Separator className="my-2" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total Price</span>
        <span>{formatCurrency(priceDetails.totalCost)}</span>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  const [step, setStep] = useState<'form' | 'summary'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [priceDetails, setPriceDetails] = useState<PriceDetails>(calculateTotalCost({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: {
      customerFirstName: '',
      customerSurname: '',
      customerAddress: '',
      customerAge: '' as any, 
      hasDrivingLicense: undefined,
      numberOfDays: 1,
      carType: undefined,
      fuelType: undefined,
      unlimitedMileage: false,
      breakdownCover: false,
    },
  });

  const watchedValues = useWatch({ control: form.control });

  useState(() => {
    const subscription = form.watch((values) => {
      const price = calculateTotalCost(values as Partial<BookingFormData>);
      setPriceDetails(price);
    });
    return () => subscription.unsubscribe();
  });

  const processBooking = (data: FormData) => {
    setFormData(data);
    const finalPrice = calculateTotalCost(data);
    setPriceDetails(finalPrice);
    setStep('summary');
  };

  const handleConfirmBooking = async () => {
    if (!formData || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing booking data or database not available.',
      });
      return;
    }

    setIsSubmitting(true);
    
    const bookingsCollection = collection(firestore, 'bookings');
    addDocumentNonBlocking(bookingsCollection, {
      ...formData,
      totalPrice: priceDetails.totalCost,
      createdAt: serverTimestamp(),
    });
    
    toast({
      title: 'Booking Confirmed!',
      description: 'The new rental has been saved successfully.',
    });
    router.push('/rented-cars');
    setIsSubmitting(false);

  };

  if (step === 'summary' && formData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Booking Summary</h1>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Please Confirm Details</CardTitle>
            <CardDescription>Review the booking information below before confirming.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Details</h3>
              <p><strong>Name:</strong> {formData.customerFirstName} {formData.customerSurname}</p>
              <p><strong>Address:</strong> {formData.customerAddress}</p>
              <p><strong>Age:</strong> {formData.customerAge}</p>
              
              <h3 className="font-semibold text-lg mt-4">Booking Details</h3>
              <p><strong>Car Type:</strong> {formData.carType}</p>
              <p><strong>Fuel Type:</strong> {formData.fuelType}</p>
              <p><strong>Duration:</strong> {formData.numberOfDays} days</p>
              
              <h3 className="font-semibold text-lg mt-4">Extras</h3>
              <p><strong>Unlimited Mileage:</strong> {formData.unlimitedMileage ? 'Yes' : 'No'}</p>
              <p><strong>Breakdown Cover:</strong> {formData.breakdownCover ? 'Yes' : 'No'}</p>
            </div>
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceBreakdown priceDetails={priceDetails} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep('form')}>Cancel / Edit</Button>
            <Button onClick={handleConfirmBooking} disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">New Car Booking</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processBooking)} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users size={20}/> Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="customerFirstName" render={({ field }) => (
                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="customerSurname" render={({ field }) => (
                    <FormItem><FormLabel>Surname</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="customerAddress" render={({ field }) => (
                    <FormItem className="sm:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="customerAge" render={({ field }) => (
                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="hasDrivingLicense" render={({ field }) => (
                    <FormItem><FormLabel>Valid Driving License?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Car size={20}/> Booking Options</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="numberOfDays" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2"><CalendarDays size={16}/>Number of Days</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(+e.target.value)}/></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="carType" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2"><Car size={16}/>Type of Car</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a car type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {(['City Car', 'Family Car', 'Sports Car', 'SUV'] as CarType[]).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fuelType" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2"><Fuel size={16}/>Fuel Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a fuel type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {(['Petrol', 'Diesel', 'Hybrid', 'Full Electric'] as FuelType[]).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optional Extras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="unlimitedMileage" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel className="flex items-center gap-2"><Gauge size={16}/>Unlimited Mileage</FormLabel><FormDescription>+£10 per day</FormDescription></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="breakdownCover" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel className="flex items-center gap-2"><ShieldCheck size={16}/>Breakdown Cover</FormLabel><FormDescription>+£2 per day</FormDescription></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Wallet size={20}/> Price Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceBreakdown priceDetails={priceDetails} />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                    Review & Confirm Booking
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => form.reset()}>
                    Reset Form
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
