/**
 * Ultimate Contest Radar - Skeleton Loading Components
 * Beautiful loading states with animated placeholders
 */

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className,
      )}
      {...props}
    />
  );
}

// Contest Card Skeleton
export function ContestCardSkeleton() {
  return (
    <div className='rounded-lg border border-border bg-card p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-5 w-16' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
      <div className='space-y-2'>
        <div className='flex justify-between text-sm'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-16' />
        </div>
        <Skeleton className='h-2 w-full' />
      </div>
      <div className='flex gap-2'>
        <Skeleton className='h-9 w-24' />
        <Skeleton className='h-9 w-20' />
      </div>
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className='rounded-lg border border-border bg-card p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-8 rounded-lg' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-16' />
        <div className='flex items-center justify-between text-xs'>
          <Skeleton className='h-3 w-28' />
          <Skeleton className='h-3 w-12' />
        </div>
      </div>
    </div>
  );
}

// Dashboard Grid Skeleton
export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='space-y-2'>
        <Skeleton className='h-8 w-80' />
        <Skeleton className='h-5 w-96' />
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Contest List */}
        <div className='lg:col-span-2'>
          <div className='rounded-lg border border-border bg-card p-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton className='h-6 w-48' />
                <Skeleton className='h-4 w-64' />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='flex items-center justify-between p-4 border border-border rounded-lg'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-5 w-16 rounded-full' />
                    </div>
                    <div className='flex items-center gap-4 text-sm'>
                      <Skeleton className='h-3 w-16' />
                      <Skeleton className='h-3 w-20' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-16' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className='rounded-lg border border-border bg-card p-6'>
            <div className='space-y-2 mb-4'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-4 w-44' />
            </div>
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='flex items-start gap-3 p-3 border border-border rounded-lg'>
                  <Skeleton className='h-8 w-8 rounded-lg' />
                  <div className='flex-1 space-y-1'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className='rounded-lg border border-border bg-card p-6'>
        <div className='space-y-2 mb-4'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-4 w-56' />
        </div>
        <div className='space-y-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-12' />
              </div>
              <Skeleton className='h-2 w-full' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Navigation Skeleton
export function NavigationSkeleton() {
  return (
    <div className='flex flex-col space-y-2 p-4'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='flex items-center gap-3 h-12 px-3 rounded-md'>
          <Skeleton className='h-5 w-5 rounded' />
          <Skeleton className='h-4 w-24 flex-1' />
          <Skeleton className='h-5 w-8 rounded-full' />
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='grid gap-4' style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className='h-4 w-full' />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={'grid gap-4'} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className='h-4 w-full' />
          ))}
        </div>
      ))}
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className='flex items-center gap-3 h-12 px-4'>
      <Skeleton className='h-8 w-8 rounded-full' />
      <div className='flex-1 space-y-1'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-3 w-20' />
      </div>
      <Skeleton className='h-4 w-4' />
    </div>
  );
}

export { Skeleton };
