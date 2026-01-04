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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  Car,
  Filter,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

const incomeData = {
  amount: 9460.0,
  change: 1.5,
  changeType: 'increase',
  comparisonYesterday: '9940',
  comparisonLastWeek: '25658.00',
};

const expensesData = {
  amount: 5660.0,
  change: 2.5,
  changeType: 'increase',
  comparisonYesterday: '5240',
  comparisonLastWeek: '25658.00',
};

const liveCarStatus = [
  {
    id: '01',
    carNo: '6465',
    driver: 'Alex Noman',
    avatar: 'https://i.pravatar.cc/150?u=alexnoman',
    status: 'Completed',
    earning: 35.44,
  },
  {
    id: '02',
    carNo: '5665',
    driver: 'Razib Rahman',
    avatar: 'https://i.pravatar.cc/150?u=razibrahman',
    status: 'Pending',
    earning: 0.0,
  },
  {
    id: '03',
    carNo: '1755',
    driver: 'Luke Norton',
    avatar: 'https://i.pravatar.cc/150?u=lukenorton',
    status: 'In route',
    earning: 23.5,
  },
];

const earningSummaryData = [
  { name: 'May', last6months: 180000, lastYear: 150000 },
  { name: 'Jun', last6months: 150000, lastYear: 170000 },
  { name: 'Jul', last6months: 220000, lastYear: 190000 },
  { name: 'Aug', last6months: 200000, lastYear: 210000 },
  { name: 'Sep', last6months: 250000, lastYear: 230000 },
  { name: 'Oct', last6months: 210000, lastYear: 240000 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-200"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          {status}
        </Badge>
      );
    case 'Pending':
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 border-blue-200"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
          {status}
        </Badge>
      );
    case 'In route':
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-700 border-red-200"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
          {status}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);

export default function DashboardClient() {
  const [date, setDate] = useState<Date | undefined>(new Date('2022-11-20'));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Statistics Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {formatCurrency(incomeData.amount)}
              </span>
              <span className="flex items-center text-sm text-red-500">
                <ArrowDown className="h-4 w-4 mr-1" /> {incomeData.change}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Compared to {formatCurrency(parseFloat(incomeData.comparisonYesterday))} yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {formatCurrency(expensesData.amount)}
              </span>
              <span className="flex items-center text-sm text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" /> {expensesData.change}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Compared to {formatCurrency(parseFloat(expensesData.comparisonYesterday))} yesterday
            </p>
          </CardContent>
        </Card>

        {/* Car Availability Card */}
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
        {/* Live Car Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Live Car Status
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
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Car no.</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Earning</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveCarStatus.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.carNo}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.avatar} alt={item.driver} />
                        <AvatarFallback>
                          {item.driver.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.driver}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{formatCurrency(item.earning)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Earning Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Earning Summary
            </CardTitle>
            <CardDescription>Mar 2022 - Oct 2022</CardDescription>
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
