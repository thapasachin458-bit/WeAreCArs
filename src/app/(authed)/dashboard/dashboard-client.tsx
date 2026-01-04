'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUp,
  BookOpenCheck,
  Car,
  Filter,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Booking } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

const earningSummaryData = [
  { name: 'May', last6months: 180000, lastYear: 150000 },
  { name: 'Jun', last6months: 150000, lastYear: 170000 },
  { name: 'Jul', last6months: 220000, lastYear: 190000 },
  { name: 'Aug', last6months: 200000, lastYear: 210000 },
  { name: 'Sep', last6months: 250000, lastYear: 230000 },
  { name: 'Oct', last6months: 210000, lastYear: 240000 },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  return timestamp.toDate().toLocaleDateString('en-GB');
};

export default function DashboardClient() {
  const [date, setDate] = useState<Date | undefined>(new Date('2022-11-20'));
  const firestore = useFirestore();

  const allBookingsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'bookings')) : null),
    [firestore]
  );
  const { data: allBookings, isLoading: isAllBookingsLoading } =
    useCollection<Booking>(allBookingsQuery);

  const recentBookingsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'bookings'), orderBy('createdAt', 'desc'), limit(5))
        : null,
    [firestore]
  );
  const { data: recentBookings, isLoading: isRecentBookingsLoading } =
    useCollection<Booking>(recentBookingsQuery);

  const totalIncome =
    allBookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) ?? 0;
  const totalBookings = allBookings?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAllBookingsLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-3xl font-bold">
                {formatCurrency(totalIncome)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Sum of all historical bookings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <BookOpenCheck size={16}/> Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
             {isAllBookingsLoading ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <div className="text-3xl font-bold">
                {totalBookings}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Total number of bookings made.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Car Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Select>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Car number" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6465">6465</SelectItem>
                  <SelectItem value="5665">5665</SelectItem>
                  <SelectItem value="1755">1755</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="10 AM" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10:00">10 AM</SelectItem>
                  <SelectItem value="11:00">11 AM</SelectItem>
                  <SelectItem value="12:00">12 PM</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Check</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Bookings
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Car Type</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead className="text-right">Booking Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isRecentBookingsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  recentBookings?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.customerFirstName} {item.customerSurname}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.carType}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                      <TableCell className="text-right">
                        {formatDate(item.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Earning Summary
            </CardTitle>
            <CardDescription>Last 6 months (mock data)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={earningSummaryData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                   <Area
                    type="monotone"
                    dataKey="last6months"
                    stroke="hsl(var(--primary))"
                    fill="url(#colorUv)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="lastYear"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-4">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                Last 6 months
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-muted-foreground mr-2"></span>
                Same period last year
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
