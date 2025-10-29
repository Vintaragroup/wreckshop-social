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
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  DollarSign,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Ticket,
  Clock,
  Info,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "./ui/utils";
import { format } from "date-fns";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventTypes = [
  { id: "concert", name: "Concert", description: "Single artist performance" },
  { id: "festival", name: "Festival", description: "Multi-artist lineup" },
  { id: "tour", name: "Tour Date", description: "Part of a larger tour" },
  { id: "listening-party", name: "Listening Party", description: "Album listening event" },
  { id: "meet-greet", name: "Meet & Greet", description: "Fan interaction event" },
  { id: "virtual", name: "Virtual Event", description: "Online streaming event" },
];

const artistOptions = [
  "Travis Scott",
  "Don Toliver",
  "Maxo Kream",
  "Sheck Wes",
];

const venueOptions = [
  { name: "NRG Stadium", city: "Houston, TX", capacity: 50000 },
  { name: "Toyota Center", city: "Houston, TX", capacity: 18000 },
  { name: "House of Blues", city: "Houston, TX", capacity: 1200 },
  { name: "White Oak Music Hall", city: "Houston, TX", capacity: 3000 },
  { name: "Minute Maid Park", city: "Houston, TX", capacity: 42000 },
  { name: "Custom Venue", city: "", capacity: 0 },
];

const STEPS = [
  { id: 1, name: 'Basic Info', icon: CalendarIcon },
  { id: 2, name: 'Venue', icon: MapPin },
  { id: 3, name: 'Tickets', icon: Ticket },
  { id: 4, name: 'Settings', icon: Settings },
];

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState("20:00");
  const [doorsOpen, setDoorsOpen] = useState("19:00");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [customVenueName, setCustomVenueName] = useState("");
  const [customVenueCity, setCustomVenueCity] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [vipPrice, setVipPrice] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [enablePresale, setEnablePresale] = useState(false);
  const [presaleDate, setPresaleDate] = useState<Date | undefined>(undefined);
  const [presaleCode, setPresaleCode] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("all");
  const [status, setStatus] = useState<"announced" | "on_sale" | "live">("announced");
  const [createSmartLink, setCreateSmartLink] = useState(true);
  const [enableMarketing, setEnableMarketing] = useState(true);

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

  const handleCreateEvent = () => {
    // Handle event creation logic here
    const venue = venueOptions.find(v => v.name === selectedVenue);
    console.log({
      title: eventTitle,
      type: eventType,
      artist: selectedArtist,
      description,
      date: eventDate,
      time: eventTime,
      doorsOpen,
      venue: selectedVenue === "Custom Venue" ? {
        name: customVenueName,
        city: customVenueCity,
        address: venueAddress,
      } : venue,
      capacity: capacity || venue?.capacity,
      tickets: {
        price: ticketPrice,
        vipPrice,
        url: ticketUrl,
      },
      presale: enablePresale ? {
        date: presaleDate,
        code: presaleCode,
      } : null,
      ageRestriction,
      status,
      createSmartLink,
      enableMarketing,
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setEventTitle("");
    setEventType("");
    setSelectedArtist("");
    setDescription("");
    setEventDate(undefined);
    setEventTime("20:00");
    setDoorsOpen("19:00");
    setSelectedVenue("");
    setCustomVenueName("");
    setCustomVenueCity("");
    setVenueAddress("");
    setCapacity("");
    setTicketPrice("");
    setVipPrice("");
    setTicketUrl("");
    setEnablePresale(false);
    setPresaleDate(undefined);
    setPresaleCode("");
    setStatus("announced");
    setCreateSmartLink(true);
    setEnableMarketing(true);
    onOpenChange(false);
  };

  const canProceedFromStep1 = eventTitle.trim() !== "" && eventType !== "" && selectedArtist !== "" && eventDate !== undefined;
  const canProceedFromStep2 = selectedVenue !== "" && (selectedVenue !== "Custom Venue" || (customVenueName.trim() !== "" && customVenueCity.trim() !== ""));
  const canProceedFromStep3 = capacity !== "";
  const canCreate = canProceedFromStep1 && canProceedFromStep2 && canProceedFromStep3;

  const progressPercentage = (currentStep / STEPS.length) * 100;
  const selectedVenueData = venueOptions.find(v => v.name === selectedVenue);
  const selectedEventType = eventTypes.find(t => t.id === eventType);

  // Calculate estimated revenue
  const estimatedRevenue = capacity && ticketPrice 
    ? (parseInt(capacity) * parseFloat(ticketPrice) * 0.85).toFixed(0) // 85% capacity estimate
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Ticket className="w-5 h-5 mr-2" />
            Create Event
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
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Event Information</h3>
                <p className="text-sm text-muted-foreground">
                  Enter basic details about the event
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title *</Label>
                    <Input
                      id="event-title"
                      placeholder="e.g., Astroworld Festival 2024"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Event Type *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {eventTypes.map((type) => (
                        <Card
                          key={type.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-sm",
                            eventType === type.id && "ring-2 ring-primary"
                          )}
                          onClick={() => setEventType(type.id)}
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
                    <Label>Artist/Headliner *</Label>
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
                    <Label htmlFor="description">Event Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what makes this event special..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Event Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !eventDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doors-open">Doors Open</Label>
                      <Input
                        id="doors-open"
                        type="time"
                        value={doorsOpen}
                        onChange={(e) => setDoorsOpen(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Show Starts</Label>
                      <Input
                        id="event-time"
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium mb-1">Event Preview</h4>
                          {eventTitle && eventDate ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{eventTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedArtist || "Artist TBD"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(eventDate, "EEEE, MMMM d, yyyy")} at {eventTime}
                              </p>
                              {selectedEventType && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {selectedEventType.name}
                                </Badge>
                              )}
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
                      <CardTitle className="text-sm">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use descriptive, searchable event titles</li>
                        <li>• Include the year for annual events</li>
                        <li>• Set doors open 1 hour before showtime</li>
                        <li>• Add lineup details in the description</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Venue */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Venue Information</h3>
                <p className="text-sm text-muted-foreground">
                  Select or add venue details
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Select Venue *</Label>
                    <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a venue..." />
                      </SelectTrigger>
                      <SelectContent>
                        {venueOptions.map((venue) => (
                          <SelectItem key={venue.name} value={venue.name}>
                            {venue.name} {venue.city && `- ${venue.city}`} {venue.capacity > 0 && `(${venue.capacity.toLocaleString()} cap)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedVenue === "Custom Venue" && (
                    <>
                      <div>
                        <Label htmlFor="custom-venue-name">Venue Name *</Label>
                        <Input
                          id="custom-venue-name"
                          placeholder="Enter venue name..."
                          value={customVenueName}
                          onChange={(e) => setCustomVenueName(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="custom-venue-city">City, State *</Label>
                        <Input
                          id="custom-venue-city"
                          placeholder="e.g., Houston, TX"
                          value={customVenueCity}
                          onChange={(e) => setCustomVenueCity(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="venue-address">Full Address</Label>
                    <Input
                      id="venue-address"
                      placeholder="Street address"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                    />
                  </div>

                  {selectedVenueData && selectedVenueData.capacity > 0 ? (
                    <div>
                      <Label htmlFor="capacity">Venue Capacity (Optional Override)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder={selectedVenueData.capacity.toString()}
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default: {selectedVenueData.capacity.toLocaleString()} • Leave blank to use default
                      </p>
                    </div>
                  ) : selectedVenue && (
                    <div>
                      <Label htmlFor="capacity">Venue Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="Enter maximum capacity..."
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm md:text-base flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Venue Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedVenue ? (
                        <>
                          <div>
                            <div className="text-xs text-muted-foreground">Venue</div>
                            <div className="font-medium">
                              {selectedVenue === "Custom Venue" ? customVenueName || "Custom Venue" : selectedVenue}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Location</div>
                            <div className="text-sm">
                              {selectedVenue === "Custom Venue" 
                                ? customVenueCity || "Not specified" 
                                : selectedVenueData?.city || "N/A"}
                            </div>
                          </div>
                          {venueAddress && (
                            <div>
                              <div className="text-xs text-muted-foreground">Address</div>
                              <div className="text-sm">{venueAddress}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-muted-foreground">Capacity</div>
                            <div className="text-sm font-medium">
                              {capacity || selectedVenueData?.capacity?.toLocaleString() || "Not set"} attendees
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Select a venue to see details
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>Venue Data:</strong> We'll automatically pull venue images, maps, and parking 
                      information for known venues.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Accessibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Venue accessibility information will be automatically included in event 
                        listings and smart links.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tickets */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="mb-1">Ticket Information</h3>
                <p className="text-sm text-muted-foreground">
                  Configure ticket pricing and sales details
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ticket-price">General Admission</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="ticket-price"
                          type="number"
                          placeholder="0.00"
                          value={ticketPrice}
                          onChange={(e) => setTicketPrice(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="vip-price">VIP/Premium (Optional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="vip-price"
                          type="number"
                          placeholder="0.00"
                          value={vipPrice}
                          onChange={(e) => setVipPrice(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ticket-url">Ticket Sales URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ticket-url"
                        type="url"
                        placeholder="https://tickets.example.com"
                        value={ticketUrl}
                        onChange={(e) => setTicketUrl(e.target.value)}
                      />
                      <Button variant="outline" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Link to Ticketmaster, Eventbrite, or your ticketing platform
                    </p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="presale" className="text-sm">Enable Presale</Label>
                        <p className="text-xs text-muted-foreground">
                          Offer early access to fans
                        </p>
                      </div>
                      <Switch
                        id="presale"
                        checked={enablePresale}
                        onCheckedChange={setEnablePresale}
                      />
                    </div>

                    {enablePresale && (
                      <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                        <div>
                          <Label>Presale Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="outline" 
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-1",
                                  !presaleDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {presaleDate ? format(presaleDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={presaleDate}
                                onSelect={setPresaleDate}
                                disabled={(date) => date < new Date() || (eventDate && date > eventDate)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="presale-code">Presale Code</Label>
                          <Input
                            id="presale-code"
                            placeholder="e.g., CACTUS"
                            value={presaleCode}
                            onChange={(e) => setPresaleCode(e.target.value.toUpperCase())}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Age Restriction</Label>
                    <Select value={ageRestriction} onValueChange={setAgeRestriction}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ages</SelectItem>
                        <SelectItem value="18+">18+</SelectItem>
                        <SelectItem value="21+">21+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Revenue Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Capacity:</span>
                        <span className="font-medium">
                          {capacity || selectedVenueData?.capacity?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">GA Ticket Price:</span>
                        <span className="font-medium">
                          ${ticketPrice || "0.00"}
                        </span>
                      </div>
                      {vipPrice && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">VIP Ticket Price:</span>
                          <span className="font-medium">
                            ${vipPrice}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between">
                        <span className="text-sm text-muted-foreground">Est. Revenue (85% sold):</span>
                        <span className="font-medium text-accent">
                          ${estimatedRevenue ? parseInt(estimatedRevenue).toLocaleString() : "0"}
                        </span>
                      </div>
                      {enablePresale && presaleDate && (
                        <div className="border-t pt-3">
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Presale Active: {format(presaleDate, "MMM d")}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Alert>
                    <Ticket className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                      <strong>Smart Links:</strong> We'll automatically create trackable links 
                      for ticket sales across all your marketing channels.
                    </AlertDescription>
                  </Alert>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Ticket Tiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• General Admission: Standard entry</li>
                        <li>• VIP: Premium seating + perks</li>
                        <li>• Add more tiers after creating event</li>
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
                <h3 className="mb-1">Event Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure marketing and visibility options
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Event Status</Label>
                    <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announced">Announced (Not on sale)</SelectItem>
                        <SelectItem value="on_sale">On Sale</SelectItem>
                        <SelectItem value="live">Live Now</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {status === "announced" && "Event is public but tickets aren't available yet"}
                      {status === "on_sale" && "Tickets are available for purchase"}
                      {status === "live" && "Event is currently happening"}
                    </p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smart-link" className="text-sm">Create Smart Link</Label>
                        <p className="text-xs text-muted-foreground">
                          Generate trackable link for marketing
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
                        <Label htmlFor="marketing" className="text-sm">Enable Marketing Automation</Label>
                        <p className="text-xs text-muted-foreground">
                          Auto-send to email/SMS lists
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={enableMarketing}
                        onCheckedChange={setEnableMarketing}
                      />
                    </div>
                  </div>

                  {enableMarketing && (
                    <Alert className="bg-primary/5 border-primary/20">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-xs md:text-sm">
                        We'll automatically create and send promotional campaigns to relevant 
                        audience segments based on location and artist preferences.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Event Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Event</div>
                        <div className="font-medium">{eventTitle || "Untitled Event"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Artist</div>
                        <div className="text-sm">{selectedArtist || "Not selected"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Date & Time</div>
                        <div className="text-sm">
                          {eventDate ? format(eventDate, "MMM d, yyyy") : "Not set"} at {eventTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Venue</div>
                        <div className="text-sm">
                          {selectedVenue === "Custom Venue" ? customVenueName : selectedVenue || "Not selected"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Capacity</div>
                        <div className="text-sm">
                          {capacity || selectedVenueData?.capacity?.toLocaleString() || "0"} attendees
                        </div>
                      </div>
                      {ticketPrice && (
                        <div>
                          <div className="text-xs text-muted-foreground">Ticket Price</div>
                          <div className="text-sm">${ticketPrice} {vipPrice && `/ $${vipPrice} VIP`}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {status.replace("_", " ")}
                        </Badge>
                      </div>
                      {enablePresale && presaleDate && (
                        <div>
                          <div className="text-xs text-muted-foreground">Presale</div>
                          <div className="text-sm">{format(presaleDate, "MMM d, yyyy")}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Event will appear in Content → Events</li>
                        <li>• Smart links will be generated automatically</li>
                        <li>• Marketing campaigns will be created</li>
                        <li>• Track sales in Analytics dashboard</li>
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
            {estimatedRevenue && parseInt(estimatedRevenue) > 0 && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                Est. Revenue: ${parseInt(estimatedRevenue).toLocaleString()}
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
                onClick={handleCreateEvent} 
                disabled={!canCreate}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Create Event</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}