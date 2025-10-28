/**
 * Ultimate Contest Radar - UI Components Demo
 * This component showcases all the installed shadcn/ui components
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function UIDemo() {
  const handleToast = () => {
    toast.success('🎉 Ultimate Contest Radar UI Components are working perfectly!');
  };

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Ultimate Contest Radar
        </h1>
        <p className='text-lg text-muted-foreground'>
          Showcasing our modern shadcn/ui component library
        </p>
      </div>

      {/* Platform Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Codeforces</CardTitle>
              <Badge variant='secondary'>Active</Badge>
            </div>
            <CardDescription>Contest tracking and rating analysis</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Current Rating</span>
                <span className='font-medium'>1847</span>
              </div>
              <Progress value={73.88} className='h-2' />
            </div>
            <Button className='w-full' onClick={handleToast}>
              View Contest History
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>LeetCode</CardTitle>
              <Badge variant='outline'>Weekly</Badge>
            </div>
            <CardDescription>Algorithm problems and contests</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Problems Solved</span>
                <span className='font-medium'>156</span>
              </div>
              <Progress value={15.6} className='h-2' />
            </div>
            <Button variant='outline' className='w-full'>
              Start Contest
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>AtCoder</CardTitle>
              <Badge className='bg-orange-500'>ABC</Badge>
            </div>
            <CardDescription>Japanese programming contests</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Rating</span>
                <span className='font-medium'>832</span>
              </div>
              <Progress value={33.28} className='h-2' />
            </div>
            <Button variant='secondary' className='w-full'>
              Join Contest
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components Demo</CardTitle>
          <CardDescription>Test form inputs and user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='contests' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='contests'>Contests</TabsTrigger>
              <TabsTrigger value='problems'>Problems</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value='contests' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='username'>Username</Label>
                  <Input id='username' placeholder='Enter your handle' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='platform'>Platform</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select platform' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='codeforces'>Codeforces</SelectItem>
                      <SelectItem value='leetcode'>LeetCode</SelectItem>
                      <SelectItem value='atcoder'>AtCoder</SelectItem>
                      <SelectItem value='codechef'>CodeChef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button onClick={handleToast}>Add Contest</Button>
                <Button variant='outline'>Preview</Button>
                <Button variant='ghost'>Cancel</Button>
              </div>
            </TabsContent>
            
            <TabsContent value='problems' className='space-y-4'>
              <p className='text-muted-foreground'>
                DSA Problem collections and interactive solving environment coming soon!
              </p>
            </TabsContent>
            
            <TabsContent value='analytics' className='space-y-4'>
              <p className='text-muted-foreground'>
                Cross-platform analytics and performance insights will be available here.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage src='/avatar.png' alt='User Avatar' />
              <AvatarFallback>UCR</AvatarFallback>
            </Avatar>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Competitive Programmer</h3>
              <div className='flex gap-2'>
                <Badge variant='secondary'>Expert</Badge>
                <Badge className='bg-green-500'>Active</Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                Passionate about algorithms and competitive programming
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
