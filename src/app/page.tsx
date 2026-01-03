import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <Logo className="h-12 mb-6" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl font-headline">
          Welcome to WeAreCars
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          The official rental management system for staff. Access booking tools,
          manage rentals, and view fleet analytics all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/login">Continue to Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
