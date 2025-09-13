"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface EmergencyButtonProps {
  active: boolean
  onActivate: () => void
  onDeactivate: () => void
}

export default function EmergencyButton({ active, onActivate, onDeactivate }: EmergencyButtonProps) {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [showModal, setShowModal] = useState(false)

  const startEmergency = () => {
    setIsCountingDown(true)
    setShowModal(true)
    setCountdown(10)
    onActivate()
    
    toast.warning('Emergency protocol initiated! Cancel within 10 seconds to prevent alert.')
  }

  const cancelEmergency = () => {
    setIsCountingDown(false)
    setShowModal(false)
    setCountdown(10)
    onDeactivate()
    
    toast.info('Emergency protocol cancelled.')
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Emergency activated!
            setIsCountingDown(false)
            setShowModal(false)
            activateEmergencyProtocol()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCountingDown, countdown])

  const activateEmergencyProtocol = () => {
    // Simulate emergency actions
    toast.success('Emergency protocol activated! Location shared with emergency contacts.')
    
    // In a real app, this would:
    // 1. Share current location with emergency contacts
    // 2. Start audio/video recording
    // 3. Send alerts to predefined contacts
    // 4. Activate alarm sound
    // 5. Contact emergency services if configured
  }

  return (
    <>
      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={startEmergency}
          disabled={isCountingDown}
          className={cn(
            "w-20 h-20 rounded-full shadow-2xl font-bold text-white transition-all duration-300 transform hover:scale-110 border-4 border-white",
            active || isCountingDown 
              ? "bg-red-600 animate-pulse" 
              : "bg-red-500 hover:bg-red-600"
          )}
        >
          {isCountingDown ? (
            <span className="text-2xl font-bold">{countdown}</span>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="h-8 w-8 mb-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l9 20-9-6-9 6z"/>
              </svg>
              <span className="text-xs font-bold">SOS</span>
            </div>
          )}
        </Button>
      </div>

      {/* Emergency Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l9 20-9-6-9 6z"/>
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Emergency Activated
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Emergency protocol will activate in {countdown} seconds
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Activating in:</span>
                  <span className="font-bold text-red-600">{countdown}s</span>
                </div>
                <Progress 
                  value={(10 - countdown) * 10} 
                  className="h-3 bg-gray-100"
                />
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Actions to be taken:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Share current location with emergency contacts</li>
                  <li>Start audio/video evidence recording</li>
                  <li>Send alert notifications to guardians</li>
                  <li>Activate loud alarm sound</li>
                </ul>
              </div>
              
              <Button 
                onClick={cancelEmergency}
                variant="outline"
                className="w-full py-3 border-red-200 text-red-600 hover:bg-red-50 font-semibold"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
                Cancel Emergency
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}