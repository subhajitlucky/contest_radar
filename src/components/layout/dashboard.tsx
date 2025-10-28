/**
 * Ultimate Contest Radar - Dashboard Component
 * Responsive dashboard with contest cards, statistics, and real-time updates
 */

import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  Calendar,
  Clock,
  Code,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const stats = [
    {
      title: 'Active Contests',
      value: '12',
      description: '3 starting soon',
      icon: Calendar,
      trend: '+2.5%',
      color: 'blue',
    },
    {
      title: 'Current Rating',
      value: '1847',
      description: '+15 this week',
      icon: Trophy,
      trend: '+0.8%',
      color: 'green',
    },
    {
      title: 'Problems Solved',
      value: '2,156',
      description: '+23 this week',
      icon: Code,
      trend: '+1.1%',
      color: 'purple',
    },
    {
      title: 'Rank',
      value: '#127',
      description: 'Top 5% globally',
      icon: Award,
      trend: '+3 positions',
      color: 'orange',
    },
  ];

  const upcomingContests = [
    {
      platform: 'Codeforces',
      name: 'Educational Round 164',
      startTime: '2 hours',
      participants: '12.5K',
      rating: '1500-2000',
      status: 'upcoming',
    },
    {
      platform: 'LeetCode',
      name: 'Weekly Contest 412',
      startTime: '6 hours',
      participants: '8.2K',
      rating: 'All levels',
      status: 'upcoming',
    },
    {
      platform: 'AtCoder',
      name: 'ABC Contest',
      startTime: '1 day',
      participants: '5.1K',
      rating: 'Beginner',
      status: 'upcoming',
    },
  ];

  const recentActivity = [
    {
      type: 'contest',
      description: 'Completed Codeforces Round #1847',
      score: '+42 rating',
      time: '2 hours ago',
      icon: Trophy,
      color: 'green',
    },
    {
      type: 'problem',
      description: 'Solved "Maximum Subarray Sum"',
      difficulty: 'Medium',
      time: '4 hours ago',
      icon: Target,
      color: 'blue',
    },
    {
      type: 'achievement',
      description: 'Unlocked "Consistent Solver" badge',
      reward: '7-day streak',
      time: '1 day ago',
      icon: Zap,
      color: 'purple',
    },
  ];

  const getStatusColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-display font-bold'>
          Welcome back, Contest Master! 🎯
        </h1>
        <p className='text-muted-foreground'>
          Here&apos;s what&apos;s happening in the competitive programming world today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card className='overflow-hidden'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getStatusColor(stat.color)}`}>
                    <stat.icon className='h-4 w-4 text-white' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-1'>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{stat.description}</span>
                    <Badge variant='secondary' className='text-xs'>
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Upcoming Contests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className='lg:col-span-2'
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Upcoming Contests
              </CardTitle>
              <CardDescription>
                Don&apos;t miss these exciting contests happening soon
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {upcomingContests.map((contest, index) => (
                <motion.div
                  key={contest.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className='flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>{contest.name}</h3>
                      <Badge variant='outline' className='text-xs'>
                        {contest.platform}
                      </Badge>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {contest.startTime}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Users className='h-3 w-3' />
                        {contest.participants}
                      </span>
                      <span className='flex items-center gap-1'>
                        <TrendingUp className='h-3 w-3' />
                        {contest.rating}
                      </span>
                    </div>
                  </div>
                  <Button size='sm'>Join</Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5' />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest competitive programming activities
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className='flex items-start gap-3 p-3 rounded-lg border border-border'
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getStatusColor(activity.color)}`}>
                    <activity.icon className='h-4 w-4 text-white' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium'>{activity.description}</p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>{activity.time}</span>
                      {activity.score && (
                        <Badge variant='secondary' className='text-xs'>
                          {activity.score}
                        </Badge>
                      )}
                      {activity.difficulty && (
                        <Badge variant='outline' className='text-xs'>
                          {activity.difficulty}
                        </Badge>
                      )}
                      {activity.reward && (
                        <Badge variant='outline' className='text-xs'>
                          {activity.reward}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Track your progress across different platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {[
                { platform: 'Codeforces', rating: 1847, progress: 73.88, change: '+15' },
                { platform: 'LeetCode', rating: 2100, progress: 84.0, change: '+23' },
                { platform: 'AtCoder', rating: 832, progress: 33.28, change: '+8' },
              ].map((platform) => (
                <div key={platform.platform} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>{platform.platform}</span>
                      <Badge variant='outline'>{platform.rating}</Badge>
                    </div>
                    <span className='text-green-600 font-medium'>{platform.change}</span>
                  </div>
                  <Progress value={platform.progress} className='h-2' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
