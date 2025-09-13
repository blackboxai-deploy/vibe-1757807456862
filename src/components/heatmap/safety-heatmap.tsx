"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HotspotData {
  id: string
  lat: number
  lng: number
  intensity: number
  incidents: number
  area: string
  incidentTypes: string[]
  lastIncident: string
  description?: string
}



export default function SafetyHeatmap() {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock heatmap data - in real app this would come from API
  const heatmapData: HotspotData[] = [
    {
      id: "1",
      lat: 40.7128,
      lng: -74.0060,
      intensity: 0.9,
      incidents: 15,
      area: "Downtown Manhattan",
      incidentTypes: ["Harassment", "Theft", "Assault"],
      lastIncident: "2024-01-15 18:30",
      description: "High-traffic area with frequent reports of harassment during evening hours"
    },
    {
      id: "2",
      lat: 40.7589,
      lng: -73.9851,
      intensity: 0.7,
      incidents: 8,
      area: "Times Square",
      incidentTypes: ["Harassment", "Pickpocketing"],
      lastIncident: "2024-01-14 20:15",
      description: "Tourist area with occasional incidents, mostly petty crime"
    },
    {
      id: "3",
      lat: 40.7505,
      lng: -73.9934,
      intensity: 0.8,
      incidents: 12,
      area: "Hell's Kitchen",
      incidentTypes: ["Assault", "Robbery", "Stalking"],
      lastIncident: "2024-01-13 22:45",
      description: "Residential area with reports of stalking and late-night incidents"
    },
    {
      id: "4",
      lat: 40.7282,
      lng: -73.9942,
      intensity: 0.6,
      incidents: 6,
      area: "Greenwich Village",
      incidentTypes: ["Harassment", "Verbal Abuse"],
      lastIncident: "2024-01-12 19:20",
      description: "Generally safe area with occasional harassment reports"
    },
    {
      id: "5",
      lat: 40.7614,
      lng: -73.9776,
      intensity: 0.5,
      incidents: 4,
      area: "Upper East Side",
      incidentTypes: ["Harassment"],
      lastIncident: "2024-01-10 16:30",
      description: "Upscale area with minimal incidents, mostly verbal harassment"
    }
  ]

  const drawHeatmap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'

    const width = rect.width
    const height = rect.height

    // Clear canvas
    ctx.fillStyle = '#1f2937' // gray-800
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = '#374151' // gray-700
    ctx.lineWidth = 1
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw hotspots
    heatmapData.forEach((spot) => {
      const x = ((spot.lng + 74.2) / 0.4) * width
      const y = ((40.9 - spot.lat) / 0.3) * height
      const radius = 30 * spot.intensity

      // Create gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      const color = spot.intensity >= 0.8 ? '#ef4444' : spot.intensity >= 0.6 ? '#f97316' : '#f59e0b'
      gradient.addColorStop(0, color + '80')
      gradient.addColorStop(0.5, color + '40')
      gradient.addColorStop(1, color + '00')

      // Draw hotspot
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()

      // Draw center dot
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert click coordinates to map coordinates and find closest hotspot
    heatmapData.forEach((spot) => {
      const spotX = ((spot.lng + 74.2) / 0.4) * rect.width
      const spotY = ((40.9 - spot.lat) / 0.3) * rect.height
      const distance = Math.sqrt((x - spotX) ** 2 + (y - spotY) ** 2)

      if (distance <= 30 * spot.intensity) {
        setSelectedHotspot(spot)
      }
    })
  }

  useEffect(() => {
    const handleResize = () => {
      setTimeout(drawHeatmap, 100)
    }

    window.addEventListener('resize', handleResize)
    drawHeatmap()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 0.8) return { label: 'Critical', color: 'bg-red-600 text-white' }
    if (intensity >= 0.6) return { label: 'High', color: 'bg-orange-500 text-white' }
    if (intensity >= 0.4) return { label: 'Medium', color: 'bg-yellow-500 text-white' }
    return { label: 'Low', color: 'bg-green-500 text-white' }
  }

  const getIncidentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Assault': 'bg-red-100 text-red-800',
      'Robbery': 'bg-red-100 text-red-800',
      'Harassment': 'bg-orange-100 text-orange-800',
      'Stalking': 'bg-purple-100 text-purple-800',
      'Theft': 'bg-yellow-100 text-yellow-800',
      'Pickpocketing': 'bg-yellow-100 text-yellow-800',
      'Verbal Abuse': 'bg-blue-100 text-blue-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="px-4 sm:px-0">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Safety Incident Heatmap</CardTitle>
          <CardDescription>
            Real-time visualization of safety incidents. Red hotspots indicate higher risk zones. Click a hotspot for details.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Heatmap Canvas */}
            <div className="md:col-span-2 space-y-4">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-96 bg-gray-800 rounded-lg cursor-pointer shadow-inner"
                style={{ aspectRatio: '3/2' }}
              />
              
              {/* Legend */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span>Critical (0.8+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>High (0.6-0.8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <span>Medium (0.4-0.6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Low (&lt;0.4)</span>
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Area Statistics</h3>
              
              {!selectedHotspot ? (
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 11a3 3 0 1 1 6 0c0 1.657-1 3-3 3s-3-1.343-3-3z"/>
                    <path d="M18 21h-6"/>
                    <path d="M6 21h6"/>
                    <path d="M3 9l9 9 9-9"/>
                  </svg>
                  <p className="text-sm">Click on a hotspot to view area details.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{selectedHotspot.area}</h4>
                      <Badge className={getIntensityLabel(selectedHotspot.intensity).color}>
                        {getIntensityLabel(selectedHotspot.intensity).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{selectedHotspot.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Total Incidents:</span>
                      <p className="text-2xl font-bold text-red-600">{selectedHotspot.incidents}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Risk Level:</span>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(selectedHotspot.intensity * 100)}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 block mb-2">Incident Types:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedHotspot.incidentTypes.map((type, index) => (
                        <Badge key={index} className={`text-xs ${getIncidentTypeColor(type)}`}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Last Incident:</span>
                    <p className="text-sm text-gray-600">{selectedHotspot.lastIncident}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Coordinates:</span>
                    <p className="text-xs font-mono text-gray-600">
                      {selectedHotspot.lat.toFixed(4)}, {selectedHotspot.lng.toFixed(4)}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedHotspot(null)}
                    className="w-full mt-4"
                  >
                    Close Details
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-bold text-lg mb-4">Overall Safety Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-red-600">{heatmapData.reduce((sum, spot) => sum + spot.incidents, 0)}</p>
                <p className="text-sm text-gray-600">Total Incidents</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-orange-600">{heatmapData.filter(spot => spot.intensity >= 0.8).length}</p>
                <p className="text-sm text-gray-600">Critical Zones</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">{heatmapData.filter(spot => spot.intensity >= 0.6 && spot.intensity < 0.8).length}</p>
                <p className="text-sm text-gray-600">High Risk Areas</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-green-600">{heatmapData.filter(spot => spot.intensity < 0.6).length}</p>
                <p className="text-sm text-gray-600">Safe Zones</p>
              </div>
            </div>
          </div>

          {/* Report Incident Button */}
          <div className="mt-6 pt-6 border-t text-center">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
              Report Safety Incident
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Help keep the community safe by reporting incidents anonymously.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}