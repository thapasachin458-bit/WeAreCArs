import DashboardClient from './dashboard-client';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          An overview of your rental operations and fleet insights.
        </p>
      </div>
      <DashboardClient />
    </div>
  );
}
