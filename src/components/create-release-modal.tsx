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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Music,
  Disc,
  Calendar as CalendarIcon,
  Share2,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Info,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "./ui/utils";
import { format } from "date-fns";

interface CreateReleaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (release: any) => void;
}

const releaseTypes = [
  { id: "single", name: "Single", description: "1-2 tracks" },
  { id: "ep", name: "EP", description: "3-6 tracks" },
  { id: "album", name: "Album", description: "7+ tracks" },
  { id: "compilation", name: "Compilation", description: "Various artists" },
  { id: "mixtape", name: "Mixtape", description: "Free release" },
];

const artistOptions = [
  "Travis Scott",
  "Don Toliver",
  "Maxo Kream",
  "Sheck Wes",
];

const genres = [
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
];

const distributionPlatforms = [
  { id: "spotify", name: "Spotify", checked: true },
  { id: "apple-music", name: "Apple Music", checked: true },
  { id: "youtube-music", name: "YouTube Music", checked: true },
  { id: "amazon-music", name: "Amazon Music", checked: true },
  { id: "tidal", name: "Tidal", checked: false },
  { id: "deezer", name: "Deezer", checked: false },
  { id: "soundcloud", name: "SoundCloud", checked: false },
  { id: "bandcamp", name: "Bandcamp", checked: false },
];

const STEPS = [
  { id: 1, name: 'Release Info', icon: Music },
  { id: 2, name: 'Metadata', icon: Disc },
  { id: 3, name: 'Distribution', icon: Share2 },
  { id: 4, name: 'Settings', icon: Settings },
];

export function CreateReleaseModal({ open, onOpenChange, onCreated }: CreateReleaseModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [releaseTitle, setReleaseTitle] = useState("");
  const [releaseType, setReleaseType] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [featuredArtists, setFeaturedArtists] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined);
  const [label, setLabel] = useState("Wreckshop Records");
  const [upc, setUpc] = useState("");
  const [isrc, setIsrc] = useState("");
  const [copyrightHolder, setCopyrightHolder] = useState("");
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear().toString());
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [explicitContent, setExplicitContent] = useState(false);
  const [platforms, setPlatforms] = useState(distributionPlatforms);
  const [preReleaseDate, setPreReleaseDate] = useState<Date | undefined>(undefined);
  const [enablePreSave, setEnablePreSave] = useState(false);
  const [createSmartLink, setCreateSmartLink] = useState(true);
  const [autoMarketing, setAutoMarketing] = useState(true);
  const [status, setStatus] = useState<"draft" | "scheduled" | "released">("draft");

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

  const handleCreateRelease = async () => {
    const body: any = {
      title: releaseTitle,
      isrc: isrc || undefined,
      upc: upc || undefined,
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
      coverUrl: undefined,
      links: {},
      tags: [releaseType].filter(Boolean),
    }
    try {
      const res = await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const t = await res.text().catch(() => '')
        throw new Error(t || `Failed to create release (${res.status})`)
      }
      const json = await res.json()
      onCreated && onCreated(json.data)
      onOpenChange(false)
    } catch (e) {
      console.error('Create release failed', e)
      alert(`Failed to create release: ${(e as any)?.message || e}`)
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setReleaseTitle("");
    setReleaseType("");
    setSelectedArtist("");
    setFeaturedArtists("");
    setReleaseDate(undefined);
    setUpc("");
    setIsrc("");
    setPrimaryGenre("");
    setSecondaryGenre("");
    setLyrics("");
    setExplicitContent(false);
    setPlatforms(distributionPlatforms);
    setEnablePreSave(false);
    setPreReleaseDate(undefined);
    setStatus("draft");
    onOpenChange(false);
  };

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.id === platformId ? { ...p, checked: !p.checked } : p
      )
    );
  };

  const canProceedFromStep1 = releaseTitle.trim() !== "" && releaseType !== "" && selectedArtist !== "" && releaseDate !== undefined;
  const canProceedFromStep2 = primaryGenre !== "" && copyrightHolder.trim() !== "";
  const canProceedFromStep3 = platforms.some(p => p.checked);
  const canCreate = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3;

  const progressPercentage = (currentStep / STEPS.length) * 100;
  const selectedReleaseType = releaseTypes.find(t => t.id === releaseType);
  const selectedPlatforms = platforms.filter(p => p.checked);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Add New Release
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
          {/* Step 1: Release Info */}
          {currentStep === 1 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Release Information</h3>
                <p className="text-sm text-muted-foreground">
                  Enter basic details about your release
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="release-title">Release Title *</Label>
                    <Input
                      id="release-title"
                      placeholder="e.g., UTOPIA"
                      value={releaseTitle}
                      onChange={(e) => setReleaseTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Release Type *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {releaseTypes.map((type) => (
                        <Card
                          key={type.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-sm",
                            releaseType === type.id && "ring-2 ring-primary"
                          )}
                          onClick={() => setReleaseType(type.id)}
                        >
                          <CardContent className="p-3">
                            <div className="font-medium text-sm">{type.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {type.description}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Primary Artist *</Label>
                    <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select artist..." />
                      </SelectTrigger>
                      <SelectContent>
                        {artistOptions.map((artist) => (
                          <SelectItem key={artist} value={artist}>
                            {artist}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="featured-artists">Featured Artists</Label>
                    <Input
                      id="featured-artists"
                      placeholder="e.g., Drake, 21 Savage (comma separated)"
                      value={featuredArtists}
                      onChange={(e) => setFeaturedArtists(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="label">Record Label</Label>
                    <Input
                      id="label"
                      placeholder="Wreckshop Records"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Release Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !releaseDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {releaseDate ? format(releaseDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={releaseDate}
                          onSelect={setReleaseDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Card className="glass-primary rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Music className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium mb-1">Release Preview</h4>
                          {releaseTitle && releaseDate ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{releaseTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedArtist || "Artist TBD"}
                                {featuredArtists && ` feat. ${featuredArtists}`}
                              </p>
                              {selectedReleaseType && (
                                <Badge variant="outline" className="text-xs">
                                  {selectedReleaseType.name}
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Releasing {format(releaseDate, "MMMM d, yyyy")}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Fill in the details to see a preview
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Cover Art
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Cover (3000x3000px)
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG or PNG, minimum 3000x3000px, maximum 10MB
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Metadata */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Release Metadata</h3>
                <p className="text-sm text-muted-foreground">
                  Add licensing and copyright information
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upc">UPC/EAN (Optional)</Label>
                      <Input
                        id="upc"
                        placeholder="093624856764"
                        value={upc}
                        onChange={(e) => setUpc(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave blank to auto-generate
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="isrc">ISRC (Optional)</Label>
                      <Input
                        id="isrc"
                        placeholder="USSM12300001"
                        value={isrc}
                        onChange={(e) => setIsrc(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-generated if blank
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="copyright-holder">Copyright Holder *</Label>
                    <Input
                      id="copyright-holder"
                      placeholder="© 2024 Wreckshop Records"
                      value={copyrightHolder}
                      onChange={(e) => setCopyrightHolder(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="copyright-year">Copyright Year</Label>
                    <Input
                      id="copyright-year"
                      type="number"
                      placeholder={new Date().getFullYear().toString()}
                      value={copyrightYear}
                      onChange={(e) => setCopyrightYear(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Primary Genre *</Label>
                    <Select value={primaryGenre} onValueChange={setPrimaryGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre..." />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre.toLowerCase()}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Secondary Genre</Label>
                    <Select value={secondaryGenre} onValueChange={setSecondaryGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre..." />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre.toLowerCase()}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="explicit" className="text-sm">Explicit Content</Label>
                      <p className="text-xs text-muted-foreground">
                        Contains explicit lyrics or content
                      </p>
                    </div>
                    <Checkbox
                      id="explicit"
                      checked={explicitContent}
                      onCheckedChange={(checked) => setExplicitContent(checked as boolean)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lyrics">Lyrics (Optional)</Label>
                    <Textarea
                      id="lyrics"
                      placeholder="Enter song lyrics for sync to streaming platforms..."
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Synced lyrics improve engagement on Spotify and Apple Music
                    </p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>Metadata Standards:</strong> All metadata must comply with 
                      streaming platform requirements. Missing UPC/ISRC codes will be 
                      auto-generated by our distributor.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Release Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• UPC codes identify the entire release</li>
                        <li>• ISRC codes identify individual tracks</li>
                        <li>• Explicit content affects playlist eligibility</li>
                        <li>• Genre selection impacts discovery</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Distribution */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Distribution Platforms</h3>
                <p className="text-sm text-muted-foreground">
                  Select where you want to distribute your release
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <Card
                      key={platform.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-sm",
                        platform.checked && "ring-2 ring-primary"
                      )}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={platform.checked}
                              onCheckedChange={() => togglePlatform(platform.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <div className="font-medium">{platform.name}</div>
                            </div>
                          </div>
                          {platform.checked && (
                            <Badge variant="outline" className="text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <Card className="glass-glow rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Share2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Distribution Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Platforms:</span>
                              <span className="font-medium">{selectedPlatforms.length} selected</span>
                            </div>
                            {selectedPlatforms.length > 0 && (
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Selected:</div>
                                <div className="flex flex-wrap gap-1">
                                  {selectedPlatforms.map((platform) => (
                                    <Badge key={platform.id} variant="secondary" className="text-xs">
                                      {platform.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="presave" className="text-sm">Enable Pre-Save</Label>
                        <p className="text-xs text-muted-foreground">
                          Let fans save before release
                        </p>
                      </div>
                      <Switch
                        id="presave"
                        checked={enablePreSave}
                        onCheckedChange={setEnablePreSave}
                      />
                    </div>

                    {enablePreSave && (
                      <div className="pl-4 border-l-2 border-primary/20">
                        <Label>Pre-Save Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !preReleaseDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {preReleaseDate ? format(preReleaseDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={preReleaseDate}
                              onSelect={setPreReleaseDate}
                              disabled={(date) =>
                                date < new Date() || (releaseDate ? date >= releaseDate : false)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>Delivery Time:</strong> Most platforms require 2-4 weeks 
                      for processing. Schedule your release accordingly.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Platform Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Spotify: Canvas, lyrics sync available</li>
                        <li>• Apple Music: Spatial audio support</li>
                        <li>• YouTube Music: Official artist channel</li>
                        <li>• Pre-save campaigns boost day-one streams</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Settings */}
          {currentStep === 4 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Release Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure marketing and visibility options
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Release Status</Label>
                    <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft (Not submitted)</SelectItem>
                        <SelectItem value="scheduled">Scheduled (Submitted)</SelectItem>
                        <SelectItem value="released">Released (Live now)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {status === "draft" && "Save as draft to finish later"}
                      {status === "scheduled" && "Submit to distributor for release date"}
                      {status === "released" && "Mark as already released"}
                    </p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smart-link" className="text-sm">Create Smart Link</Label>
                        <p className="text-xs text-muted-foreground">
                          Generate trackable link for all platforms
                        </p>
                      </div>
                      <Switch
                        id="smart-link"
                        checked={createSmartLink}
                        onCheckedChange={setCreateSmartLink}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-marketing" className="text-sm">Auto-Marketing</Label>
                        <p className="text-xs text-muted-foreground">
                          Create campaigns automatically
                        </p>
                      </div>
                      <Switch
                        id="auto-marketing"
                        checked={autoMarketing}
                        onCheckedChange={setAutoMarketing}
                      />
                    </div>
                  </div>

                  {autoMarketing && (
                    <Alert className="bg-primary/5 border-primary/20">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-xs md:text-sm">
                        We'll automatically create email and SMS campaigns targeting fans 
                        of {selectedArtist || "this artist"} in your audience.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Release Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Release</div>
                        <div className="font-medium">{releaseTitle || "Untitled Release"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Artist</div>
                        <div className="text-sm">
                          {selectedArtist || "Not selected"}
                          {featuredArtists && <span className="text-muted-foreground"> feat. {featuredArtists}</span>}
                        </div>
                      </div>
                      {selectedReleaseType && (
                        <div>
                          <div className="text-xs text-muted-foreground">Type</div>
                          <Badge variant="outline" className="text-xs">
                            {selectedReleaseType.name}
                          </Badge>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground">Release Date</div>
                        <div className="text-sm">
                          {releaseDate ? format(releaseDate, "MMMM d, yyyy") : "Not set"}
                        </div>
                      </div>
                      {primaryGenre && (
                        <div>
                          <div className="text-xs text-muted-foreground">Genre</div>
                          <div className="text-sm capitalize">
                            {primaryGenre}
                            {secondaryGenre && <span className="text-muted-foreground"> / {secondaryGenre}</span>}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground">Platforms</div>
                        <div className="text-sm">{selectedPlatforms.length} selected</div>
                      </div>
                      {explicitContent && (
                        <Badge variant="destructive" className="text-xs">
                          Explicit Content
                        </Badge>
                      )}
                      {enablePreSave && preReleaseDate && (
                        <div>
                          <div className="text-xs text-muted-foreground">Pre-Save</div>
                          <div className="text-sm">Starts {format(preReleaseDate, "MMM d, yyyy")}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Release will be submitted to distributor</li>
                        <li>• Smart links generated immediately</li>
                        <li>• Marketing campaigns auto-created</li>
                        <li>• Track performance in Analytics</li>
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
            {selectedPlatforms.length > 0 && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
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
                onClick={handleCreateRelease} 
                disabled={!canCreate}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Add Release</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}