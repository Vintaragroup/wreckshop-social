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
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Download, 
  Users, 
  FileSpreadsheet, 
  FileText, 
  File,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Music,
  Activity
} from "lucide-react";

interface ProfileExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProfiles?: any[];
  totalProfiles?: number;
}

const exportFields = [
  {
    id: "basic",
    label: "Basic Information",
    description: "Name, email, phone, location",
    icon: Users,
    fields: ["name", "email", "phone", "location", "age"]
  },
  {
    id: "engagement",
    label: "Engagement Data",
    description: "Open rates, click rates, campaign interactions",
    icon: Activity,
    fields: ["openRate", "clickRate", "lastEngaged", "totalCampaigns"]
  },
  {
    id: "preferences",
    label: "Music Preferences",
    description: "Favorite artists, genres, listening habits",
    icon: Music,
    fields: ["favoriteArtists", "genres", "concertsAttended", "merchPurchases"]
  },
  {
    id: "social",
    label: "Social Platforms",
    description: "Platform handles and follower counts",
    icon: Mail,
    fields: ["platforms", "handles", "socialFollowers"]
  },
  {
    id: "dates",
    label: "Timeline Data",
    description: "Join date, last activity, important dates",
    icon: Calendar,
    fields: ["joinDate", "lastActivity", "birthDate"]
  }
];

const formatOptions = [
  {
    value: "csv",
    label: "CSV (Excel Compatible)",
    description: "Comma-separated values, opens in Excel",
    icon: FileSpreadsheet
  },
  {
    value: "xlsx",
    label: "Excel Spreadsheet",
    description: "Native Excel format with formatting",
    icon: FileSpreadsheet
  },
  {
    value: "pdf",
    label: "PDF Report",
    description: "Formatted report with profile summaries",
    icon: FileText
  },
  {
    value: "json",
    label: "JSON Data",
    description: "Machine-readable structured data",
    icon: File
  }
];

export function ProfileExportModal({ 
  open, 
  onOpenChange, 
  selectedProfiles = [], 
  totalProfiles = 0 
}: ProfileExportModalProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(["basic"]);
  const [format, setFormat] = useState("csv");
  const [exportScope, setExportScope] = useState<"selected" | "all">(
    selectedProfiles.length > 0 ? "selected" : "all"
  );

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleExport = () => {
    const exportData = {
      scope: exportScope,
      profiles: exportScope === "selected" ? selectedProfiles : null,
      fields: selectedFields,
      format: format,
      totalRecords: exportScope === "selected" ? selectedProfiles.length : totalProfiles
    };

    // In a real app, this would trigger the export process
    console.log("Exporting profiles:", exportData);
    
    // Simulate file download
    const fileName = `profiles_export_${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Downloading: ${fileName}`);
    
    onOpenChange(false);
  };

  const recordCount = exportScope === "selected" ? selectedProfiles.length : totalProfiles;
  const selectedFormat = formatOptions.find(f => f.value === format);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Audience Profiles</span>
          </DialogTitle>
          <DialogDescription>
            Choose what profile data to export and in which format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Scope */}
          <div>
            <Label className="text-base font-medium">Export Scope</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  exportScope === "all" ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setExportScope("all")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={exportScope === "all"}
                      onChange={() => setExportScope("all")}
                    />
                    <div>
                      <div className="font-medium">All Profiles</div>
                      <div className="text-sm text-muted-foreground">
                        Export all {totalProfiles} profiles
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  exportScope === "selected" ? 'ring-2 ring-primary bg-primary/5' : ''
                } ${selectedProfiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedProfiles.length > 0 && setExportScope("selected")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={exportScope === "selected"}
                      disabled={selectedProfiles.length === 0}
                      onChange={() => selectedProfiles.length > 0 && setExportScope("selected")}
                    />
                    <div>
                      <div className="font-medium">Selected Profiles</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedProfiles.length > 0 
                          ? `Export ${selectedProfiles.length} selected profiles`
                          : "No profiles selected"
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Profiles Preview */}
            {exportScope === "selected" && selectedProfiles.length > 0 && (
              <Card className="mt-3 bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-accent">Selected Profiles</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProfiles.slice(0, 5).map((profile, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {profile.name}
                          </Badge>
                        ))}
                        {selectedProfiles.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{selectedProfiles.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      {selectedProfiles.length} profiles
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Data Fields Selection */}
          <div>
            <Label className="text-base font-medium">Data Fields to Include</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select which profile information to include in your export
            </p>
            
            <div className="space-y-3">
              {exportFields.map((field) => {
                const Icon = field.icon;
                const isSelected = selectedFields.includes(field.id);
                
                return (
                  <Card 
                    key={field.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleFieldToggle(field.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleFieldToggle(field.id)}
                          className="mt-1"
                        />
                        <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium">{field.label}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {field.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {field.fields.slice(0, 4).map((fieldName) => (
                              <Badge key={fieldName} variant="secondary" className="text-xs">
                                {fieldName}
                              </Badge>
                            ))}
                            {field.fields.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{field.fields.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Format Selection */}
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {formatOptions.map((formatOption) => {
                const Icon = formatOption.icon;
                const isSelected = format === formatOption.value;
                
                return (
                  <Card 
                    key={formatOption.value}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setFormat(formatOption.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => setFormat(formatOption.value)}
                          className="mt-1"
                        />
                        <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{formatOption.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatOption.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Export Summary */}
          {selectedFields.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Summary</p>
                    <p className="text-sm text-muted-foreground">
                      {recordCount} profiles • {selectedFields.length} data sets • {selectedFormat?.label}
                    </p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    Ready to export
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={selectedFields.length === 0}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export {recordCount} Profiles</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}