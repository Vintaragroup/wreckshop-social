import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Mail,
  MessageSquare,
  GitBranch,
  ArrowRight,
  ArrowLeft,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Check,
  Target,
  Filter,
  Calendar as CalendarIcon,
  Send,
  MapPin,
  Globe,
} from "lucide-react";
import { cn } from "./ui/utils";
import { format } from "date-fns";
import { apiUrl } from "../lib/api";
import { GeolocationFilterUI } from "./geolocation-filter-ui";

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCampaignType: (type: 'email' | 'sms' | 'journey') => void;
}

interface GeolocationFilters {
  countries?: string[]
  states?: string[]
  cities?: string[]
  timezone?: string[]
  geoRadius?: {
    centerLat: number
    centerLng: number
    radiusKm: number
  }
}

const campaignTypes = [
  {
    id: 'email',
    name: 'Email Campaign',
    icon: Mail,
    description: 'Send targeted email messages to your audience',
    features: ['Rich HTML templates', 'A/B testing', 'Advanced analytics', 'Personalization'],
    bestFor: 'Album launches, newsletters, detailed promotions',
    avgOpen: '24.8%',
    avgClick: '4.2%',
    cost: 'Low',
    difficulty: 'Easy',
  },
  {
    id: 'sms',
    name: 'SMS Campaign',
    icon: MessageSquare,
    description: 'Reach your audience instantly with text messages',
    features: ['Instant delivery', 'High open rates', 'Click tracking', 'Quiet hours'],
    bestFor: 'Last-minute alerts, flash sales, urgent updates',
    avgOpen: '97.2%',
    avgClick: '12.8%',
    cost: 'Medium',
    difficulty: 'Easy',
  },
  {
    id: 'journey',
    name: 'Customer Journey',
    icon: GitBranch,
    description: 'Create automated multi-step campaigns',
    features: ['Behavioral triggers', 'Multi-channel', 'Smart branching', 'Goal tracking'],
    bestFor: 'Onboarding, re-engagement, nurture campaigns',
    avgOpen: 'Varies',
    avgClick: 'Optimized',
    cost: 'Advanced',
    difficulty: 'Medium',
  },
];

const audienceSegments = [
  { id: 'all', name: 'All Subscribers', count: '127,432', description: 'Your entire audience' },
  { id: 'engaged', name: 'Highly Engaged', count: '48,291', description: 'Opened 3+ emails in last 30 days' },
  { id: 'vip', name: 'VIP Fans', count: '12,847', description: 'Top 10% by engagement & purchases' },
  { id: 'inactive', name: 'Inactive Users', count: '23,194', description: 'No opens in 90+ days' },
  { id: 'new', name: 'New Subscribers', count: '8,432', description: 'Joined in last 30 days' },
];

const STEPS = [
  { id: 1, name: 'Template', icon: Zap },
  { id: 2, name: 'Content', icon: Mail },
  { id: 3, name: 'Audience', icon: Users },
  { id: 4, name: 'Geographic', icon: MapPin },
  { id: 5, name: 'Schedule', icon: Clock },
];

export function CreateCampaignModal({ open, onOpenChange, onSelectCampaignType }: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'email' | 'sms' | 'journey' | null>(null);
  
  // Content step state
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [senderName, setSenderName] = useState('Wreckshop Records');
  const [senderEmail, setSenderEmail] = useState('hello@wreckshop.com');
  
  // Audience step state
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [savedSegments, setSavedSegments] = useState<any[]>([]);
  
  // Geographic targeting step state
  const [geoFilters, setGeoFilters] = useState<GeolocationFilters>({
    countries: [],
    states: [],
    cities: [],
    timezone: [],
    geoRadius: { centerLat: 0, centerLng: 0, radiusKm: 0 },
  });
  const [useGeographicTargeting, setUseGeographicTargeting] = useState(false);
  
  // Schedule step state
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState('09:00');

  // Load saved segments when modal opens
  useEffect(() => {
    if (open) {
      loadSavedSegments();
    }
  }, [open]);

  const loadSavedSegments = async () => {
    try {
      const response = await fetch(apiUrl("/spotify/discover/segments"));
      if (response.ok) {
        const json = (await response.json()) as { ok: boolean; data?: any[] };
        if (json.ok && json.data) {
          setSavedSegments(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load segments:", err);
    }
  }

  const handleSelectType = (type: 'email' | 'sms' | 'journey') => {
    setSelectedType(type);
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

  const handleCreate = () => {
    // Handle campaign creation logic here
    console.log({
      type: selectedType,
      name: campaignName,
      subject,
      previewText,
      content: messageContent,
      sender: { name: senderName, email: senderEmail },
      audience: selectedAudience,
      geographic: useGeographicTargeting ? geoFilters : null,
      schedule: {
        type: scheduleType,
        date: scheduleDate,
        time: scheduleTime,
      },
    });
    onOpenChange(false);
    if (selectedType) {
      onSelectCampaignType(selectedType);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedType(null);
    setCampaignName('');
    setSubject('');
    setPreviewText('');
    setMessageContent('');
    setSelectedAudience([]);
    setUseGeographicTargeting(false);
    setGeoFilters({ countries: [], states: [], cities: [], timezone: [], geoRadius: { centerLat: 0, centerLng: 0, radiusKm: 0 } });
    setScheduleType('now');
    setScheduleDate(undefined);
    onOpenChange(false);
  };

  const canProceedFromStep1 = selectedType !== null;
  const canProceedFromStep2 = campaignName.trim() !== '' && 
    (selectedType === 'sms' || (subject.trim() !== '' && messageContent.trim() !== ''));
  const canProceedFromStep3 = selectedAudience.length > 0;
  const canProceedFromStep4 = true; // Geographic targeting is optional
  const canCreate = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3;

  const toggleAudience = (audienceId: string) => {
    setSelectedAudience(prev => 
      prev.includes(audienceId) 
        ? prev.filter(id => id !== audienceId)
        : [...prev, audienceId]
    );
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Create New Campaign
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
                <h3 className="mb-1">Select Campaign Type</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the type of campaign you want to create
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                {campaignTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  
                  return (
                    <Card
                      key={type.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg",
                        isSelected && "ring-2 ring-primary shadow-lg"
                      )}
                      onClick={() => handleSelectType(type.id as 'email' | 'sms' | 'journey')}
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
                            <CardTitle className="text-sm md:text-base leading-tight mb-1.5">{type.name}</CardTitle>
                            <div className="flex flex-wrap gap-1 md:gap-1.5">
                              <Badge variant="outline" className="text-xs px-1 md:px-1.5 py-0">
                                {type.difficulty}
                              </Badge>
                              <Badge variant="secondary" className="text-xs px-1 md:px-1.5 py-0">
                                {type.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 md:space-y-3 pt-0">
                        <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                          {type.description}
                        </p>
                        
                        <div>
                          <h4 className="text-xs md:text-sm mb-1 md:mb-1.5">Key Features:</h4>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {type.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-1 h-1 bg-primary rounded-full mr-1.5 md:mr-2 mt-1.5 shrink-0" />
                                <span className="leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-1.5 md:pt-2 border-t space-y-1 md:space-y-1.5">
                          <div className="text-xs text-muted-foreground leading-snug">
                            <strong className="text-foreground">Best for:</strong> {type.bestFor}
                          </div>
                          <div className="flex justify-between text-xs gap-2">
                            <span className="truncate">Open: <strong>{type.avgOpen}</strong></span>
                            <span className="truncate">Click: <strong>{type.avgClick}</strong></span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Campaign Content</h3>
                <p className="text-sm text-muted-foreground">
                  Create your {selectedType === 'email' ? 'email' : selectedType === 'sms' ? 'SMS' : 'journey'} content
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

                  {selectedType === 'email' && (
                    <>
                      <div>
                        <Label htmlFor="sender-name">Sender Name</Label>
                        <Input
                          id="sender-name"
                          placeholder="Your name or brand"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="sender-email">Sender Email</Label>
                        <Input
                          id="sender-email"
                          type="email"
                          placeholder="hello@yourdomain.com"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject Line *</Label>
                        <Input
                          id="subject"
                          placeholder="🎵 New album dropping this Friday!"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="preview">Preview Text</Label>
                        <Input
                          id="preview"
                          placeholder="Get early access to exclusive tracks..."
                          value={previewText}
                          onChange={(e) => setPreviewText(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {selectedType === 'sms' && (
                    <div>
                      <Label htmlFor="sender-name">Sender Name</Label>
                      <Input
                        id="sender-name"
                        placeholder="Wreckshop Records"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        maxLength={11}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 11 characters for sender ID
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content">
                      {selectedType === 'email' ? 'Email Body' : 'Message'} *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder={
                        selectedType === 'email'
                          ? "Write your email content here..."
                          : "Your SMS message (max 160 characters for best delivery)"
                      }
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      rows={selectedType === 'email' ? 10 : 4}
                      maxLength={selectedType === 'sms' ? 160 : undefined}
                    />
                    {selectedType === 'sms' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {messageContent.length}/160 characters
                      </p>
                    )}
                  </div>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {selectedType === 'email' ? (
                          <>
                            <li>• Use personalization: {`{{firstName}}, {{lastName}}`}</li>
                            <li>• Keep subject lines under 50 characters</li>
                            <li>• Include a clear call-to-action</li>
                            <li>• Test on mobile devices</li>
                          </>
                        ) : (
                          <>
                            <li>• Keep it concise and actionable</li>
                            <li>• Include a clear CTA with link</li>
                            <li>• Avoid special characters</li>
                            <li>• Respect quiet hours (9pm-8am)</li>
                          </>
                        )}
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
                <h3 className="mb-1">Select Audience</h3>
                <p className="text-sm text-muted-foreground">
                  Choose who will receive this campaign
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Default segments */}
                {audienceSegments.map((segment) => {
                  const isSelected = selectedAudience.includes(segment.id);
                  
                  return (
                    <Card
                      key={segment.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => toggleAudience(segment.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAudience(segment.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm font-medium">{segment.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {segment.count}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              {segment.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Saved discovered user segments */}
                {savedSegments.map((segment) => {
                  const segmentId = `discovered-${segment._id}`;
                  const isSelected = selectedAudience.includes(segmentId);
                  
                  return (
                    <Card
                      key={segmentId}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-accent/30",
                        isSelected && "ring-2 ring-accent"
                      )}
                      onClick={() => toggleAudience(segmentId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAudience(segmentId)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm font-medium">{segment.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {segment.estimatedCount?.toLocaleString() || 0}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug">
                              {segment.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedAudience.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {selectedAudience.length} segment{selectedAudience.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total reach: ~
                          {selectedAudience
                            .reduce((sum, id) => {
                              const defaultSeg = audienceSegments.find(s => s.id === id);
                              const savedSeg = savedSegments.find(s => `discovered-${s._id}` === id);
                              return sum + (defaultSeg ? parseInt(defaultSeg.count.replace(/,/g, '')) : 0) + (savedSeg ? (savedSeg.estimatedCount || 0) : 0);
                            }, 0)
                            .toLocaleString()} subscribers
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Geographic Targeting */}
          {currentStep === 4 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Geographic Targeting</h3>
                <p className="text-sm text-muted-foreground">
                  Optional: Target your campaign by geographic location
                </p>
              </div>

              <div className="space-y-4">
                {/* Enable/Disable Geographic Targeting */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="use-geo"
                        checked={useGeographicTargeting}
                        onCheckedChange={(checked) => setUseGeographicTargeting(checked as boolean)}
                      />
                      <div className="flex-1 min-w-0">
                        <label htmlFor="use-geo" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Enable Geographic Targeting
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Narrow your reach to specific regions, countries, cities, or timezone zones
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Filters */}
                {useGeographicTargeting && (
                  <Card className="border-accent/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Geographic Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GeolocationFilterUI filters={geoFilters} onChange={setGeoFilters} />
                    </CardContent>
                  </Card>
                )}

                {/* Geographic Reach Summary */}
                {useGeographicTargeting && (
                  <Card className="bg-accent/5 border-accent/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="font-medium flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Geographic Reach Summary
                        </div>
                        
                        {geoFilters.countries && geoFilters.countries.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Countries:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {geoFilters.countries.map((country) => (
                                <Badge key={country} variant="secondary" className="text-xs">
                                  {country}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {geoFilters.states && geoFilters.states.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">States/Regions:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {geoFilters.states.map((state) => (
                                <Badge key={state} variant="secondary" className="text-xs">
                                  {state}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {geoFilters.cities && geoFilters.cities.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Cities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {geoFilters.cities.map((city) => (
                                <Badge key={city} variant="secondary" className="text-xs">
                                  {city}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {geoFilters.timezone && geoFilters.timezone.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Timezones:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {geoFilters.timezone.map((tz) => (
                                <Badge key={tz} variant="secondary" className="text-xs">
                                  {tz}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {geoFilters.geoRadius?.radiusKm && geoFilters.geoRadius.radiusKm > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Radius Search:</span>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {geoFilters.geoRadius.radiusKm}km from ({geoFilters.geoRadius.centerLat.toFixed(2)}, {geoFilters.geoRadius.centerLng.toFixed(2)})
                            </Badge>
                          </div>
                        )}

                        {!geoFilters.countries?.length && !geoFilters.states?.length && !geoFilters.cities?.length && !geoFilters.timezone?.length && !geoFilters.geoRadius?.radiusKm && (
                          <p className="text-xs text-muted-foreground italic">
                            No geographic filters selected yet. Campaign will reach all selected audience segments.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!useGeographicTargeting && (
                  <Card className="bg-muted/50 border-muted">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Geographic targeting is disabled. Your campaign will reach all selected audience segments regardless of location.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Schedule */}
          {currentStep === 5 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Schedule Your Campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Choose when to send your campaign
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Send Time</Label>
                    <Select value={scheduleType} onValueChange={(value: 'now' | 'scheduled') => setScheduleType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Immediately</SelectItem>
                        <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {scheduleType === 'scheduled' && (
                    <>
                      <div>
                        <Label>Select Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !scheduleDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduleDate ? format(scheduleDate, "PPP") : <span>Pick a date</span>}
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
                        <Label htmlFor="time">Select Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Campaign Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">
                          {selectedType === 'email' ? 'Email' : selectedType === 'sms' ? 'SMS' : 'Journey'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Campaign:</span>
                        <span className="font-medium truncate ml-2">{campaignName || 'Untitled'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Segments:</span>
                        <span className="font-medium">{selectedAudience.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Geographic Targeting:</span>
                        <Badge variant={useGeographicTargeting ? "default" : "secondary"} className="text-xs">
                          {useGeographicTargeting ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Reach:</span>
                        <span className="font-medium">
                          ~{selectedAudience
                            .reduce((sum, id) => {
                              const segment = audienceSegments.find(s => s.id === id);
                              return sum + (segment ? parseInt(segment.count.replace(/,/g, '')) : 0);
                            }, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Send:</span>
                        <span className="font-medium">
                          {scheduleType === 'now' ? 'Immediately' : scheduleDate ? format(scheduleDate, "MMM d, yyyy") : 'Not set'}
                        </span>
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
                  (currentStep === 3 && !canProceedFromStep3) ||
                  (currentStep === 4 && !canProceedFromStep4)
                }
                className="flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreate} 
                disabled={!canCreate}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Create Campaign</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}