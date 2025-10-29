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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import {
  GitBranch,
  Users,
  Zap,
  Settings,
  ArrowRight,
  ArrowLeft,
  Mail,
  MessageSquare,
  Timer,
  Clock,
  Target,
  TrendingUp,
  UserPlus,
  Activity,
  ShoppingCart,
  Music,
  Ticket,
  Heart,
  Check,
  Play,
} from "lucide-react";
import { cn } from "./ui/utils";

interface CreateJourneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const journeyTemplates = [
  {
    id: "new-fan-onboarding",
    name: "New Fan Onboarding",
    icon: UserPlus,
    description: "Welcome new subscribers and introduce them to your artists",
    category: "onboarding",
    estimatedDuration: "7 days",
    steps: 5,
    triggers: ["New Subscriber", "First Stream"],
  },
  {
    id: "re-engagement",
    name: "Re-engagement Campaign",
    icon: Activity,
    description: "Win back inactive subscribers with personalized content",
    category: "retention",
    estimatedDuration: "14 days",
    steps: 4,
    triggers: ["Inactive 30 Days", "No Opens 2 Weeks"],
  },
  {
    id: "album-launch",
    name: "Album Launch Series",
    icon: Music,
    description: "Multi-touch campaign for new album releases",
    category: "release",
    estimatedDuration: "21 days",
    steps: 7,
    triggers: ["Album Pre-save", "Release Date"],
  },
  {
    id: "event-promotion",
    name: "Event Promotion",
    icon: Ticket,
    description: "Drive ticket sales with targeted event marketing",
    category: "event",
    estimatedDuration: "30 days",
    steps: 6,
    triggers: ["Event Interest", "Location-based"],
  },
  {
    id: "vip-nurture",
    name: "VIP Customer Journey",
    icon: Heart,
    description: "Exclusive experiences for your highest-value fans",
    category: "vip",
    estimatedDuration: "Ongoing",
    steps: 8,
    triggers: ["VIP Purchase", "High Engagement"],
  },
  {
    id: "blank",
    name: "Build from Scratch",
    icon: GitBranch,
    description: "Create a custom journey with drag-and-drop builder",
    category: "custom",
    estimatedDuration: "Custom",
    steps: 0,
    triggers: ["Custom Trigger"],
  },
];

const triggerOptions = [
  { id: "new-subscriber", name: "New Subscriber", icon: UserPlus, description: "When someone joins your email list" },
  { id: "first-stream", name: "First Stream", icon: Music, description: "First time streaming an artist's music" },
  { id: "inactive-30", name: "Inactive 30 Days", icon: Clock, description: "No engagement for 30 days" },
  { id: "no-opens", name: "No Opens 2 Weeks", icon: Mail, description: "Haven't opened emails in 2 weeks" },
  { id: "album-presave", name: "Album Pre-save", icon: Music, description: "Pre-saved an upcoming album" },
  { id: "event-interest", name: "Event Interest", icon: Ticket, description: "Showed interest in events" },
  { id: "vip-purchase", name: "VIP Purchase", icon: ShoppingCart, description: "Made a VIP-tier purchase" },
  { id: "high-engagement", name: "High Engagement", icon: TrendingUp, description: "Top 10% of engaged users" },
  { id: "location-based", name: "Location-based", icon: Target, description: "Based on geographic location" },
];

const STEPS = [
  { id: 1, name: 'Template', icon: GitBranch },
  { id: 2, name: 'Setup', icon: Settings },
  { id: 3, name: 'Trigger', icon: Zap },
  { id: 4, name: 'Settings', icon: Settings },
];

export function CreateJourneyModal({ open, onOpenChange }: CreateJourneyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [journeyName, setJourneyName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [exitOnGoal, setExitOnGoal] = useState(true);
  const [goalMetric, setGoalMetric] = useState("conversion");
  const [timeZone, setTimeZone] = useState("america-chicago");
  const [sendTimeOpt, setSendTimeOpt] = useState("intelligent");
  const [quietHours, setQuietHours] = useState(true);
  const [priority, setPriority] = useState("normal");
  const [maxContactsPerHour, setMaxContactsPerHour] = useState("unlimited");
  const [advancedAnalytics, setAdvancedAnalytics] = useState(true);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = journeyTemplates.find(t => t.id === templateId);
    if (template) {
      setJourneyName(template.name);
      setDescription(template.description);
      if (template.triggers.length > 0) {
        const triggerName = template.triggers[0].toLowerCase().replace(/\s+/g, '-');
        setSelectedTrigger(triggerName);
      }
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

  const handleCreateJourney = () => {
    // Handle journey creation logic here
    console.log({
      template: selectedTemplate,
      name: journeyName,
      description,
      trigger: selectedTrigger,
      settings: {
        isActive,
        exitOnGoal,
        goalMetric,
        timeZone,
        sendTimeOpt,
        quietHours,
        priority,
        maxContactsPerHour,
        advancedAnalytics,
      },
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedTemplate("");
    setJourneyName("");
    setDescription("");
    setSelectedTrigger("");
    setIsActive(true);
    setExitOnGoal(true);
    setGoalMetric("conversion");
    onOpenChange(false);
  };

  const canProceedFromStep1 = selectedTemplate !== "";
  const canProceedFromStep2 = journeyName.trim() !== "";
  const canProceedFromStep3 = selectedTrigger !== "";
  const canCreate = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3;

  const progressPercentage = (currentStep / STEPS.length) * 100;
  const selectedTemplateData = journeyTemplates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Create Customer Journey
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
                <h3 className="mb-1">Journey Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from proven journey templates designed for music industry campaigns
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {journeyTemplates.map((template) => {
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
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 md:gap-3 min-w-0 flex-1">
                            <div className={cn(
                              "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0",
                              isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                            )}>
                              <Icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-sm md:text-base leading-tight">{template.name}</CardTitle>
                              <Badge variant="outline" className="text-xs mt-1">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-muted-foreground leading-tight">
                              {template.estimatedDuration}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {template.steps} steps
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 leading-snug">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.triggers.map((trigger, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Setup */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Journey Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your journey details and goals
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="journey-name">Journey Name *</Label>
                    <Input
                      id="journey-name"
                      placeholder="Enter journey name..."
                      value={journeyName}
                      onChange={(e) => setJourneyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this journey does..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Goal Metric</Label>
                    <Select value={goalMetric} onValueChange={setGoalMetric}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversion">Conversion</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                        <SelectItem value="custom">Custom Goal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active" className="text-sm">Start journey immediately</Label>
                      <Switch
                        id="active"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="exit-goal" className="text-sm">Exit when goal is achieved</Label>
                      <Switch
                        id="exit-goal"
                        checked={exitOnGoal}
                        onCheckedChange={setExitOnGoal}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <Card>
                    <CardHeader className="pb-2 md:pb-3">
                      <CardTitle className="text-sm md:text-base">Journey Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedTemplateData ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Template:</span>
                            <Badge variant="outline">{selectedTemplateData.name}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Duration:</span>
                            <span className="text-sm text-muted-foreground">
                              {selectedTemplateData.estimatedDuration}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Steps:</span>
                            <span className="text-sm text-muted-foreground">
                              {selectedTemplateData.steps} total
                            </span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Zap className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                                <Mail className="w-3 h-3 text-white" />
                              </div>
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                                <Timer className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-muted-foreground">...</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Select a template to see preview
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Keep journey names descriptive</li>
                        <li>• Set clear conversion goals</li>
                        <li>• Start with 3-5 steps for simplicity</li>
                        <li>• Monitor and optimize over time</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Trigger */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Journey Trigger</h3>
                <p className="text-sm text-muted-foreground">
                  Choose what action will start this journey for your contacts
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {triggerOptions.map((trigger) => {
                  const Icon = trigger.icon;
                  const isSelected = selectedTrigger === trigger.id;
                  
                  return (
                    <Card
                      key={trigger.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedTrigger(trigger.id)}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className={cn(
                            "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          )}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm md:text-base leading-tight">{trigger.name}</div>
                            <div className="text-xs md:text-sm text-muted-foreground mt-0.5 leading-snug">
                              {trigger.description}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription className="text-xs md:text-sm">
                  <strong>Smart Triggers:</strong> Combine multiple triggers with advanced conditions 
                  like location, engagement score, or custom events for more precise targeting.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 4: Settings */}
          {currentStep === 4 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Journey Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure advanced options for your journey
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <Card>
                    <CardHeader className="pb-2 md:pb-3">
                      <CardTitle className="text-sm md:text-base">Timing Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div>
                        <Label>Time Zone</Label>
                        <Select value={timeZone} onValueChange={setTimeZone}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america-chicago">America/Chicago (CST)</SelectItem>
                            <SelectItem value="america-new_york">America/New_York (EST)</SelectItem>
                            <SelectItem value="america-los_angeles">America/Los_Angeles (PST)</SelectItem>
                            <SelectItem value="recipient">Recipient's Time Zone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Send Time Optimization</Label>
                        <Select value={sendTimeOpt} onValueChange={setSendTimeOpt}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intelligent">Intelligent Timing</SelectItem>
                            <SelectItem value="fixed">Fixed Time</SelectItem>
                            <SelectItem value="immediate">Send Immediately</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="quiet-hours" className="text-sm">Respect Quiet Hours</Label>
                        <Switch 
                          id="quiet-hours" 
                          checked={quietHours}
                          onCheckedChange={setQuietHours}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <Card>
                    <CardHeader className="pb-2 md:pb-3">
                      <CardTitle className="text-sm md:text-base">Performance Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div>
                        <Label>Journey Priority</Label>
                        <Select value={priority} onValueChange={setPriority}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="normal">Normal Priority</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Max Contacts per Hour</Label>
                        <Select value={maxContactsPerHour} onValueChange={setMaxContactsPerHour}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">100 contacts/hour</SelectItem>
                            <SelectItem value="500">500 contacts/hour</SelectItem>
                            <SelectItem value="1000">1,000 contacts/hour</SelectItem>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="analytics" className="text-sm">Advanced Analytics</Label>
                        <Switch 
                          id="analytics" 
                          checked={advancedAnalytics}
                          onCheckedChange={setAdvancedAnalytics}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Journey Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Template</div>
                      <div className="text-sm font-medium">{selectedTemplateData?.name || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="text-sm font-medium">{selectedTemplateData?.estimatedDuration || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Trigger</div>
                      <div className="text-sm font-medium">{triggerOptions.find(t => t.id === selectedTrigger)?.name || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Goal</div>
                      <div className="text-sm font-medium capitalize">{goalMetric}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription className="text-xs md:text-sm">
                  <strong>A/B Testing:</strong> After creating your journey, you can set up A/B tests 
                  for individual steps to optimize performance over time.
                </AlertDescription>
              </Alert>
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
            {selectedTemplateData && (
              <Badge variant="outline" className="text-xs md:text-sm hidden sm:inline-flex">
                {selectedTemplateData.estimatedDuration} journey
              </Badge>
            )}
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
                onClick={handleCreateJourney} 
                disabled={!canCreate}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>{selectedTemplate === 'blank' ? 'Open Builder' : 'Create Journey'}</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}