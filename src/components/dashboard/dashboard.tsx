"use client"

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import EmergencyButton from '@/components/emergency/emergency-button'
import VoiceDetection from '@/components/voice/voice-detection'
import LocationTracking from '@/components/location/location-tracking'
import SafetyHeatmap from '@/components/heatmap/safety-heatmap'
import AIAssistant from '@/components/chat/ai-assistant'
import DashboardHeader from '@/components/layout/dashboard-header'
import DashboardNavigation from '@/components/layout/dashboard-navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

type TabType = 'dashboard' | 'voice' | 'location' | 'heatmap' | 'evidence' | 'alerts' | 'settings'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [emergencyActive, setEmergencyActive] = useState(false)
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'voice':
        return <VoiceDetection />
      case 'location':
        return <LocationTracking />
      case 'heatmap':
        return <SafetyHeatmap />
      case 'evidence':
        return <EvidenceLocker />
      case 'alerts':
        return <AlertsSettings />
      case 'settings':
        return <SettingsPanel />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <DashboardHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        emergencyActive={emergencyActive}
      />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Mobile Navigation */}
          <DashboardNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="lg:hidden mb-6"
          />
          
          <div className="px-4 sm:px-0 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Safety Dashboard
                </h2>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
          </div>
          
          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>

      {/* Emergency Button - Always Visible */}
      <EmergencyButton 
        active={emergencyActive}
        onActivate={() => setEmergencyActive(true)}
        onDeactivate={() => setEmergencyActive(false)}
      />

      {/* AI Assistant - Always Accessible */}
      <AIAssistant />
    </div>
  )
}

// Dashboard Overview Component
function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-0">
      {/* Left Column */}
      <div className="space-y-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
              </svg>
              Emergency Response System
            </CardTitle>
            <CardDescription>
              Instant emergency activation with smart detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l9 20-9-6-9 6z"/>
              </svg>
              Manual Emergency Activation
            </Button>
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p><strong>Auto-activation:</strong> Triggers when distress confidence &gt; 70%</p>
              <p><strong>Response time:</strong> 10 second countdown for false alarm prevention</p>
              <p><strong>Actions:</strong> Location sharing, alerts, recording, alarm activation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Live Location Tracking
            </CardTitle>
            <CardDescription>
              Real-time GPS tracking with emergency contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Start Location Tracking
            </Button>
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p><strong>Emergency contacts:</strong> Guardians, local police, emergency services</p>
              <p><strong>Sharing method:</strong> SMS, WhatsApp, Push notifications</p>
              <p><strong>Update frequency:</strong> Real-time updates every 30 seconds</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <svg className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              AI Voice Detection System
            </CardTitle>
            <CardDescription>
              Smart voice pattern analysis with keyword detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              Start Voice Detection
            </Button>
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p><strong>Monitored keywords:</strong> help, save me, emergency, don't touch me, stop, call police</p>
              <p><strong>Detection:</strong> Keyword analysis + Audio intensity + Context validation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <svg className="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              Emergency Alert System
            </CardTitle>
            <CardDescription>
              Automated alerts to your emergency contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              Trigger Emergency Alerts
            </Button>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Emergency Contacts</span>
                <Badge variant="secondary">2 contacts</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Mom (Mother)</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">High</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Evidence Locker Component
function EvidenceLocker() {
  return (
    <div className="px-4 sm:px-0">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Evidence Locker</CardTitle>
          <CardDescription>
            Manage your recorded audio, video, and other evidence securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Recorded</h3>
            <p className="text-gray-600">Start voice or video recording to save evidence securely.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Alerts Settings Component
function AlertsSettings() {
  return (
    <div className="px-4 sm:px-0">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">AI Safety Assistant</CardTitle>
          <CardDescription>
            Generate personalized safety guidance and emergency procedures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <span className="mr-2">✨</span>
            Generate Safety Steps
          </Button>
          <Separator className="my-6" />
          <div className="text-center py-8">
            <p className="text-gray-600">Click the button above to generate personalized safety guidance for emergency situations.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Panel Component
function SettingsPanel() {
  return (
    <div className="px-4 sm:px-0">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Settings</CardTitle>
          <CardDescription>
            Configure your safety preferences and application settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-600">Advanced settings and preferences will be available in the next update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}