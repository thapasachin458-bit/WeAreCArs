import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Logo({ className }: { className?: string }) {
  const logoImage = PlaceHolderImages.find((img) => img.id === 'we-are-cars-logo');

  if (!logoImage) {
    return (
      <Link href="/" className={cn('text-2xl font-bold font-headline', className)}>
        WeAreCars
      </Link>
    );
  }

  return (
    <Link href="/">
      <div className={cn('relative', className)}>
        <Image
          src={logoImage.imageUrl}
          alt={logoImage.description}
          data-ai-hint={logoImage.imageHint}
          width={200}
          height={50}
          className="dark:invert"
        />
      </div>
    </Link>
  );
}
