/**
 * Ultimate Contest Radar - Loading States Demo
 * Demonstrates various skeleton loading states and loading patterns
 */

import { AnimatePresence,motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ContestCardSkeleton,
  DashboardSkeleton,
  NavigationSkeleton,
  ProfileSkeleton,
  StatsCardSkeleton,
  TableSkeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoadingDemo() {
  const [loadingState, setLoadingState] = useState<'dashboard' | 'contest' | 'navigation' | 'table' | 'profile'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = () => setIsLoading(!isLoading);

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
          🔄 Loading States Demo
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Beautiful skeleton loading components that enhance user experience during data fetching.
        </p>
        <Button onClick={toggleLoading} className='mt-4'>
          {isLoading ? 'Show Content' : 'Show Loading State'}
        </Button>
      </div>

      <AnimatePresence mode='wait'>
        {isLoading ? (
          <motion.div
            key='loading'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className='space-y-6'>
              <Tabs value={loadingState} onValueChange={(value) => setLoadingState(value as any)}>
                <TabsList className='grid w-full grid-cols-5'>
                  <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
                  <TabsTrigger value='contest'>Contest Cards</TabsTrigger>
                  <TabsTrigger value='navigation'>Navigation</TabsTrigger>
                  <TabsTrigger value='table'>Tables</TabsTrigger>
                  <TabsTrigger value='profile'>Profile</TabsTrigger>
                </TabsList>

                <TabsContent value='dashboard' className='mt-6'>
                  <DashboardSkeleton />
                </TabsContent>

                <TabsContent value='contest' className='mt-6'>
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h2 className='text-2xl font-semibold mb-2'>Contest Cards Loading</h2>
                      <p className='text-muted-foreground'>Preview of contest card skeleton states</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <ContestCardSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='navigation' className='mt-6'>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-1'>
                      <Card>
                        <CardHeader>
                          <CardTitle>Navigation Menu</CardTitle>
                          <CardDescription>
                            Loading state for main navigation
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <NavigationSkeleton />
                        </CardContent>
                      </Card>
                    </div>

                    <div className='lg:col-span-2'>
                      <Card>
                        <CardHeader>
                          <CardTitle>User Profile</CardTitle>
                          <CardDescription>
                            Profile section loading state
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ProfileSkeleton />
                        </CardContent>
                      </Card>
                    </div>

                    <div className='lg:col-span-3'>
                      <Card>
                        <CardHeader>
                          <CardTitle>Dashboard Stats</CardTitle>
                          <CardDescription>
                            Statistics cards loading state
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                            {Array.from({ length: 4 }).map((_, i) => (
                              <StatsCardSkeleton key={i} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='table' className='mt-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Table Loading States</CardTitle>
                      <CardDescription>
                        Various table skeleton patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <h3 className='text-lg font-semibold mb-4'>Contest Leaderboard</h3>
                        <TableSkeleton rows={8} columns={5} />
                      </div>
                      <div className='space-y-4 mt-8'>
                        <h3 className='text-lg font-semibold mb-4'>Recently Solved Problems</h3>
                        <TableSkeleton rows={6} columns={4} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value='profile' className='mt-6'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <Card>
                      <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>
                          Complete profile loading state
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-6'>
                        <div className='flex items-center gap-4'>
                          <div className='h-20 w-20 rounded-full bg-muted animate-pulse' />
                          <div className='space-y-2'>
                            <div className='h-6 w-32 bg-muted animate-pulse rounded' />
                            <div className='h-4 w-24 bg-muted animate-pulse rounded' />
                            <div className='flex gap-2 mt-2'>
                              <div className='h-6 w-16 bg-muted animate-pulse rounded-full' />
                              <div className='h-6 w-20 bg-muted animate-pulse rounded-full' />
                            </div>
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2 text-center'>
                            <div className='h-8 w-12 bg-muted animate-pulse mx-auto' />
                            <div className='h-4 w-16 bg-muted animate-pulse mx-auto' />
                          </div>
                          <div className='space-y-2 text-center'>
                            <div className='h-8 w-12 bg-muted animate-pulse mx-auto' />
                            <div className='h-4 w-20 bg-muted animate-pulse mx-auto' />
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <div className='h-4 w-16 bg-muted animate-pulse' />
                          <div className='h-4 w-full bg-muted animate-pulse' />
                          <div className='h-4 w-3/4 bg-muted animate-pulse' />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>🎯 Contest History</CardTitle>
                        <CardDescription>
                          Recent contest performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-4'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className='flex items-center justify-between p-3 border border-border rounded-lg'>
                              <div className='flex items-center gap-3'>
                                <div className='h-10 w-10 bg-muted animate-pulse rounded-full' />
                                <div className='space-y-1'>
                                  <div className='h-4 w-32 bg-muted animate-pulse' />
                                  <div className='h-3 w-24 bg-muted animate-pulse' />
                                </div>
                              </div>
                              <div className='text-right space-y-1'>
                                <div className='h-4 w-12 bg-muted animate-pulse' />
                                <div className='h-3 w-8 bg-muted animate-pulse' />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key='content'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-8'
          >
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>✨ Content Loaded!</CardTitle>
                <CardDescription>
                  This is what your content looks like when data is fully loaded.
                  Notice the smooth transition from skeleton to actual content.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='p-4 border border-border rounded-lg'>
                    <h3 className='font-semibold'>🏆 Contest Stats</h3>
                    <p className='text-2xl font-bold text-blue-600'>1,847</p>
                    <p className='text-sm text-muted-foreground'>Current Rating</p>
                  </div>
                  <div className='p-4 border border-border rounded-lg'>
                    <h3 className='font-semibold'>📝 Problems Solved</h3>
                    <p className='text-2xl font-bold text-green-600'>2,156</p>
                    <p className='text-sm text-muted-foreground'>Total Problems</p>
                  </div>
                  <div className='p-4 border border-border rounded-lg'>
                    <h3 className='font-semibold'>🎯 Success Rate</h3>
                    <p className='text-2xl font-bold text-purple-600'>73%</p>
                    <p className='text-sm text-muted-foreground'>Accuracy</p>
                  </div>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-lg font-semibold'>📅 Upcoming Contests</h3>
                  <div className='space-y-2 text-left'>
                    <div className='flex justify-between p-3 border border-border rounded-lg'>
                      <span>Codeforces Educational Round 164</span>
                      <span className='text-muted-foreground'>2 hours</span>
                    </div>
                    <div className='flex justify-between p-3 border border-border rounded-lg'>
                      <span>LeetCode Weekly Contest 412</span>
                      <span className='text-muted-foreground'>6 hours</span>
                    </div>
                    <div className='flex justify-between p-3 border border-border rounded-lg'>
                      <span>AtCoder ABC Contest</span>
                      <span className='text-muted-foreground'>1 day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Features */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>🎨 Design</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Matches final content layout</li>
              <li>• Smooth pulse animations</li>
              <li>• Responsive design patterns</li>
              <li>• Consistent with design system</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>⚡ Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Lightweight CSS animations</li>
              <li>• Minimal JavaScript overhead</li>
              <li>• GPU-accelerated transforms</li>
              <li>• Reduced layout shift</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>♿ Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Respects reduced motion preferences</li>
              <li>• Screen reader friendly</li>
              <li>• Clear loading indicators</li>
              <li>• Keyboard navigation support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
