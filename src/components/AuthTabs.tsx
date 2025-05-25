'use client';

import { useState } from 'react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AuthTabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex bg-[--background] p-1 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-[--surface] text-[--primary] shadow-sm'
              : 'text-[--text-secondary] hover:text-[--foreground]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
