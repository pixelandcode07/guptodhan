'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

interface TabsLayoutProps {
  defaultValue: string;
  items: TabItem[];
}

export default function TabsLayout({ defaultValue, items }: TabsLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Ensure the first tab is active when items change (like on route change)
  useEffect(() => {
    if (items.length > 0) setActiveTab(items[0].value);
  }, [items]);

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex w-full bg-white">
        <div className="grid w-full grid-cols-1 md:grid-cols-6 gap-4">
          {/* Sidebar */}
          <div className="col-span-1 md:col-span-2 bg-white">
            <TabsList className="flex flex-col justify-start bg-white h-screen gap-2 p-0 w-full">
              {items.map(tab => (
                <div key={tab.value} className="w-full">
                  <TabsTrigger
                    value={tab.value}
                    className="w-full flex-1 bg-white border border-gray-300 px-3 py-3 text-sm font-medium
                      hover:bg-gray-100 hover:border-gray-400
                      data-[state=active]:bg-blue-600 data-[state=active]:text-white
                      transition-colors cursor-pointer rounded-none flex-shrink-0">
                    {tab.label}
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
          </div>

          {/* Content */}
          <div className="col-span-1 h-full md:col-span-4">
            {items.map(tab => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="border border-gray-200 bg-white p-4 shadow-sm rounded-none w-full">
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
