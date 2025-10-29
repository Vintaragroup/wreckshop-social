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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Download, Database, Calendar, Users, FileSpreadsheet, FileJson } from "lucide-react";

interface ExportDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const exportOptions = [
  {
    id: "audience-profiles",
    label: "Audience Profiles",
    description: "Fan demographics, engagement data, and contact information",
    icon: Users,
    size: "~2.4MB",
  },
  {
    id: "engagement-metrics",
    label: "Engagement Metrics",
    description: "Click rates, opens, plays, and interaction data",
    icon: Database,
    size: "~1.8MB",
  },
  {
    id: "campaign-performance",
    label: "Campaign Performance",
    description: "Email, SMS, and journey campaign analytics",
    icon: Calendar,
    size: "~650KB",
  },
];

export function ExportDataModal({ open, onOpenChange }: ExportDataModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("30d");
  const [format, setFormat] = useState("csv");

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = () => {
    // In a real app, this would trigger the export process
    console.log("Exporting data:", { selectedOptions, dateRange, format });
    onOpenChange(false);
  };

  const totalSize = selectedOptions.reduce((total, optionId) => {
    const option = exportOptions.find(opt => opt.id === optionId);
    if (!option) return total;
    const sizeNum = parseFloat(option.size.replace(/[^\d.]/g, ""));
    const unit = option.size.includes("MB") ? 1000 : 1;
    return total + (sizeNum * unit);
  }, 0);

  const formatSize = (size: number) => {
    return size >= 1000 ? `${(size / 1000).toFixed(1)}MB` : `${size}KB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </DialogTitle>
          <DialogDescription>
            Export your audience and campaign data for analysis or backup purposes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Selection */}
          <div>
            <Label className="text-base font-medium">Select Data to Export</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which data sets you want to include in your export
            </p>
            
            <div className="space-y-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOptions.includes(option.id);
                
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleOptionToggle(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleOptionToggle(option.id)}
                          className="mt-1"
                        />
                        <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{option.label}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {option.size}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>File Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>CSV</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center space-x-2">
                      <FileJson className="w-4 h-4" />
                      <span>JSON</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Summary */}
          {selectedOptions.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Summary</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOptions.length} data set{selectedOptions.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">
                    ~{formatSize(totalSize)}
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
            disabled={selectedOptions.length === 0}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}