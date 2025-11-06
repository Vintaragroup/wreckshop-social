import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Mail,
  Users,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Eye,
  Palette,
  Type,
  Target,
  Music,
  Ticket,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "./ui/utils";
import { format } from "date-fns";
import { apiUrl } from "../lib/api";
import { EmailTemplateModal } from "./email-templates";
import { toast } from "sonner";

interface CreateEmailCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (campaign: any) => void;
}

interface EmailTemplate {
  _id: string
  name: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
}

interface Segment {
  _id: string
  name: string
  estimatedCount: number
}

const emailTemplates = [
  {
    id: "album-launch",
    name: "Album Launch",
    icon: Music,
    description: "Announce new album releases with streaming links",
    category: "release",
  },
  {
    id: "event-presale",
    name: "Event Presale",
    icon: Ticket,
    description: "Exclusive ticket presale for concerts and events",
    category: "event",
  },
  {
    id: "merchandise",
    name: "Merchandise",
    icon: ShoppingBag,
    description: "Promote new merchandise drops and limited editions",
    category: "merch",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    icon: Mail,
    description: "Regular updates and behind-the-scenes content",
    category: "content",
  },
  {
    id: "blank",
    name: "Blank Template",
    icon: Type,
    description: "Start from scratch with a blank canvas",
    category: "custom",
  },
];

const audiences = [
  { id: "all-subscribers", name: "All Subscribers", count: "127,439", description: "Everyone on your email list" },
  { id: "travis-scott-fans", name: "Travis Scott Fans", count: "89,234", description: "Fans who engaged with Travis content" },
  { id: "houston-locals", name: "Houston Locals", count: "23,891", description: "Subscribers in Houston metro area" },
  { id: "high-engagement", name: "High Engagement", count: "15,672", description: "Most active subscribers (90-day)" },
  { id: "vip-customers", name: "VIP Customers", count: "4,523", description: "Premium tier subscribers" },
  { id: "new-subscribers", name: "New Subscribers", count: "2,847", description: "Joined in last 30 days" },
];

const STEPS = [
  { id: 1, name: 'Template', icon: Palette },
  { id: 2, name: 'Content', icon: Type },
  { id: 3, name: 'Audience', icon: Users },
  { id: 4, name: 'Schedule', icon: Clock },
];

export function CreateEmailCampaignModal({ open, onOpenChange, onCreated }: CreateEmailCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [showSegmentDropdown, setShowSegmentDropdown] = useState(false);
  const [loadingSegments, setLoadingSegments] = useState(false);
  const [senderName, setSenderName] = useState("Wreckshop Records");
  const [senderEmail, setSenderEmail] = useState("info@wreckshoprecords.com");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [sendNow, setSendNow] = useState(true);
  const [abTest, setAbTest] = useState(false);

  const loadSegments = async () => {
    try {
      setLoadingSegments(true)
      const res = await fetch(apiUrl('/segments'))
      if (!res.ok) throw new Error('Failed to load segments')
      const json = await res.json()
      setSegments(json.data || [])
    } catch (err: any) {
      toast.error('Failed to load segments')
    } finally {
      setLoadingSegments(false)
    }
  }

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setSubject(template.subject)
    setSenderName(template.fromName)
    setSenderEmail(template.fromEmail)
    setEmailBody(template.bodyHtml)
    setShowTemplateModal(false)
  }

  const handleOpenSegmentsDropdown = () => {
    setShowSegmentDropdown(true)
    if (segments.length === 0) {
      loadSegments()
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateCampaign = async () => {
    // Persist basic email campaign to backend
    try {
      const scheduleIso = !sendNow && scheduleDate
        ? new Date(
            `${scheduleDate.toDateString()} ${scheduleTime}`
          ).toISOString()
        : undefined

      const payload: any = {
        name: campaignName,
        channels: {
          email: {
            subject,
            bodyHtml: emailBody,
            fromName: senderName,
            fromEmail: senderEmail,
          },
        },
        schedule: scheduleIso ? { startAt: scheduleIso } : undefined,
        segments: selectedSegment ? [selectedSegment._id] : [],
      }
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to create campaign')
      onCreated?.(json.data)
      handleClose()
    } catch (e) {
      console.error('Create campaign failed', e)
      // Keep dialog open; in a future pass show a toast
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedTemplate(null);
    setCampaignName("");
    setSubject("");
    setPreheader("");
    setEmailBody("");
    setSelectedSegment(null);
    setSendNow(true);
    setScheduleDate(undefined);
    setAbTest(false);
    onOpenChange(false);
  };

  const canProceedFromStep1 = selectedTemplate !== null;
  const canProceedFromStep2 = campaignName.trim() !== "" && subject.trim() !== "" && emailBody.trim() !== "";
  const canProceedFromStep3 = selectedSegment !== null;
  const canCreate = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3;

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Create Email Campaign
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />
          <div className="grid grid-cols-4 gap-2">
            {STEPS.map((step) => {
              const StepIcon = step.icon;
              const isComplete = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg transition-colors",
                    isCurrent && "bg-primary/10",
                    isComplete && "bg-accent/10"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs",
                    isCurrent && "bg-primary text-primary-foreground",
                    isComplete && "bg-accent text-accent-foreground",
                    !isCurrent && !isComplete && "bg-muted text-muted-foreground"
                  )}>
                    {isComplete ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <span className={cn(
                    "text-xs md:text-sm truncate",
                    isCurrent && "font-medium",
                    !isCurrent && !isComplete && "text-muted-foreground"
                  )}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Choose a Template</h3>
                <p className="text-sm text-muted-foreground">
                  Select a template from your library or from pre-designed options
                </p>
              </div>

              {selectedTemplate ? (
                <Card className="ring-2 ring-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedTemplate.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplateModal(true)}
                      >
                        Change Template
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Subject: </span>
                      <span className="text-sm">{selectedTemplate.subject}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">From: </span>
                      <span className="text-sm">{selectedTemplate.fromName} &lt;{selectedTemplate.fromEmail}&gt;</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground py-8">
                    No template selected
                  </p>
                  <Button
                    onClick={() => setShowTemplateModal(true)}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Select from Template Library
                  </Button>
                </div>
              )}

              <EmailTemplateModal
                open={showTemplateModal}
                onOpenChange={setShowTemplateModal}
                onSelectTemplate={handleSelectTemplate}
              />
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Email Content</h3>
                <p className="text-sm text-muted-foreground">
                  Create your email content and configure sender details
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name *</Label>
                    <Input
                      id="campaign-name"
                      placeholder="e.g., Summer Album Launch 2025"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject Line *</Label>
                    <Input
                      id="subject"
                      placeholder="🔥 Your subject line here..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="preheader">Preheader Text</Label>
                    <Input
                      id="preheader"
                      placeholder="Preview text that appears after subject..."
                      value={preheader}
                      onChange={(e) => setPreheader(e.target.value)}
                      maxLength={150}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {preheader.length}/150 characters
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sender-name">Sender Name</Label>
                      <Input
                        id="sender-name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sender-email">Sender Email</Label>
                      <Input
                        id="sender-email"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email-body">Email Body *</Label>
                    <Textarea
                      id="email-body"
                      placeholder="Write your email content here..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={8}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm md:text-base flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Email Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <div className="text-sm space-y-2">
                          <div className="font-medium">{senderName || "Sender Name"}</div>
                          <div className="text-muted-foreground text-xs">{senderEmail || "sender@email.com"}</div>
                          <Separator className="my-2" />
                          <div className="font-medium">{subject || "Subject Line"}</div>
                          <div className="text-muted-foreground text-xs">
                            {preheader || "Preheader text..."}
                          </div>
                          <Separator className="my-2" />
                          <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {emailBody || "Email body will appear here..."}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ab-test"
                      checked={abTest}
                      onCheckedChange={setAbTest}
                    />
                    <Label htmlFor="ab-test" className="text-sm">
                      Enable A/B Testing
                    </Label>
                  </div>
                  
                  {abTest && (
                    <Card className="bg-muted/50 border-warning/20">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium mb-1">A/B Testing Enabled</div>
                            <p className="text-xs text-muted-foreground">
                              Split your audience to test different subject lines or content variations and optimize performance.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use personalization: {`{{firstName}}, {{lastName}}`}</li>
                        <li>• Keep subject lines under 50 characters</li>
                        <li>• Include a clear call-to-action</li>
                        <li>• Test on mobile devices</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Audience/Segment Selection */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Select Audience Segment</h3>
                <p className="text-sm text-muted-foreground">
                  Choose which audience segment to send this campaign to
                </p>
              </div>

              {selectedSegment ? (
                <Card className="ring-2 ring-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedSegment.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenSegmentsDropdown}
                      >
                        Change Segment
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">
                          {selectedSegment.estimatedCount.toLocaleString()} subscribers
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Estimated reach for this campaign
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground py-8">
                    {loadingSegments ? 'Loading segments...' : 'No segment selected'}
                  </p>
                  <Button
                    onClick={handleOpenSegmentsDropdown}
                    className="w-full"
                    disabled={loadingSegments}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {loadingSegments ? 'Loading...' : 'Select Segment'}
                  </Button>
                </div>
              )}

              {showSegmentDropdown && !selectedSegment && (
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Available Segments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                    {segments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No segments available</p>
                    ) : (
                      segments.map(seg => (
                        <Button
                          key={seg._id}
                          variant="outline"
                          onClick={() => {
                            setSelectedSegment(seg)
                            setShowSegmentDropdown(false)
                          }}
                          className="w-full justify-between"
                        >
                          <span>{seg.name}</span>
                          <Badge variant="secondary">{seg.estimatedCount.toLocaleString()}</Badge>
                        </Button>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 4 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Schedule Campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Choose when to send your email campaign
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <Card className={cn(
                    "cursor-pointer transition-all",
                    sendNow && "ring-2 ring-primary"
                  )} onClick={() => setSendNow(true)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          sendNow ? "border-primary" : "border-muted-foreground"
                        )}>
                          {sendNow && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          <span className="font-medium">Send Now</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6 mt-1">
                        Send immediately after creation
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    "cursor-pointer transition-all",
                    !sendNow && "ring-2 ring-primary"
                  )} onClick={() => setSendNow(false)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          !sendNow ? "border-primary" : "border-muted-foreground"
                        )}>
                          {!sendNow && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="font-medium">Schedule for Later</span>
                        </div>
                      </div>
                      
                      {!sendNow && (
                        <div className="ml-6 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className={cn(
                                    "w-full justify-start text-left font-normal mt-1",
                                    !scheduleDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={scheduleDate}
                                  onSelect={setScheduleDate}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Label htmlFor="time" className="text-sm">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Campaign Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Template:</span>
                        <Badge variant="outline">
                          {selectedTemplate?.name || 'None'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Campaign:</span>
                        <span className="font-medium truncate ml-2">{campaignName || 'Untitled'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subject:</span>
                        <span className="font-medium truncate ml-2 max-w-[200px]">{subject || 'No subject'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Segment:</span>
                        <span className="font-medium">{selectedSegment?.name || 'None'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Reach:</span>
                        <span className="font-medium">~{selectedSegment?.estimatedCount.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Send:</span>
                        <span className="font-medium">
                          {sendNow ? 'Immediately' : scheduleDate ? format(scheduleDate, "MMM d, yyyy") : 'Not set'}
                        </span>
                      </div>
                      {abTest && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">A/B Testing:</span>
                          <Badge variant="outline" className="text-xs">Enabled</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Optimal Send Time</span>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Based on your audience's engagement patterns, the best time to send is Tuesday at 10:00 AM CST.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Best Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Tuesday-Thursday have highest open rates</li>
                        <li>• Best times: 9-11am or 1-3pm</li>
                        <li>• Avoid weekends for business content</li>
                        <li>• Test before sending to large lists</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:gap-0">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < STEPS.length ? (
              <Button 
                onClick={handleNext} 
                disabled={
                  (currentStep === 1 && !canProceedFromStep1) ||
                  (currentStep === 2 && !canProceedFromStep2) ||
                  (currentStep === 3 && !canProceedFromStep3)
                }
                className="flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateCampaign} 
                disabled={!canCreate}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{sendNow ? 'Create & Send' : 'Create Campaign'}</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}