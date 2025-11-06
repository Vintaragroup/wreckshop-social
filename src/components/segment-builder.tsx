import { useState } from "react";
import {
  Plus,
  X,
  Save,
  Play,
  Users,
  Filter,
  Copy,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { SaveSegmentModal } from "./save-segment-modal";
import { toast } from "sonner";

interface SegmentRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: "AND" | "OR";
}

interface SegmentGroup {
  id: string;
  rules: SegmentRule[];
  connector?: "AND" | "OR";
}

const fieldOptions = [
  { value: "platform", label: "Platform" },
  { value: "follows_artist", label: "Follows Artist" },
  { value: "genre", label: "Genre Preference" },
  { value: "location", label: "Location" },
  { value: "engagement", label: "Engagement Score" },
  { value: "last_activity", label: "Last Activity" },
  { value: "device", label: "Device Type" },
  { value: "age", label: "Age" },
  { value: "email_opens", label: "Email Opens" },
  { value: "sms_clicks", label: "SMS Clicks" },
  { value: "stream_count", label: "Stream Count" },
];

const operatorOptions = {
  platform: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
  ],
  follows_artist: [
    { value: "includes", label: "includes" },
    { value: "excludes", label: "excludes" },
  ],
  genre: [
    { value: "includes", label: "includes" },
    { value: "excludes", label: "excludes" },
  ],
  location: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "contains", label: "contains" },
  ],
  engagement: [
    { value: "greater_than", label: "greater than" },
    { value: "less_than", label: "less than" },
    { value: "equal", label: "equal to" },
  ],
  last_activity: [
    { value: "within", label: "within last" },
    { value: "more_than", label: "more than" },
  ],
  default: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "greater_than", label: "greater than" },
    { value: "less_than", label: "less than" },
  ],
};

const existingSegments = [
  {
    id: 1,
    name: "Travis Scott Superfans",
    description: "High engagement fans who frequently interact with Travis Scott content",
    size: 15230,
    lastUpdated: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Houston Locals",
    description: "Fans based in Houston metropolitan area",
    size: 8920,
    lastUpdated: "1 day ago",
    status: "active",
  },
  {
    id: 3,
    name: "New Subscribers",
    description: "Users who joined in the last 30 days",
    size: 3450,
    lastUpdated: "5 hours ago",
    status: "active",
  },
  {
    id: 4,
    name: "VIP Customers",
    description: "High-value customers with multiple purchases",
    size: 1240,
    lastUpdated: "3 days ago",
    status: "draft",
  },
];

interface SegmentBuilderProps {
  onPageChange?: (page: string) => void;
}

export function SegmentBuilder({ onPageChange }: SegmentBuilderProps = {}) {
  const [segmentName, setSegmentName] = useState("");
  const [segmentDescription, setSegmentDescription] = useState("");
  const [groups, setGroups] = useState<SegmentGroup[]>([
    {
      id: "1",
      rules: [
        {
          id: "1",
          field: "",
          operator: "",
          value: "",
        },
      ],
    },
  ]);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const addRule = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? {
            ...group,
            rules: [
              ...group.rules,
              {
                id: Date.now().toString(),
                field: "",
                operator: "",
                value: "",
                connector: "AND",
              },
            ],
          }
        : group
    ));
  };

  const removeRule = (groupId: string, ruleId: string) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            rules: group.rules.filter(rule => rule.id !== ruleId),
          }
        : group
    ));
  };

  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: Date.now().toString(),
        rules: [
          {
            id: Date.now().toString(),
            field: "",
            operator: "",
            value: "",
          },
        ],
        connector: "OR",
      },
    ]);
  };

  const updateRule = (groupId: string, ruleId: string, field: keyof SegmentRule, value: string) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            rules: group.rules.map(rule =>
              rule.id === ruleId ? { ...rule, [field]: value } : rule
            ),
          }
        : group
    ));
  };

  const getOperators = (field: string) => {
    return operatorOptions[field as keyof typeof operatorOptions] || operatorOptions.default;
  };

  const calculateEstimatedSize = () => {
    // Mock calculation based on rules
    const baseSize = 25000;
    const ruleCount = groups.reduce((total, group) => total + group.rules.length, 0);
    return Math.max(100, Math.floor(baseSize * (0.8 ** ruleCount)));
  };

  const handleSaveSegment = () => {
    // Validate segment has a name
    if (!segmentName.trim()) {
      toast.error("Please enter a segment name");
      return;
    }

    // Validate at least one rule exists
    const hasRules = groups.some((g) => g.rules.some((r) => r.field && r.operator && r.value));
    if (!hasRules) {
      toast.error("Please add at least one filter rule");
      return;
    }

    // Show save modal
    setShowSaveModal(true);
  };

  const handleSegmentSaved = (segment: any) => {
    // Reset form after successful save
    setShowBuilder(false);
    setSegmentName("");
    setSegmentDescription("");
    setGroups([{
      id: "1",
      rules: [{ id: "1", field: "", operator: "", value: "" }],
    }]);
    
    // Optionally navigate to segments list
    onPageChange?.("segments");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.("audience")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to Audience Overview</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Segment Builder</h1>
            <p className="text-muted-foreground">
              Create targeted audience segments with advanced filtering
            </p>
          </div>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Segment
        </Button>
      </div>

      {/* Segment Builder Modal/Panel */}
      {showBuilder && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Segment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="segment-name">Segment Name</Label>
                <Input
                  id="segment-name"
                  placeholder="e.g., High Engagement Fans"
                  value={segmentName}
                  onChange={(e) => setSegmentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segment-description">Description</Label>
                <Input
                  id="segment-description"
                  placeholder="Brief description of this segment"
                  value={segmentDescription}
                  onChange={(e) => setSegmentDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Rule Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Segment Rules</h3>
                <div className="text-sm text-muted-foreground">
                  Estimated size: <span className="font-medium text-foreground">{calculateEstimatedSize().toLocaleString()}</span> profiles
                </div>
              </div>

              {groups.map((group, groupIndex) => (
                <div key={group.id} className="space-y-3">
                  {groupIndex > 0 && (
                    <div className="flex items-center justify-center">
                      <Badge variant="outline" className="px-3 py-1">
                        OR
                      </Badge>
                    </div>
                  )}
                  
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    {group.rules.map((rule, ruleIndex) => (
                      <div key={rule.id} className="space-y-3">
                        {ruleIndex > 0 && (
                          <div className="flex items-center">
                            <Badge variant="secondary" className="text-xs">
                              AND
                            </Badge>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                          <div className="space-y-2">
                            <Label>Field</Label>
                            <Select
                              value={rule.field}
                              onValueChange={(value) => updateRule(group.id, rule.id, "field", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Operator</Label>
                            <Select
                              value={rule.operator}
                              onValueChange={(value) => updateRule(group.id, rule.id, "operator", value)}
                              disabled={!rule.field}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {getOperators(rule.field).map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Value</Label>
                            <Input
                              placeholder="Enter value"
                              value={rule.value}
                              onChange={(e) => updateRule(group.id, rule.id, "value", e.target.value)}
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addRule(group.id)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            {group.rules.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeRule(group.id, rule.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addGroup}>
                <Plus className="w-4 h-4 mr-2" />
                Add OR Group
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowBuilder(false)}>
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSaveSegment}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Segment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Segment Modal */}
      <SaveSegmentModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        segmentName={segmentName}
        segmentDescription={segmentDescription}
        groups={groups}
        estimatedSize={calculateEstimatedSize()}
        onSaved={handleSegmentSaved}
      />

      {/* Existing Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Saved Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {segment.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {segment.size.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={segment.status === "active" ? "default" : "secondary"}
                    >
                      {segment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {segment.lastUpdated}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Filter className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}