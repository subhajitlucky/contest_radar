/**
 * Ultimate Contest Radar - Animated Components Demo
 * Showcases Framer Motion animations for modern UI interactions
 */

'use client';

import { AnimatePresence,motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0, rotateX: -15 },
  visible: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
    },
  },
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

const progressVariants = {
  hidden: { width: 0 },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 1.2,
      delay: 0.5,
    },
  }),
};

export default function AnimatedDemo() {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isContestStarting, setIsContestStarting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const contests = [
    { id: 'cf-1847', platform: 'Codeforces', rating: 1847, problems: 6, status: 'upcoming' },
    { id: 'lc-1234', platform: 'LeetCode', rating: 2100, problems: 4, status: 'live' },
    { id: 'at-832', platform: 'AtCoder', rating: 832, problems: 5, status: 'upcoming' },
  ];

  const handleContestStart = (contestId: string) => {
    setIsContestStarting(true);
    setTimeout(() => {
      setIsContestStarting(false);
      setShowSuccess(true);
      toast.success(`🎉 Successfully joined ${contestId}!`);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const ContestCard = ({ contest }: { contest: typeof contests[0] }) => (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      whileHover='hover'
      className='h-full'
    >
      <Card className='h-full overflow-hidden'>
        <CardHeader className='relative'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>{contest.platform}</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                <Badge
                  variant={contest.status === 'live' ? 'default' : 'secondary'}
                  className={contest.status === 'live' ? 'animate-pulse' : ''}
                >
                  {contest.status === 'live' ? '🔴 Live' : '⏰ Upcoming'}
                </Badge>
              </motion.div>
            </div>
            <CardDescription>
              Rating: {contest.rating} • {contest.problems} problems
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Animated Progress Bar */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Participation Rate</span>
              <span className='font-medium'>
                {contest.status === 'live' ? '89%' : '45%'}
              </span>
            </div>
            <div className='relative h-2 bg-muted rounded-full overflow-hidden'>
              <motion.div
                variants={progressVariants}
                custom={contest.status === 'live' ? 89 : 45}
                initial='hidden'
                animate='visible'
                className='h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'
              />
            </div>
          </div>

          {/* Action Button */}
          <motion.div
            variants={buttonVariants}
            initial='hidden'
            animate='visible'
            whileTap='tap'
          >
            <Button
              className='w-full'
              onClick={() => handleContestStart(contest.id)}
              disabled={isContestStarting}
            >
              <motion.span
                animate={{
                  scale: isContestStarting ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: isContestStarting ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {isContestStarting ? 'Joining...' : 'Join Contest'}
              </motion.span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Animated Header */}
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='text-center space-y-4'
      >
        <motion.h1
          variants={itemVariants}
          className='text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
        >
          🎭 Ultimate Contest Radar
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className='text-lg text-muted-foreground'
        >
          Beautiful animations powered by Framer Motion
        </motion.p>
      </motion.div>

      {/* Animated Contest Grid */}
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        {contests.map((contest, index) => (
          <motion.div
            key={contest.id}
            variants={itemVariants}
            custom={index}
          >
            <ContestCard contest={contest} />
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Form Section */}
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <Card>
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle>🎮 Interactive Demo</CardTitle>
              <CardDescription>Experience smooth animations and interactions</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Platform Selector */}
            <motion.div variants={itemVariants} className='space-y-2'>
              <label htmlFor='platform-select' className='text-sm font-medium'>
                Select Platform
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger id='platform-select'>
                    <SelectValue placeholder='Choose your platform' />
                  </SelectTrigger>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SelectContent>
                      <SelectItem value='codeforces'>Codeforces</SelectItem>
                      <SelectItem value='leetcode'>LeetCode</SelectItem>
                      <SelectItem value='atcoder'>AtCoder</SelectItem>
                      <SelectItem value='codechef'>CodeChef</SelectItem>
                    </SelectContent>
                  </motion.div>
                </Select>
              </motion.div>
            </motion.div>

            {/* Username Input */}
            <motion.div variants={itemVariants} className='space-y-2'>
              <label htmlFor='username-input' className='text-sm font-medium'>
                Username
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input id='username-input' placeholder='Enter your handle' />
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={containerVariants}
              className='flex gap-3'
            >
              <motion.div variants={itemVariants}>
                <Button
                  onClick={() => {
                    toast.success('✨ Smooth animation triggered!');
                  }}
                  className='flex-1'
                >
                  🎨 Animate
                </Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button variant='outline' className='flex-1'>
                  🔄 Reset
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className='fixed bottom-6 right-6 z-50'
          >
            <Card className='bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl'>
              <CardContent className='p-4'>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className='flex items-center gap-3'
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    🎉
                  </motion.div>
                  <div>
                    <p className='font-semibold'>Success!</p>
                    <p className='text-sm opacity-90'>Contest joined successfully</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isContestStarting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='bg-white dark:bg-gray-800 rounded-lg p-8 text-center'
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'
              />
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-lg font-semibold mb-2'
              >
                Joining Contest...
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='text-muted-foreground'
              >
                Please wait while we connect you
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
