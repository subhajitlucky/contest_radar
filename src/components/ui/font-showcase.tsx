/**
 * Ultimate Contest Radar - Font Showcase
 * Demonstrates the beautiful custom typography system
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FontShowcase() {
  const fontExamples = [
    {
      name: 'Space Grotesk',
      variable: '--font-space-grotesk',
      description: 'Display font for headings and branding',
      sample: 'Ultimate Contest Radar',
      className: 'font-display',
    },
    {
      name: 'Inter',
      variable: '--font-inter',
      description: 'Primary font for body text and UI',
      sample: 'The quick brown fox jumps over the lazy dog. 1234567890',
      className: 'font-sans',
    },
    {
      name: 'Geist Sans',
      variable: '--font-geist-sans',
      description: 'System font for interface elements',
      sample: 'Competitive Programming Made Beautiful',
      className: 'font-sans',
    },
    {
      name: 'JetBrains Mono',
      variable: '--font-jetbrains-mono',
      description: 'Monospace font for code and technical content',
      sample: 'function solve() { return "Hello World!"; }',
      className: 'font-mono',
    },
    {
      name: 'Geist Mono',
      variable: '--font-geist-mono',
      description: 'Alternative monospace for code snippets',
      sample: 'for(let i = 0; i < 10; i++) { console.log(i); }',
      className: 'font-mono',
    },
  ];

  const codeExamples = [
    {
      title: 'JavaScript Contest Solution',
      language: 'JavaScript',
      code: `function maxSubarraySum(arr, k) {
  let maxSum = -Infinity;
  
  for (let i = 0; i <= arr.length - k; i++) {
    let currentSum = 0;
    for (let j = 0; j < k; j++) {
      currentSum += arr[i + j];
    }
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
    },
    {
      title: 'C++ Contest Template',
      language: 'C++',
      code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    
    sort(a.begin(), a.end());
    for (int x : a) {
        cout << x << " ";
    }
    
    return 0;
}`,
    },
  ];

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
          🎨 Ultimate Typography System
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Beautiful, performance-optimized fonts designed specifically for competitive programming and modern web experiences.
        </p>
      </div>

      {/* Font Examples */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {fontExamples.map((font) => (
          <Card key={font.name} className='overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg'>{font.name}</CardTitle>
                <Badge variant='outline' className='font-mono text-xs'>
                  {font.variable}
                </Badge>
              </div>
              <CardDescription>{font.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-xl ${font.className} leading-relaxed`}>
                {font.sample}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <span className='font-display'>💻</span>
            Code Typography Examples
          </CardTitle>
          <CardDescription>
            See how our monospace fonts look in real competitive programming contexts
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {codeExamples.map((example) => (
            <div key={example.title} className='space-y-3'>
              <div className='flex items-center gap-3'>
                <h3 className='font-semibold'>{example.title}</h3>
                <Badge variant='secondary' className='font-mono text-xs'>
                  {example.language}
                </Badge>
              </div>
              <pre className='font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto border'>
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Typography Scale */}
      <Card>
        <CardHeader>
          <CardTitle>📏 Typography Scale</CardTitle>
          <CardDescription>Consistent heading hierarchy across the platform</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <h1 className='text-4xl font-display font-bold'>
              Heading 1 - Ultimate Contest Radar
            </h1>
            <h2 className='text-3xl font-display font-semibold'>
              Heading 2 - Platform Features
            </h2>
            <h3 className='text-2xl font-display font-medium'>
              Heading 3 - Contest Tracking
            </h3>
            <h4 className='text-xl font-display font-medium'>
              Heading 4 - Codeforces Integration
            </h4>
            <h5 className='text-lg font-sans font-medium'>
              Heading 5 - LeetCode Problems
            </h5>
            <h6 className='text-base font-sans font-medium'>
              Heading 6 - AtCoder Contests
            </h6>
            <p className='text-base font-sans'>
              Body text - This is the standard body text that users will read throughout the platform. It&apos;s optimized for readability and accessibility.
            </p>
            <p className='text-sm font-sans text-muted-foreground'>
              Small text - Secondary information and captions use smaller text for better visual hierarchy.
            </p>
            <code className='font-mono text-sm bg-muted px-2 py-1 rounded'>
              Inline code - Algorithm: O(n log n)
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Font Features */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>🚀 Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Next.js font optimization</li>
              <li>• Variable font support</li>
              <li>• Automatic font loading</li>
              <li>• Minimal layout shift</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>🎨 Design</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Tailored for CP content</li>
              <li>• Multiple weight support</li>
              <li>• Modern typography system</li>
              <li>• Consistent visual hierarchy</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>♿ Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• High contrast ratios</li>
              <li>• Readable at all sizes</li>
              <li>• Screen reader friendly</li>
              <li>• Reduced motion support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
