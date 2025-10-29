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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Music,
  User,
  Link as LinkIcon,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "./ui/utils";

interface CreateArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genreOptions = [
  "Hip Hop",
  "Trap",
  "R&B",
  "Pop",
  "Rock",
  "Electronic",
  "Country",
  "Jazz",
  "Blues",
  "Reggae",
  "Latin",
  "Metal",
  "Indie",
  "Folk",
  "Soul",
  "Funk",
  "Punk",
  "Classical",
];

const platformOptions = [
  { id: "spotify", name: "Spotify", icon: Music2, placeholder: "Artist Spotify ID or URL" },
  { id: "apple", name: "Apple Music", icon: Music, placeholder: "Apple Music Artist URL" },
  { id: "youtube", name: "YouTube", icon: Youtube, placeholder: "YouTube Channel Handle" },
  { id: "instagram", name: "Instagram", icon: Instagram, placeholder: "@username" },
  { id: "tiktok", name: "TikTok", icon: Music2, placeholder: "@username" },
  { id: "twitter", name: "Twitter/X", icon: Twitter, placeholder: "@username" },
  { id: "soundcloud", name: "SoundCloud", icon: Music2, placeholder: "SoundCloud username" },
];

const STEPS = [
  { id: 1, name: 'Basic Info', icon: User },
  { id: 2, name: 'Platforms', icon: LinkIcon },
  { id: 3, name: 'Details', icon: Settings },
];

export function CreateArtistModal({ open, onOpenChange }: CreateArtistModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [artistName, setArtistName] = useState("");
  const [stageName, setStageName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [recordLabel, setRecordLabel] = useState("Wreckshop Records");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [verified, setVerified] = useState(false);

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

  const handleCreateArtist = () => {
    // Handle artist creation logic here
    console.log({
      artistName,
      stageName,
      bio,
      genres: selectedGenres,
      platforms,
      website,
      email,
      phone,
      location,
      recordLabel,
      status,
      verified,
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setArtistName("");
    setStageName("");
    setBio("");
    setSelectedGenres([]);
    setPlatforms({});
    setWebsite("");
    setEmail("");
    setPhone("");
    setLocation("");
    setStatus("active");
    setVerified(false);
    onOpenChange(false);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const updatePlatform = (platformId: string, value: string) => {
    setPlatforms(prev => ({
      ...prev,
      [platformId]: value,
    }));
  };

  const canProceedFromStep1 = artistName.trim() !== "" && selectedGenres.length > 0;
  const canProceedFromStep2 = Object.keys(platforms).some(key => platforms[key]?.trim() !== "");
  const canCreate = canProceedFromStep1 && canProceedFromStep2;

  const progressPercentage = (currentStep / STEPS.length) * 100;
  const connectedPlatforms = Object.keys(platforms).filter(key => platforms[key]?.trim() !== "");

  // Generate initials for avatar
  const getInitials = () => {
    const name = stageName || artistName;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Add New Artist
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />
          <div className="grid grid-cols-3 gap-2">
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
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Artist Information</h3>
                <p className="text-sm text-muted-foreground">
                  Enter basic details about the artist
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="artist-name">Artist/Legal Name *</Label>
                    <Input
                      id="artist-name"
                      placeholder="e.g., Jacques Berman Webster II"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="stage-name">Stage Name</Label>
                    <Input
                      id="stage-name"
                      placeholder="e.g., Travis Scott"
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave blank if same as artist name
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      placeholder="Write a brief bio about the artist..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {bio.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <Label>Genres * (Select at least one)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {genreOptions.map((genre) => {
                        const isSelected = selectedGenres.includes(genre);
                        return (
                          <Badge
                            key={genre}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer transition-all hover:shadow-sm"
                            onClick={() => toggleGenre(genre)}
                          >
                            {genre}
                          </Badge>
                        );
                      })}
                    </div>
                    {selectedGenres.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm md:text-base">Artist Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">
                            {stageName || artistName || 'Artist Name'}
                          </h4>
                          {stageName && artistName && (
                            <p className="text-xs text-muted-foreground">
                              {artistName}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {bio || 'Artist biography will appear here...'}
                          </p>
                          {selectedGenres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedGenres.map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use the artist's most recognized stage name</li>
                        <li>• Keep bio concise and engaging</li>
                        <li>• Select all relevant genres</li>
                        <li>• You can edit this information later</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Platform Connections */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Connect Platforms</h3>
                <p className="text-sm text-muted-foreground">
                  Link the artist's social media and streaming accounts
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  {platformOptions.map((platform) => {
                    const Icon = platform.icon;
                    const isConnected = platforms[platform.id]?.trim() !== "";
                    
                    return (
                      <Card key={platform.id} className={cn(
                        "transition-all",
                        isConnected && "ring-1 ring-primary/20"
                      )}>
                        <CardContent className="p-3 md:p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0",
                              isConnected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              <Icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={platform.id} className="text-sm">
                                  {platform.name}
                                </Label>
                                {isConnected && (
                                  <Badge variant="outline" className="text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Connected
                                  </Badge>
                                )}
                              </div>
                              <Input
                                id={platform.id}
                                placeholder={platform.placeholder}
                                value={platforms[platform.id] || ""}
                                onChange={(e) => updatePlatform(platform.id, e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <Card className="glass-primary rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium mb-1">Platform Connections</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Connect at least one platform to track artist performance and engagement across channels.
                          </p>
                          {connectedPlatforms.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-1">
                                {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? 's' : ''} connected
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {connectedPlatforms.map((platformId) => {
                                  const platform = platformOptions.find(p => p.id === platformId);
                                  return platform ? (
                                    <Badge key={platformId} variant="secondary" className="text-xs">
                                      {platform.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>Auto-Discovery:</strong> Once connected, we'll automatically sync follower counts, 
                      engagement metrics, and content from these platforms.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Supported Formats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Spotify: Artist ID or full URL</li>
                        <li>• Instagram/TikTok: @username</li>
                        <li>• YouTube: Channel handle or URL</li>
                        <li>• URLs will be automatically validated</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Additional Details</h3>
                <p className="text-sm text-muted-foreground">
                  Optional information to complete the artist profile
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://artistwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="artist@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Houston, TX"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="label">Record Label</Label>
                    <Input
                      id="label"
                      placeholder="Wreckshop Records"
                      value={recordLabel}
                      onChange={(e) => setRecordLabel(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="verified" className="text-sm">Verified Artist</Label>
                        <p className="text-xs text-muted-foreground">
                          Mark as verified on streaming platforms
                        </p>
                      </div>
                      <Checkbox
                        id="verified"
                        checked={verified}
                        onCheckedChange={(checked) => setVerified(checked as boolean)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {stageName || artistName || 'Artist Name'}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {location || 'Location not set'} • {recordLabel}
                          </p>
                        </div>
                        {verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Genres:</span>
                          <span className="font-medium">{selectedGenres.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Platforms:</span>
                          <span className="font-medium">{connectedPlatforms.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {status}
                          </Badge>
                        </div>
                        {email && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium text-xs">{email}</span>
                          </div>
                        )}
                      </div>

                      {connectedPlatforms.length > 0 && (
                        <div className="border-t pt-3">
                          <div className="text-xs text-muted-foreground mb-2">Connected Platforms:</div>
                          <div className="flex flex-wrap gap-1">
                            {connectedPlatforms.map((platformId) => {
                              const platform = platformOptions.find(p => p.id === platformId);
                              const Icon = platform?.icon;
                              return platform && Icon ? (
                                <div
                                  key={platformId}
                                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                                >
                                  <Icon className="w-3 h-3" />
                                  <span>{platform.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      After creating the artist profile, you can add releases, schedule events, 
                      and create targeted campaigns.
                    </AlertDescription>
                  </Alert>
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
            {connectedPlatforms.length > 0 && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? 's' : ''} connected
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
                  (currentStep === 2 && !canProceedFromStep2)
                }
                className="flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateArtist} 
                disabled={!canCreate}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Add Artist</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}