import React from 'react';
import { GlowCard } from './GlowCard';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';

const GlowCardDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          GlowCard Examples
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Blue Glow Card */}
          <GlowCard glowColor="blue" size="md">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">Blue Glow</h3>
                <p className="text-gray-300 text-sm">This card has a beautiful blue glow effect that follows your cursor.</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </GlowCard>

          {/* Purple Glow Card */}
          <GlowCard glowColor="purple" size="md">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">Purple Glow</h3>
                <p className="text-gray-300 text-sm">Perfect for premium features with an elegant purple glow.</p>
              </div>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </GlowCard>

          {/* Green Glow Card */}
          <GlowCard glowColor="green" size="md">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">Green Glow</h3>
                <p className="text-gray-300 text-sm">Great for success states and positive actions.</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                Success
              </button>
            </div>
          </GlowCard>

          {/* Red Glow Card */}
          <GlowCard glowColor="red" size="md">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">Red Glow</h3>
                <p className="text-gray-300 text-sm">Use for warnings, errors, or important alerts.</p>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                Warning
              </button>
            </div>
          </GlowCard>

          {/* Orange Glow Card */}
          <GlowCard glowColor="orange" size="md">
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">Orange Glow</h3>
                <p className="text-gray-300 text-sm">Perfect for attention-grabbing elements.</p>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                Attention
              </button>
            </div>
          </GlowCard>

          {/* Custom Size Card */}
          <GlowCard 
            glowColor="purple" 
            customSize={true}
            width="100%"
            height="300px"
            className="col-span-full md:col-span-2"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-6 mb-4">
                <h3 className="text-white font-semibold text-xl mb-3">Custom Size Card</h3>
                <p className="text-gray-300 text-base">
                  This card uses custom dimensions and spans multiple columns. 
                  Perfect for featured content or hero sections.
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors">
                  Primary Action
                </button>
                <button className="bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-500/20 px-6 py-3 rounded-lg transition-colors">
                  Secondary
                </button>
              </div>
            </div>
          </GlowCard>

        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use GlowCard</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Props</h3>
              <ul className="text-gray-300 space-y-2">
                <li><code className="bg-gray-800 px-2 py-1 rounded">glowColor</code>: 'blue' | 'purple' | 'green' | 'red' | 'orange'</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">size</code>: 'sm' | 'md' | 'lg'</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">customSize</code>: boolean</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">width</code>: string | number</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">height</code>: string | number</li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">className</code>: string</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Example Usage</h3>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
{`<GlowCard 
  glowColor="purple" 
  size="md"
  className="custom-class"
>
  <div>Your content here</div>
</GlowCard>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlowCardDemo; 