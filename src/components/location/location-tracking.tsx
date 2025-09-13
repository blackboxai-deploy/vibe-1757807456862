"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface LocationHistory {
  id: string
  latitude: number
  longitude: number
  address: string
  timestamp: string
  shared: boolean
  accuracy: number
}

interface LocationState {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
}

export default function LocationTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationState | null>(null)
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([])
  const [watchId, setWatchId] = useState<number | null>(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      return
    }

    toast.info('Getting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const timestamp = new Date().toLocaleString()
        
        setCurrentLocation({ latitude, longitude, accuracy, timestamp })
        
        // Simulate reverse geocoding for address
        const mockAddress = generateMockAddress(latitude, longitude)
        
        const locationEntry: LocationHistory = {
          id: Date.now().toString(),
          latitude,
          longitude,
          address: mockAddress,
          timestamp,
          shared: false,
          accuracy
        }
        
        setLocationHistory(prev => [locationEntry, ...prev.slice(0, 9)]) // Keep last 10
        toast.success('Location updated successfully!')
      },
      (error) => {
        console.error('Location error:', error)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please enable location permissions.')
            break
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable.')
            break
          case error.TIMEOUT:
            toast.error('Location request timed out.')
            break
          default:
            toast.error('An unknown location error occurred.')
            break
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      return
    }

    const watchPosition = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const timestamp = new Date().toLocaleString()
        
        setCurrentLocation({ latitude, longitude, accuracy, timestamp })
        
        // Only add to history if location changed significantly
        if (locationHistory.length === 0 || 
            Math.abs(locationHistory[0].latitude - latitude) > 0.001 ||
            Math.abs(locationHistory[0].longitude - longitude) > 0.001) {
          
          const mockAddress = generateMockAddress(latitude, longitude)
          
          const locationEntry: LocationHistory = {
            id: Date.now().toString(),
            latitude,
            longitude,
            address: mockAddress,
            timestamp,
            shared: false,
            accuracy
          }
          
          setLocationHistory(prev => [locationEntry, ...prev.slice(0, 9)])
        }
      },
      (error) => {
        console.error('Tracking error:', error)
        toast.error('Error tracking location. Please check permissions.')
        setIsTracking(false)
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    )

    setWatchId(watchPosition)
    setIsTracking(true)
    toast.success('Live location tracking started. Location will be updated automatically.')
  }

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
    toast.info('Location tracking stopped.')
  }

  const shareLocation = (locationId?: string) => {
    const locationToShare = locationId 
      ? locationHistory.find(loc => loc.id === locationId) 
      : currentLocation

    if (!locationToShare) {
      toast.error('No location available to share.')
      return
    }

    // Simulate sharing location
    if (locationId) {
      setLocationHistory(prev => 
        prev.map(loc => 
          loc.id === locationId 
            ? { ...loc, shared: true }
            : loc
        )
      )
    }

    // Create shareable location URL
    const coordinates = locationId 
      ? { lat: (locationToShare as LocationHistory).latitude, lng: (locationToShare as LocationHistory).longitude }
      : { lat: (locationToShare as LocationState).latitude, lng: (locationToShare as LocationState).longitude }
    const locationUrl = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    
    // In a real app, this would send SMS/WhatsApp/Email to emergency contacts
    toast.success(`Location shared with emergency contacts: ${locationUrl}`)
  }

  const generateMockAddress = (lat: number, lng: number): string => {
    // Mock address generation based on coordinates
    const streets = ['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Market St', 'Union Ave']
    const areas = ['Downtown', 'Midtown', 'Uptown', 'Westside', 'Eastside', 'Northside']
    
    const streetNum = Math.floor(Math.random() * 9999) + 1
    const street = streets[Math.floor(Math.random() * streets.length)]
    const area = areas[Math.floor(Math.random() * areas.length)]
    
    return `${streetNum} ${street}, ${area}`
  }

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const formatAccuracy = (accuracy: number) => {
    return accuracy < 1000 ? `±${Math.round(accuracy)}m` : `±${(accuracy/1000).toFixed(1)}km`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 10) return 'bg-green-500'
    if (accuracy <= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="px-4 sm:px-0 space-y-6">
      {/* Location Control Panel */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Location History & Sharing
          </CardTitle>
          <CardDescription>
            Real-time GPS tracking with emergency contact sharing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Location Display */}
          {currentLocation && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-800">Current Location</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getAccuracyColor(currentLocation.accuracy)} animate-pulse`}></div>
                  <Badge variant="secondary" className="text-xs">
                    {formatAccuracy(currentLocation.accuracy)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Coordinates:</span>
                  <p className="text-gray-700 font-mono">
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Last Updated:</span>
                  <p className="text-gray-700">{currentLocation.timestamp}</p>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={getCurrentLocation}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Get Location
            </Button>
            
            {!isTracking ? (
              <Button 
                onClick={startTracking}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>
                Start Tracking
              </Button>
            ) : (
              <Button 
                onClick={stopTracking}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
                Stop Tracking
              </Button>
            )}
            
            <Button 
              onClick={() => shareLocation()}
              disabled={!currentLocation}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg disabled:from-gray-300 disabled:to-gray-400"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Share Now
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/>
                <path d="M9 3v15"/>
                <path d="M15 6v15"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Map</h3>
              <p className="text-gray-500">Map integration coming soon</p>
              {currentLocation && (
                <p className="text-sm text-blue-600 mt-2">
                  📍 {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Tracking Status */}
          {isTracking && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">Live tracking active</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your location is being tracked and will be shared automatically in emergencies.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location History */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Location History</CardTitle>
          <CardDescription>
            Recent location updates and sharing history
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {locationHistory.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Location History</h3>
              <p className="text-gray-600">Start tracking to build your location history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {locationHistory.map((location) => (
                <div key={location.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span className="font-medium text-gray-900">{location.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {location.shared && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Shared
                        </Badge>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareLocation(location.id)}
                        disabled={location.shared}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Coordinates:</span>
                      <p className="font-mono">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Accuracy:</span>
                      <p>{formatAccuracy(location.accuracy)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <p>{location.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}