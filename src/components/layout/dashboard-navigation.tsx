"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type TabType = 'dashboard' | 'voice' | 'location' | 'heatmap' | 'evidence' | 'alerts' | 'settings'

interface DashboardNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  className?: string
}

export default function DashboardNavigation({ activeTab, setActiveTab, className }: DashboardNavigationProps) {
  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'voice', label: 'Voice' },
    { id: 'location', label: 'Location' },
    { id: 'heatmap', label: 'Heat Map' },
  ]

  return (
    <div className={cn("px-4 sm:px-0", className)}>
      <Card className="shadow-sm p-2 bg-white/80 backdrop-blur-sm border-0">
        <div className="flex items-center space-x-2">
          {mainTabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-800 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}