import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('text-2xl font-bold font-headline', className)}>
      WeAreCars
    </Link>
  );
}
