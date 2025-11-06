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
import { Alert, AlertDescription } from "./ui/alert";
import {
  MessageSquare,
  Users,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Eye,
  Type,
  Target,
  Music,
  Ticket,
  ShoppingBag,
  AlertTriangle,
  Timer,
  Link,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "./ui/utils";
import { format } from "date-fns";

interface CreateSMSCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (campaign: any) => void;
}

const smsTemplates = [
  {
    id: "event-alert",
    name: "Event Alert",
    icon: Ticket,
    description: "Last-minute ticket alerts and event reminders",
    category: "event",
    example: "🎫 LAST CHANCE! Travis Scott Houston tickets still available. Get yours: wreck.sh/tickets",
  },
  {
    id: "album-drop",
    name: "Album Drop",
    icon: Music,
    description: "Announce new releases as they go live",
    category: "release",
    example: "🔥 UTOPIA is NOW LIVE! Stream on all platforms: wreck.sh/utopia",
  },
  {
    id: "flash-sale",
    name: "Flash Sale",
    icon: ShoppingBag,
    description: "Time-sensitive merchandise promotions",
    category: "merch",
    example: "⚡ FLASH SALE! 30% off all merch for next 24hrs only. Use code FLASH30: wreck.sh/shop",
  },
  {
    id: "vip-exclusive",
    name: "VIP Exclusive",
    icon: Zap,
    description: "Special offers for premium subscribers",
    category: "vip",
    example: "✨ Exclusive VIP packages now available for Houston show! Limited quantity: wreck.sh/vip",
  },
  {
    id: "blank",
    name: "Custom Message",
    icon: Type,
    description: "Create your own SMS from scratch",
    category: "custom",
    example: "",
  },
];

const audiences = [
  { id: "all-subscribers", name: "All SMS Subscribers", count: "45,237", description: "Everyone who opted in to SMS" },
  { id: "event-interested", name: "Event Interested", count: "18,932", description: "Engaged with event content" },
  { id: "houston-locals", name: "Houston Locals", count: "12,847", description: "Subscribers in Houston metro area" },
  { id: "high-engagement", name: "High Engagement", count: "8,634", description: "Most active SMS subscribers" },
  { id: "vip-customers", name: "VIP Customers", count: "3,452", description: "Premium tier subscribers" },
  { id: "new-subscribers", name: "New SMS Subscribers", count: "1,893", description: "Joined SMS list in last 30 days" },
];

const STEPS = [
  { id: 1, name: 'Template', icon: Type },
  { id: 2, name: 'Message', icon: MessageSquare },
  { id: 3, name: 'Audience', icon: Users },
  { id: 4, name: 'Schedule', icon: Clock },
];

export function CreateSMSCampaignModal({ open, onOpenChange, onCreated }: CreateSMSCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [sendNow, setSendNow] = useState(true);
  const [respectQuietHours, setRespectQuietHours] = useState(true);
  const [enableTracking, setEnableTracking] = useState(true);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = smsTemplates.find(t => t.id === templateId);
    if (template && template.example) {
      setMessage(template.example);
    }
  };

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
    try {
      const scheduleIso = !sendNow && scheduleDate
        ? new Date(`${scheduleDate.toDateString()} ${scheduleTime}`).toISOString()
        : undefined
      const payload: any = {
        name: campaignName,
        channels: {
          sms: {
            bodyText: message,
          },
        },
        schedule: scheduleIso ? { startAt: scheduleIso } : undefined,
        // additional options and segments to be wired later
      }
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to create SMS campaign')
      onCreated?.(json.data)
      handleClose()
    } catch (e) {
      console.error('Create SMS campaign failed', e)
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedTemplate("");
    setCampaignName("");
    setMessage("");
    setShortLink("");
    setSelectedAudiences([]);
    setSendNow(true);
    setScheduleDate(undefined);
    setRespectQuietHours(true);
    setEnableTracking(true);
    onOpenChange(false);
  };

  const messageLength = message.length;
  const segmentCount = Math.ceil(messageLength / 160) || 1;
  const remainingChars = messageLength > 0 ? 160 - (messageLength % 160) : 160;

  const canProceedFromStep1 = selectedTemplate !== "";
  const canProceedFromStep2 = campaignName.trim() !== "" && message.trim() !== "";
  const canProceedFromStep3 = selectedAudiences.length > 0;
  const canCreate = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3;

  const toggleAudience = (audienceId: string) => {
    setSelectedAudiences(prev => 
      prev.includes(audienceId) 
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId]
    );
  };

  const getCharacterCountColor = () => {
    if (messageLength <= 160) return "text-accent";
    if (messageLength <= 320) return "text-warning";
    return "text-destructive";
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;
  
  const totalRecipients = selectedAudiences.reduce((sum, id) => {
    const audience = audiences.find(a => a.id === id);
    return sum + (audience ? parseInt(audience.count.replace(/,/g, '')) : 0);
  }, 0);

  const estimatedCost = (totalRecipients * segmentCount * 0.01).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Create SMS Campaign
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
                <h3 className="mb-1">SMS Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from pre-built templates optimized for music industry SMS campaigns
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                {smsTemplates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <Card 
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardHeader className="pb-2 md:pb-3">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className={cn(
                            "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          )}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm md:text-base leading-tight mb-1">{template.name}</CardTitle>
                            <Badge variant="outline" className="text-xs px-1 md:px-1.5 py-0">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                          {template.description}
                        </p>
                        {template.example && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded leading-snug">
                            "{template.example}"
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Message Content */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">SMS Message</h3>
                <p className="text-sm text-muted-foreground">
                  Create your SMS content with tracking options
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name *</Label>
                    <Input
                      id="campaign-name"
                      placeholder="e.g., Album Drop Alert"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">SMS Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Type your SMS message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${getCharacterCountColor()}`}>
                          {messageLength}/160 characters
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {segmentCount} segment{segmentCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {messageLength < 160 && messageLength > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {remainingChars} remaining
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="short-link">Short Link (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="short-link"
                        placeholder="wreck.sh/custom"
                        value={shortLink}
                        onChange={(e) => setShortLink(e.target.value)}
                      />
                      <Button variant="outline" size="icon">
                        <Link className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create a trackable short link for your campaign
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tracking" className="text-sm">Enable Click Tracking</Label>
                      <Switch
                        id="tracking"
                        checked={enableTracking}
                        onCheckedChange={setEnableTracking}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quiet-hours" className="text-sm">Respect Quiet Hours</Label>
                      <Switch
                        id="quiet-hours"
                        checked={respectQuietHours}
                        onCheckedChange={setRespectQuietHours}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm md:text-base flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        SMS Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <div className="max-w-xs">
                          <div className="text-sm bg-primary text-primary-foreground rounded-lg p-3 ml-8 break-words">
                            {message || "Your SMS message will appear here..."}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 text-right">
                            Now
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>SMS Compliance:</strong> All messages respect quiet hours (9pm-8am local time), 
                      include unsubscribe options, and comply with 10DLC regulations.
                    </AlertDescription>
                  </Alert>

                  {messageLength > 160 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs md:text-sm">
                        <strong>Multiple Segments:</strong> Your message will be sent as {segmentCount} separate 
                        SMS messages, which may increase costs.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Keep it concise and actionable</li>
                        <li>• Include a clear CTA with link</li>
                        <li>• Use emojis for visual appeal</li>
                        <li>• Best under 160 characters</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Audience */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Select SMS Audience</h3>
                <p className="text-sm text-muted-foreground">
                  Choose who will receive this SMS campaign
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {audiences.map((audience) => {
                  const isSelected = selectedAudiences.includes(audience.id);
                  
                  return (
                    <Card
                      key={audience.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => toggleAudience(audience.id)}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAudience(audience.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm font-medium">{audience.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {audience.count}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              {audience.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedAudiences.length > 0 && (
                <>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                          <Target className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {selectedAudiences.length} segment{selectedAudiences.length !== 1 ? 's' : ''} selected
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total reach: ~{totalRecipients.toLocaleString()} subscribers
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-warning/5 border-warning/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">SMS Cost Estimate</span>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Sending {segmentCount} segment{segmentCount !== 1 ? 's' : ''} to{' '}
                            {totalRecipients.toLocaleString()} recipients will cost approximately{' '}
                            <strong>${estimatedCost}</strong>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 4 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Schedule Campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Choose when to send your SMS campaign
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
                          {smsTemplates.find(t => t.id === selectedTemplate)?.name || 'None'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Campaign:</span>
                        <span className="font-medium truncate ml-2">{campaignName || 'Untitled'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Length:</span>
                        <span className="font-medium">{messageLength} chars ({segmentCount} seg)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Segments:</span>
                        <span className="font-medium">{selectedAudiences.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Reach:</span>
                        <span className="font-medium">~{totalRecipients.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Cost:</span>
                        <span className="font-medium">${estimatedCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Send:</span>
                        <span className="font-medium">
                          {sendNow ? 'Immediately' : scheduleDate ? format(scheduleDate, "MMM d, yyyy") : 'Not set'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Timer className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Quiet Hours Protection</span>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            {respectQuietHours 
                              ? "Messages scheduled during quiet hours (9pm-8am local time) will be delayed until 8am."
                              : "Quiet hours protection is disabled. Messages will send at scheduled time."
                            }
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
                        <li>• Weekday afternoons (2-4 PM) get best engagement</li>
                        <li>• Avoid early mornings and late evenings</li>
                        <li>• Test with small segment first</li>
                        <li>• Monitor opt-out rates closely</li>
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