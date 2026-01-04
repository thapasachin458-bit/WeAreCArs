import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Car } from 'lucide-react';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 text-2xl font-bold font-headline text-sidebar-foreground', className)}>
      <span className="flex items-center justify-center bg-primary rounded-md p-1">
        <Car className="h-5 w-5 text-primary-foreground" />
      </span>
      <span>CAR RENT</span>
    </Link>
  );
}
