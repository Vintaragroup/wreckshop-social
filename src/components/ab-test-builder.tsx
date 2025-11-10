import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Beaker,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Copy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { apiUrl } from '../lib/api'
import { toast } from 'sonner'

interface Variant {
  id: string
  name: string
  subject?: string
  bodyHtml?: string
  sendTime?: string
}

interface CreateABTestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId: string
  onCreated?: (test: any) => void
}

export function CreateABTestModal({
  open,
  onOpenChange,
  campaignId,
  onCreated,
}: CreateABTestModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [testName, setTestName] = useState('')
  const [testType, setTestType] = useState<'subject' | 'time' | 'content' | 'comprehensive'>('subject')
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Variant A' },
    { id: '2', name: 'Variant B' },
  ])
  const [confidenceLevel, setConfidenceLevel] = useState(95)
  const [testDuration, setTestDuration] = useState('days')
  const [durationValue, setDurationValue] = useState(7)
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('')
  const [totalAudience, setTotalAudience] = useState(1000)
  const [isCreating, setIsCreating] = useState(false)

  const STEPS = [
    { id: 1, name: 'Test Type' },
    { id: 2, name: 'Variants' },
    { id: 3, name: 'Settings' },
    { id: 4, name: 'Audience' },
    { id: 5, name: 'Review' },
  ]

  const handleAddVariant = () => {
    if (variants.length < 4) {
      const newVariant: Variant = {
        id: String(variants.length + 1),
        name: `Variant ${String.fromCharCode(65 + variants.length)}`,
      }
      setVariants([...variants, newVariant])
    }
  }

  const handleRemoveVariant = (id: string) => {
    if (variants.length > 2) {
      setVariants(variants.filter(v => v.id !== id))
    }
  }

  const handleUpdateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const handleCreateTest = async () => {
    try {
      setIsCreating(true)

      const payload = {
        campaignId,
        name: testName,
        testType,
        variants: variants.map(v => ({
          name: v.name,
          subject: v.subject,
          bodyHtml: v.bodyHtml,
          sendTime: v.sendTime,
        })),
        settings: {
          confidenceLevel,
          testDuration,
          durationValue,
        },
        segmentId: selectedSegmentId,
        totalAudience,
      }

      const res = await fetch(apiUrl('/ab-tests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create A/B test')
      const json = await res.json()

      toast.success('A/B test created successfully!')
      onCreated?.(json.data)
      handleClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setTestName('')
    setTestType('subject')
    setVariants([
      { id: '1', name: 'Variant A' },
      { id: '2', name: 'Variant B' },
    ])
    setConfidenceLevel(95)
    setTestDuration('days')
    setDurationValue(7)
    setSelectedSegmentId('')
    setTotalAudience(1000)
    onOpenChange(false)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return Boolean(testType)
      case 2:
        return testName && variants.length >= 2
      case 3:
        return true
      case 4:
        return selectedSegmentId && totalAudience > 0
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Beaker className="w-5 h-5" />
            Create A/B Test
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Test Type */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  type: 'subject',
                  title: 'Subject Line Testing',
                  description: 'Test different subject lines with same body',
                },
                {
                  type: 'time',
                  title: 'Send Time Testing',
                  description: 'Test optimal send times with same content',
                },
                {
                  type: 'content',
                  title: 'Content Testing',
                  description: 'Test different email bodies and CTAs',
                },
                {
                  type: 'comprehensive',
                  title: 'Comprehensive Testing',
                  description: 'Test combinations of all variables',
                },
              ].map(option => (
                <Card
                  key={option.type}
                  className={`cursor-pointer transition-all ${
                    testType === option.type ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setTestType(option.type as any)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{option.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      </div>
                      {testType === option.type && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Variants */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                placeholder="e.g., Subject Line V1 vs V2"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Variants ({variants.length}/4)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariant}
                  disabled={variants.length >= 4}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </Button>
              </div>

              {variants.map((variant, idx) => (
                <Card key={variant.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Variant name"
                          value={variant.name}
                          onChange={(e) => handleUpdateVariant(variant.id, 'name', e.target.value)}
                        />
                        {variants.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variant.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {testType === 'subject' || testType === 'comprehensive' && (
                        <Input
                          placeholder="Subject line"
                          value={variant.subject || ''}
                          onChange={(e) => handleUpdateVariant(variant.id, 'subject', e.target.value)}
                        />
                      )}

                      {testType === 'content' || testType === 'comprehensive' && (
                        <Textarea
                          placeholder="Email body (HTML)"
                          value={variant.bodyHtml || ''}
                          onChange={(e) => handleUpdateVariant(variant.id, 'bodyHtml', e.target.value)}
                          className="h-20"
                        />
                      )}

                      {testType === 'time' || testType === 'comprehensive' && (
                        <Input
                          type="datetime-local"
                          value={variant.sendTime || ''}
                          onChange={(e) => handleUpdateVariant(variant.id, 'sendTime', e.target.value)}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Confidence Level</Label>
              <Select value={String(confidenceLevel)} onValueChange={(v) => setConfidenceLevel(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90% (Faster results)</SelectItem>
                  <SelectItem value="95">95% (Standard)</SelectItem>
                  <SelectItem value="99">99% (Most rigorous)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How confident you want to be in the results
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test Duration</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={durationValue}
                    onChange={(e) => setDurationValue(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Select value={testDuration} onValueChange={setTestDuration}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Min Sample Size</Label>
                <Input type="number" value="100" disabled />
                <p className="text-xs text-muted-foreground">Automatic</p>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Higher confidence levels require more samples and longer tests,
                  but give more reliable results.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Audience */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Segment</Label>
              <Select value={selectedSegmentId} onValueChange={setSelectedSegmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a segment..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subscribers">All Subscribers</SelectItem>
                  <SelectItem value="high-engagement">High Engagement</SelectItem>
                  <SelectItem value="new-subscribers">New Subscribers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Total Test Size</Label>
              <Input
                type="number"
                min="100"
                value={totalAudience}
                onChange={(e) => setTotalAudience(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                This audience will be split equally among {variants.length} variants
              </p>
            </div>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-900" />
                  <span className="text-sm font-medium text-amber-900">Variant Distribution</span>
                </div>
                {variants.map(v => (
                  <div key={v.id} className="flex items-center justify-between text-sm">
                    <span className="text-amber-900">{v.name}</span>
                    <Badge variant="secondary">
                      {Math.floor(totalAudience / variants.length).toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Test Name</p>
                    <p className="font-medium mt-1">{testName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Test Type</p>
                    <p className="font-medium mt-1 capitalize">{testType} Testing</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Variants</p>
                    <p className="font-medium mt-1">{variants.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence Level</p>
                    <p className="font-medium mt-1">{confidenceLevel}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium mt-1">
                      {durationValue} {testDuration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Audience</p>
                    <p className="font-medium mt-1">{totalAudience.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {variants.map(v => (
                  <div key={v.id} className="text-sm">
                    <Badge variant="outline" className="mb-1">
                      {v.name}
                    </Badge>
                    <div className="text-xs text-muted-foreground space-y-1 ml-2">
                      {v.subject && <p>Subject: {v.subject}</p>}
                      {v.sendTime && <p>Send Time: {v.sendTime}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="flex justify-between gap-2">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < STEPS.length ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreateTest} disabled={isCreating || !canProceed()}>
                {isCreating ? 'Creating...' : 'Create Test'}
                <Beaker className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
