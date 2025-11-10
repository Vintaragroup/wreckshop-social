import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, Shield, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { toast } from 'sonner'
import { apiUrl } from '../lib/api'

interface ComplianceIssue {
  type: 'error' | 'warning' | 'info'
  message: string
}

interface ComplianceData {
  canSpamCompliant: boolean
  gdprReady: boolean
  spamScore: number
  issues: ComplianceIssue[]
  summary: string
}

interface ComplianceCheckProps {
  campaignId: string
}

export function ComplianceCheck({ campaignId }: ComplianceCheckProps) {
  const [compliance, setCompliance] = useState<ComplianceData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompliance()
  }, [campaignId])

  const loadCompliance = async () => {
    try {
      setLoading(true)
      const res = await fetch(apiUrl(`/campaigns/${campaignId}/compliance`), {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to load compliance')
      const json = await res.json()
      setCompliance(json.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Checking compliance...
        </CardContent>
      </Card>
    )
  }

  if (!compliance) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Unable to load compliance check
        </CardContent>
      </Card>
    )
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getComplianceBadge = (compliant: boolean, label: string) => {
    return (
      <div className="flex items-center gap-2">
        {compliant ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">{label} Compliant</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{label} Issues</span>
          </>
        )}
      </div>
    )
  }

  const errorCount = compliance.issues.filter(i => i.type === 'error').length
  const warningCount = compliance.issues.filter(i => i.type === 'warning').length
  const infoCount = compliance.issues.filter(i => i.type === 'info').length

  return (
    <div className="space-y-4">
      {/* Compliance Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {getComplianceBadge(compliance.canSpamCompliant, 'CAN-SPAM')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {getComplianceBadge(compliance.gdprReady, 'GDPR')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Spam Score</span>
              </div>
              <div className="text-2xl font-bold">{compliance.spamScore.toFixed(0)}</div>
              <Progress value={compliance.spamScore} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
              <div className="text-2xl font-bold text-destructive">{errorCount}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Warnings</div>
              <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Info</div>
              <div className="text-2xl font-bold text-blue-600">{infoCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {compliance.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issues & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {compliance.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    issue.type === 'error'
                      ? 'bg-destructive/10 border border-destructive/20'
                      : issue.type === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{issue.message}</div>
                    <Badge
                      variant="outline"
                      className="text-xs mt-1"
                    >
                      {issue.type === 'error' ? 'Critical' : issue.type === 'warning' ? 'Warning' : 'Info'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Info */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Compliance Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-green-900">
          <div>
            <strong>CAN-SPAM Act:</strong> Requires valid From address, subject line, and unsubscribe option
          </div>
          <div>
            <strong>GDPR:</strong> Requires consent, clear privacy policy, and easy unsubscribe
          </div>
          <div>
            <strong>Spam Score:</strong> Lower is better. Avoid excessive caps, multiple exclamations, and aggressive CTAs
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
