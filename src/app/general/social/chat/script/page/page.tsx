'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import all form components
import GoogleAnalyticsForm from './Components/GoogleAnalyticsForm';
import GoogleTagManagerForm from './Components/GoogleTagManagerForm';
import FacebookPixelForm from './Components/FacebookPixelForm';
import GoogleSearchConsoleForm from './Components/GoogleSearchConsoleForm';
import MicrosoftClarityForm from './Components/MicrosoftClarityForm';
import GoogleRecaptcha from './Components/GoogleRecaptcha';
import CrispLiveChat from './Components/CrispLiveChat';
import TawkLiveChat from './Components/TawkLiveChat';
import MessegeChatPlugin from './Components/MessegeChatPlugin';
import SocialLoginForm from './Components/SocialLoginForm';

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 Integrations
          </h1>
          <p className="text-gray-600">
            Manage all your third-party integrations, analytics tools, and chat plugins
          </p>
        </div>

        {/* Main Tabs Container */}
        <div className="bg-white rounded-lg shadow-lg">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tabs Navigation */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 rounded-t-lg border-b">
              {/* Analytics Tab */}
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                📊 Analytics
              </TabsTrigger>

              {/* SEO Tab */}
              <TabsTrigger
                value="seo"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                🔍 SEO
              </TabsTrigger>

              {/* Security Tab */}
              <TabsTrigger
                value="security"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                🔐 Security
              </TabsTrigger>

              {/* Chat Tab */}
              <TabsTrigger
                value="chat"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                💬 Chat
              </TabsTrigger>

              {/* Social Login Tab */}
              <TabsTrigger
                value="social"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                👥 Social
              </TabsTrigger>
            </TabsList>

            {/* ============================================
                ANALYTICS TAB
                ============================================ */}
            <TabsContent value="analytics" className="p-6 space-y-8">
              {/* Google Analytics */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📈</span> Google Analytics
                </h2>
                <GoogleAnalyticsForm />
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Google Tag Manager */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🏷️</span> Google Tag Manager
                </h2>
                <GoogleTagManagerForm />
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Facebook Pixel */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📱</span> Facebook Pixel
                </h2>
                <FacebookPixelForm />
              </div>
            </TabsContent>

            {/* ============================================
                SEO TAB
                ============================================ */}
            <TabsContent value="seo" className="p-6 space-y-8">
              {/* Google Search Console */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🔍</span> Google Search Console
                </h2>
                <GoogleSearchConsoleForm />
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Microsoft Clarity */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎯</span> Microsoft Clarity
                </h2>
                <MicrosoftClarityForm />
              </div>
            </TabsContent>

            {/* ============================================
                SECURITY TAB
                ============================================ */}
            <TabsContent value="security" className="p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🔐</span> Google reCAPTCHA
                </h2>
                <GoogleRecaptcha />
              </div>
            </TabsContent>

            {/* ============================================
                CHAT TAB
                ============================================ */}
            <TabsContent value="chat" className="p-6 space-y-8">
              {/* Crisp Chat */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💬</span> Crisp Live Chat
                </h2>
                <CrispLiveChat />
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Tawk Chat */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💬</span> Tawk.to Live Chat
                </h2>
                <TawkLiveChat />
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Messenger Chat */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💬</span> Facebook Messenger Chat
                </h2>
                <MessegeChatPlugin />
              </div>
            </TabsContent>

            {/* ============================================
                SOCIAL LOGIN TAB
                ============================================ */}
            <TabsContent value="social" className="p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👥</span> Social Login Settings
                </h2>
                <SocialLoginForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Update these settings to enable analytics, chat, and security features
            </li>
            <li>
              • Most integrations require you to create an account on the respective platforms
            </li>
            <li>
              • Get your API keys/IDs from each service's dashboard
            </li>
            <li>
              • Test your integrations after updating to ensure they work correctly
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}