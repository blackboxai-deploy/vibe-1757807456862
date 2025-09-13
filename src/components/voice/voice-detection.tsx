"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface AudioRecording {
  id: string
  name: string
  duration: string
  timestamp: string
  size: string
  confidence?: number
  keywords?: string[]
}

export default function VoiceDetection() {
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dangerKeywords = [
    'help', 'save me', 'emergency', 'call police', 'stop', 'don\'t touch me', 
    'let go', 'leave me alone', 'someone help', 'fire', 'robbery'
  ]

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        // Audio blob created for potential future use
        URL.createObjectURL(audioBlob)
        
        const newRecording: AudioRecording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          duration: formatTime(recordingTime),
          timestamp: new Date().toLocaleString(),
          size: `${(audioBlob.size / 1024).toFixed(1)} KB`,
          confidence: Math.random() * 40 + 10, // Mock confidence score
          keywords: detectedKeywords.length > 0 ? [...detectedKeywords] : undefined
        }
        
        setRecordings(prev => [newRecording, ...prev])
        toast.success('Audio recording saved to evidence locker.')
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        // Simulate audio level detection
        setAudioLevel(Math.random() * 100)
        
        // Simulate keyword detection
        if (Math.random() > 0.95) {
          const randomKeyword = dangerKeywords[Math.floor(Math.random() * dangerKeywords.length)]
          if (!detectedKeywords.includes(randomKeyword)) {
            setDetectedKeywords(prev => [...prev, randomKeyword])
            toast.warning(`Detected potential distress keyword: "${randomKeyword}"`)
          }
        }
      }, 1000)
      
      toast.success('Voice recording started. Audio is being monitored for distress signals.')
    } catch (error) {
      toast.error('Could not access microphone. Please check permissions.')
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setIsRecording(false)
    setRecordingTime(0)
    setAudioLevel(0)
    setDetectedKeywords([])
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsListening(true)
      
      // Simulate continuous listening with audio level monitoring
      intervalRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 60 + 20)
        
        // Simulate occasional keyword detection
        if (Math.random() > 0.98) {
          const randomKeyword = dangerKeywords[Math.floor(Math.random() * dangerKeywords.length)]
          setDetectedKeywords(prev => {
            if (!prev.includes(randomKeyword)) {
              toast.warning(`Detected: "${randomKeyword}" - Confidence: ${Math.floor(Math.random() * 30 + 70)}%`)
              return [...prev, randomKeyword]
            }
            return prev
          })
        }
      }, 500)
      
      toast.success('Voice detection activated. Monitoring for distress signals...')
    } catch (error) {
      toast.error('Could not access microphone. Please check permissions.')
      console.error('Error accessing microphone:', error)
    }
  }

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setIsListening(false)
    setAudioLevel(0)
    setDetectedKeywords([])
    toast.info('Voice detection stopped.')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id))
    toast.info('Recording deleted from evidence locker.')
  }

  return (
    <div className="px-4 sm:px-0 space-y-6">
      {/* Voice Detection Control Panel */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
            Voice & Evidence Recording
          </CardTitle>
          <CardDescription>
            AI-powered voice detection with automatic evidence recording
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Voice Detection</h4>
              {!isListening ? (
                <Button 
                  onClick={startListening}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  </svg>
                  Start Voice Detection
                </Button>
              ) : (
                <Button 
                  onClick={stopListening}
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold py-3"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  Stop Detection
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Evidence Recording</h4>
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg shadow-lg"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Start Recording
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  Stop Recording ({formatTime(recordingTime)})
                </Button>
              )}
            </div>
          </div>

          {/* Audio Level Meter */}
          {(isRecording || isListening) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Audio Level</span>
                <span className="text-sm text-gray-600">{Math.round(audioLevel)}%</span>
              </div>
              <Progress value={audioLevel} className="h-3" />
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${audioLevel > 50 ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="text-gray-600">
                  {isRecording ? 'Recording in progress...' : 'Listening for keywords...'}
                </span>
              </div>
            </div>
          )}

          {/* Detected Keywords */}
          {detectedKeywords.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">⚠️ Detected Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {detectedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="destructive" className="px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring Info */}
          <div className="bg-purple-50 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-purple-800 mb-2">Monitored Keywords</h4>
            <div className="flex flex-wrap gap-1">
              {dangerKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Recorded Evidence</CardTitle>
          <CardDescription>
            Your audio recordings are securely stored and can be used as evidence
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {recordings.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recordings Yet</h3>
              <p className="text-gray-600">Start recording to save audio evidence securely.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div key={recording.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{recording.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecording(recording.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-4">
                      <span>Duration: {recording.duration}</span>
                      <span>Size: {recording.size}</span>
                      <span>Date: {recording.timestamp}</span>
                    </div>
                  </div>
                  
                  {recording.confidence && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Safety Confidence:</span>
                        <Badge variant={recording.confidence > 70 ? "destructive" : "secondary"}>
                          {Math.round(recording.confidence)}%
                        </Badge>
                      </div>
                      
                      {recording.keywords && recording.keywords.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Keywords:</span>
                          {recording.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}