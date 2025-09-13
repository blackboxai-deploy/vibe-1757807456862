"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI Safety Assistant. I can help you with safety tips, emergency procedures, or answer questions about using the app. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response - Replace with actual API call
      const response = await simulateAIResponse(userMessage.content)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI response error:', error)
      toast.error('Sorry, I\'m having trouble responding right now. Please try again.')
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try asking your question again, or contact emergency services directly if this is urgent.',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const input = userInput.toLowerCase()
    
    // Emergency keywords
    if (input.includes('emergency') || input.includes('help') || input.includes('danger')) {
      return `🚨 If you're in immediate danger, please call emergency services (911) right away or use the emergency button in the app.

For non-immediate emergencies, I can guide you through:
• Activating location sharing
• Starting voice recording
• Contacting your emergency contacts
• Finding safe routes

What specific help do you need right now?`
    }

    // Location/safety tips
    if (input.includes('safe') && (input.includes('walk') || input.includes('route') || input.includes('area'))) {
      return `Here are some safety tips for walking:

🛡️ **Before you go:**
• Check the safety heatmap in the app
• Share your location with trusted contacts
• Plan your route avoiding high-risk areas

🚶‍♀️ **While walking:**
• Stay alert and avoid distractions
• Walk confidently and make eye contact
• Trust your instincts - if something feels wrong, it probably is
• Stay in well-lit, populated areas

📱 **Use the app:**
• Enable voice detection for hands-free emergency activation
• Keep location tracking on
• Have emergency contacts readily available

Would you like specific guidance for your area?`
    }

    // App features
    if (input.includes('voice') || input.includes('detection') || input.includes('recording')) {
      return `📢 **Voice Detection Features:**

**How it works:**
• Monitors for distress keywords like "help", "stop", "call police"
• Analyzes voice patterns and audio intensity
• Automatically triggers emergency protocol when confidence > 70%

**To activate:**
1. Go to the Voice Detection tab
2. Click "Start Voice Detection"
3. The system will listen in the background

**Evidence Recording:**
• Manual recording for evidence collection
• Automatic recording during emergencies
• Secure cloud storage with encryption

The system is designed to be sensitive but avoid false alarms. Would you like me to explain any other features?`
    }

    // Location sharing
    if (input.includes('location') || input.includes('share') || input.includes('gps')) {
      return `📍 **Location Sharing & Tracking:**

**Real-time tracking:**
• GPS monitoring with high accuracy
• Automatic updates every 30 seconds during emergencies
• Battery-optimized for extended use

**Emergency sharing:**
• Instantly shares location with all emergency contacts
• Includes Google Maps links for easy navigation
• Works via SMS, WhatsApp, and push notifications

**Privacy controls:**
• You control who sees your location and when
• Location history is encrypted and secure
• Can be turned off anytime (except during emergencies)

**To start tracking:**
Go to Location tab → "Start Tracking"

Need help setting up emergency contacts?`
    }

    // General safety advice
    if (input.includes('safety') || input.includes('tips') || input.includes('advice')) {
      return `🛡️ **Personal Safety Guidelines:**

**Trust your instincts** - If something feels off, it usually is. Don't ignore gut feelings.

**Stay connected:**
• Keep your phone charged
• Share your location with trusted people
• Check in regularly with friends/family

**Be aware:**
• Stay off your phone in unfamiliar areas
• Walk with purpose and confidence
• Avoid wearing headphones late at night

**Prepare for emergencies:**
• Know your emergency contacts by heart
• Practice using the app's features
• Keep important numbers easily accessible

**Use this app:**
• Enable voice detection when alone
• Check the safety heatmap before traveling
• Keep location sharing on for trusted contacts

What specific situation would you like safety advice for?`
    }

    // Default helpful response
    const responses = [
      `I'm here to help with your safety concerns. I can assist with:

🆘 Emergency procedures and protocols
📍 Location sharing and GPS tracking
🎙️ Voice detection and recording features
🗺️ Safety heatmap and risk assessment
⚙️ App settings and configurations
🛡️ Personal safety tips and advice

What would you like to know more about?`,

      `As your safety assistant, I can help you with:

• Understanding app features and how to use them
• Emergency response procedures
• Personal safety tips for different situations
• Setting up and managing emergency contacts
• Interpreting safety data and heatmaps

Feel free to ask me anything about staying safe or using the app!`,

      `I'm designed to help keep you safe. Here are some things I can help with:

🔧 **Technical support:** App features, settings, troubleshooting
🆘 **Emergency guidance:** What to do in dangerous situations
📚 **Safety education:** Tips, best practices, risk awareness
🗺️ **Local insights:** Understanding area safety data

What can I help you with today?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const quickActions = [
    { label: 'Emergency Help', query: 'What should I do in an emergency?' },
    { label: 'Safety Tips', query: 'Give me some personal safety tips' },
    { label: 'Voice Detection', query: 'How does voice detection work?' },
    { label: 'Location Sharing', query: 'How do I share my location?' }
  ]

  const handleQuickAction = (query: string) => {
    setInputValue(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-[600px] shadow-2xl">
          <Card className="border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold">AI Safety Assistant</CardTitle>
                  <CardDescription className="text-purple-100 text-sm">
                    Here to help 24/7
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-purple-100 hover:text-white hover:bg-white/10 p-1 h-8 w-8"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18"/>
                    <path d="M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages Area */}
              <ScrollArea className="h-80 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                            : 'bg-purple-50 text-purple-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 opacity-75 ${
                          message.role === 'user' ? 'text-purple-100' : 'text-purple-600'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-purple-50 text-purple-900 p-3 rounded-lg rounded-bl-none shadow-sm">
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickActions.map((action, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-purple-100 text-xs px-2 py-1"
                        onClick={() => handleQuickAction(action.query)}
                      >
                        {action.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about safety..."
                    className="flex-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-4 border-white ${
            isOpen
              ? 'bg-gray-500 hover:bg-gray-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          {isOpen ? (
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="h-7 w-7 text-white mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              <span className="text-xs font-bold text-white">AI</span>
            </div>
          )}
        </Button>
      </div>
    </>
  )
}