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
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  Info,
  Zap,
  Mail,
  MessageSquare,
  Music,
  Share2,
  Key,
  CheckCircle,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Cloud,
  Send,
  Smartphone,
} from "lucide-react";
import { cn } from "./ui/utils";

interface AddIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const socialPlatforms = [
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    icon: Music,
    description: "Connect Spotify for Artists and sync listener data",
    features: ["Listener insights", "Stream counts", "Playlist tracking", "Demographics"],
    setupSteps: ["Visit Spotify for Artists", "Grant access permissions", "Verify account"],
    difficulty: "Easy",
  },
  {
    id: "apple-music",
    name: "Apple Music",
    category: "music",
    icon: Music,
    description: "Access Apple Music for Artists analytics",
    features: ["Play metrics", "Sales data", "Shazam integration", "City charts"],
    setupSteps: ["Sign in to Apple Music for Artists", "Accept permissions", "Confirm connection"],
    difficulty: "Easy",
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    category: "music",
    icon: Cloud,
    description: "Connect SoundCloud Pro account for advanced stats",
    features: ["Play tracking", "Download stats", "Comment insights", "Repost tracking"],
    setupSteps: ["Log in to SoundCloud", "Authorize app", "Enable API access"],
    difficulty: "Medium",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    category: "social",
    icon: Twitter,
    description: "Sync Twitter followers and engagement metrics",
    features: ["Follower growth", "Tweet analytics", "Engagement rates", "Audience insights"],
    setupSteps: ["Connect Twitter account", "Grant read permissions", "Verify connection"],
    difficulty: "Easy",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "social",
    icon: Linkedin,
    description: "Connect LinkedIn for professional network insights",
    features: ["Network growth", "Post engagement", "Profile views", "Industry data"],
    setupSteps: ["Sign in to LinkedIn", "Authorize application", "Complete setup"],
    difficulty: "Easy",
  },
];

const emailProviders = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    icon: Mail,
    description: "Popular email marketing platform",
    features: ["Email campaigns", "Automation", "Analytics", "Templates"],
    difficulty: "Medium",
  },
  {
    id: "mailgun",
    name: "Mailgun",
    icon: Send,
    description: "Developer-focused email service",
    features: ["Transactional email", "API access", "Delivery tracking", "Logs"],
    difficulty: "Advanced",
  },
];

const smsProviders = [
  {
    id: "clicksend",
    name: "ClickSend",
    icon: Smartphone,
    description: "Global SMS and communication platform",
    features: ["SMS campaigns", "MMS support", "Global reach", "Two-way messaging"],
    difficulty: "Medium",
  },
  {
    id: "messagebird",
    name: "MessageBird",
    icon: MessageSquare,
    description: "Omnichannel cloud communications",
    features: ["SMS/Voice", "WhatsApp", "Global coverage", "Analytics"],
    difficulty: "Medium",
  },
];

const STEPS = [
  { id: 1, name: 'Select Platform' },
  { id: 2, name: 'Configure' },
  { id: 3, name: 'Connect' },
];

export function AddIntegrationModal({ open, onOpenChange }: AddIntegrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accountId, setAccountId] = useState("");
  const [connecting, setConnecting] = useState(false);

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

  const handleConnect = async () => {
    setConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnecting(false);
    
    console.log("Connecting to:", selectedPlatform?.name, {
      apiKey,
      apiSecret,
      accountId,
    });
    
    onOpenChange(false);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedPlatform(null);
    setApiKey("");
    setApiSecret("");
    setAccountId("");
    setConnecting(false);
  };

  const handleSelectPlatform = (platform: any) => {
    setSelectedPlatform(platform);
    setCurrentStep(2);
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Add Integration
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 ? "Choose a platform to connect" : `Step ${currentStep} of ${STEPS.length}: ${STEPS[currentStep - 1].name}`}
          </DialogDescription>
        </DialogHeader>

        {currentStep > 1 && (
          <div className="space-y-3">
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((step) => {
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
        )}

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Select Platform */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Tabs defaultValue="social" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="social">
                    <Share2 className="w-4 h-4 mr-2" />
                    Social & Music
                  </TabsTrigger>
                  <TabsTrigger value="email">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="sms">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    SMS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="social" className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {socialPlatforms.map((platform) => (
                      <Card
                        key={platform.id}
                        className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                        onClick={() => handleSelectPlatform(platform)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <platform.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{platform.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {platform.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {platform.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {platform.features.slice(0, 3).map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {emailProviders.map((provider) => (
                      <Card
                        key={provider.id}
                        className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                        onClick={() => handleSelectPlatform(provider)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <provider.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{provider.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {provider.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {provider.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {provider.features.slice(0, 3).map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sms" className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {smsProviders.map((provider) => (
                      <Card
                        key={provider.id}
                        className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                        onClick={() => handleSelectPlatform(provider)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <provider.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{provider.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {provider.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {provider.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {provider.features.slice(0, 3).map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 2: Configure */}
          {currentStep === 2 && selectedPlatform && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Configure {selectedPlatform.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your API credentials to connect
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <Card className="glass-primary rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <selectedPlatform.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{selectedPlatform.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPlatform.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label htmlFor="api-key">API Key *</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="api-secret">API Secret</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="api-secret"
                        type="password"
                        placeholder="Enter your API secret (if required)..."
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="account-id">Account ID</Label>
                    <Input
                      id="account-id"
                      placeholder="Your account or user ID..."
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>Security:</strong> Your credentials are encrypted and stored securely. 
                      We never store passwords or access tokens in plain text.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">How to get your API credentials</h4>
                      <ol className="space-y-2 text-sm">
                        {selectedPlatform.setupSteps?.map((step: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-medium">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open {selectedPlatform.name} Developer Portal
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-2">What we'll access</h4>
                      <ul className="space-y-1">
                        {selectedPlatform.features?.map((feature: string, i: number) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Connect */}
          {currentStep === 3 && selectedPlatform && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Connect to {selectedPlatform.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Review and complete the connection
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <Card className="glass-glow rounded-2xl">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <selectedPlatform.icon className="w-10 h-10 text-primary" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">{selectedPlatform.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ready to connect your account
                      </p>
                      {connecting ? (
                        <div className="space-y-3">
                          <Progress value={66} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            Establishing secure connection...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Credentials validated</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Permissions verified</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3">Connection Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform:</span>
                        <span className="font-medium">{selectedPlatform.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account ID:</span>
                        <span className="font-medium">{accountId || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sync Frequency:</span>
                        <span className="font-medium">Every 30 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Access:</span>
                        <span className="font-medium">{selectedPlatform.features?.length || 0} metrics</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs md:text-sm">
                    Once connected, data will begin syncing automatically. You can manage 
                    sync settings and disconnect at any time from the Integrations page.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:gap-0">
          <div>
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex items-center gap-2"
                disabled={connecting}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => { onOpenChange(false); handleClose(); }} disabled={connecting}>
              Cancel
            </Button>
            {currentStep === 3 ? (
              <Button 
                onClick={handleConnect}
                disabled={!apiKey.trim() || connecting}
                className="flex items-center gap-2"
              >
                {connecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Connect</span>
                  </>
                )}
              </Button>
            ) : (
              currentStep === 2 && (
                <Button 
                  onClick={handleNext}
                  disabled={!apiKey.trim()}
                  className="flex items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}