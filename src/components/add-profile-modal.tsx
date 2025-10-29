import { useState } from "react";
import {
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Instagram,
  Youtube,
  Music,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "tiktok", label: "TikTok", icon: Music },
  { value: "spotify", label: "Spotify", icon: Music },
];

const genreOptions = [
  "Hip Hop",
  "R&B",
  "Pop",
  "Rock",
  "Country",
  "Electronic",
  "Jazz",
  "Classical",
  "Alternative",
  "Indie"
];

const artistOptions = [
  "Travis Scott",
  "Don Toliver",
  "Sheck Wes",
  "Maxo Kream",
  "Teezo Touchdown",
  "SZA",
  "Kendrick Lamar",
  "Drake",
  "Future",
  "21 Savage"
];

export function AddProfileModal({ isOpen, onClose }: AddProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    platforms: [] as string[],
    favoriteArtists: [] as string[],
    genres: [] as string[],
    bio: "",
    consent: {
      email: false,
      sms: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Here you would typically send the data to your backend
      console.log("Profile data:", formData);
      
      // Reset form and close modal
      setFormData({
        name: "",
        handle: "",
        email: "",
        phone: "",
        location: "",
        age: "",
        platforms: [],
        favoriteArtists: [],
        genres: [],
        bio: "",
        consent: { email: false, sms: false }
      });
      setErrors({});
      onClose();
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const toggleArtist = (artist: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteArtists: prev.favoriteArtists.includes(artist)
        ? prev.favoriteArtists.filter(a => a !== artist)
        : [...prev.favoriteArtists, artist]
    }));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Add New Profile</span>
          </DialogTitle>
          <DialogDescription>
            Add a new audience member with their contact information and preferences
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sarah Johnson"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handle">Social Handle</Label>
                  <Input
                    id="handle"
                    value={formData.handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="e.g., @sarahj_music"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="sarah.johnson@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (713) 555-0123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Houston, TX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="24"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about this fan..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platformOptions.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = formData.platforms.includes(platform.value);
                  return (
                    <Button
                      key={platform.value}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => togglePlatform(platform.value)}
                      className="h-auto p-3 flex flex-col items-center space-y-2"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{platform.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Music Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Music Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Favorite Artists</Label>
                <div className="flex flex-wrap gap-2">
                  {artistOptions.map((artist) => {
                    const isSelected = formData.favoriteArtists.includes(artist);
                    return (
                      <Badge
                        key={artist}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleArtist(artist)}
                      >
                        {artist}
                        {isSelected && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Favorite Genres</Label>
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((genre) => {
                    const isSelected = formData.genres.includes(genre);
                    return (
                      <Badge
                        key={genre}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                        {isSelected && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communication Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-consent">Email Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow this contact to receive email campaigns
                  </p>
                </div>
                <Switch
                  id="email-consent"
                  checked={formData.consent.email}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      consent: { ...prev.consent, email: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sms-consent">SMS Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow this contact to receive SMS campaigns
                  </p>
                </div>
                <Switch
                  id="sms-consent"
                  checked={formData.consent.sms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      consent: { ...prev.consent, sms: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}