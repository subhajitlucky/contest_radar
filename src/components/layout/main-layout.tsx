/**
 * Ultimate Contest Radar - Main Layout Component
 * Responsive layout system with navigation, sidebar, and content areas
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Settings, 
  User, 
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Navigation items
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    badge: null,
  },
  {
    title: 'Contests',
    href: '/contests',
    icon: Calendar,
    badge: '12',
  },
  {
    title: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    badge: null,
  },
  {
    title: 'Problems',
    href: '/problems',
    icon: BookOpen,
    badge: '2000+',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: Settings,
    badge: null,
  },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden'
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='fixed left-0 top-0 z-50 h-full w-72 bg-card border-r border-border shadow-lg lg:static lg:translate-x-0'
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center justify-between px-6 border-b border-border'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='flex items-center gap-3'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm'>
                UCR
              </div>
              <div className='font-display font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Contest Radar
              </div>
            </motion.div>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleSidebar}
              className='lg:hidden'
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-2 px-4 py-6'>
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className='relative'
              >
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-3 h-12 text-left font-medium hover:bg-accent'
                >
                  <item.icon className='h-5 w-5' />
                  <span className='flex-1'>{item.title}</span>
                  {item.badge && (
                    <Badge variant='secondary' className='ml-auto text-xs'>
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* User Profile */}
          <div className='border-t border-border p-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='w-full justify-start gap-3 h-12'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src='/avatar.png' alt='User Avatar' />
                    <AvatarFallback>UCR</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 text-left'>
                    <p className='text-sm font-medium'>Contest Master</p>
                    <p className='text-xs text-muted-foreground'>Premium User</p>
                  </div>
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className='lg:ml-72'>
        {/* Header */}
        <header className='sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'>
          <div className='flex h-16 items-center justify-between px-4 lg:px-6'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleSidebar}
                className='lg:hidden'
              >
                <Menu className='h-5 w-5' />
              </Button>

              {/* Search */}
              <div className='relative w-64 max-w-sm'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='Search contests, problems...'
                  className='pl-10 pr-4'
                />
              </div>
            </div>

            <div className='flex items-center gap-4'>
              {/* Notifications */}
              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-5 w-5' />
                <Badge className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'>
                  3
                </Badge>
              </Button>

              {/* Theme Toggle */}
              <Button variant='ghost' size='icon' onClick={toggleDarkMode}>
                {darkMode ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='p-4 lg:p-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='space-y-6'
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
