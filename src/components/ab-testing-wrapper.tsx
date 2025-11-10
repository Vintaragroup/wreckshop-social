import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
  Beaker,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { CreateABTestModal } from './ab-test-builder'
import { ABTestsList } from './ab-tests-list'
import { ABTestResults } from './ab-test-results'

interface ABTest {
  _id: string
  name: string
  testType: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: any[]
  winner?: any
  settings?: {
    confidenceLevel?: number
    testDuration?: string
    durationValue?: number
  }
  createdAt: string
  startedAt?: string
  completedAt?: string
}

interface ABTestingWrapperProps {
  campaignId: string
}

export function ABTestingWrapper({ campaignId }: ABTestingWrapperProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            A/B Tests
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!selectedTest} className="flex items-center gap-2">
            {selectedTest && '📊'} Results
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">A/B Testing</h3>
              <p className="text-sm text-muted-foreground">
                Run experiments to optimize your email campaigns
              </p>
            </div>
            <Button onClick={() => setShowBuilder(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Test
            </Button>
          </div>

          <ABTestsList
            onViewResults={(test) => {
              setSelectedTest(test)
              setActiveTab('results')
            }}
          />
        </TabsContent>

        {/* Results Tab */}
        {selectedTest && (
          <TabsContent value="results" className="space-y-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTest(null)
                setActiveTab('overview')
              }}
              className="flex items-center gap-2"
            >
              ← Back to Tests
            </Button>

            <ABTestResults
              testId={selectedTest._id}
              test={selectedTest}
              onStatusChanged={() => setSelectedTest(null)}
              onWinnerDeclared={() => setSelectedTest(null)}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Create Test Modal */}
      <CreateABTestModal
        open={showBuilder}
        onOpenChange={setShowBuilder}
        campaignId={campaignId}
        onCreated={() => {
          setShowBuilder(false)
          setActiveTab('overview')
        }}
      />

      {/* Quick Start Guide */}
      {!selectedTest && activeTab === 'overview' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Getting Started with A/B Testing</CardTitle>
            <CardDescription>Learn how to run effective experiments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Create Your Test</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Choose a test type: subject lines, send times, content, or comprehensive testing
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Configure Variants</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Create 2-4 variants with different versions to test (A/B/C/D)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Set Test Parameters</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Choose confidence level, duration, and audience size for your test
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                4
              </div>
              <div>
                <p className="font-medium">Analyze Results</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Review performance metrics and statistical significance to declare a winner
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
