import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import type { EventType, Priority } from "@/lib/layoutGenerator";

interface SpaceInputFormProps {
  onGenerate: (data: {
    length: number;
    width: number;
    eventType: EventType;
    priority: Priority;
  }) => void;
  isGenerating: boolean;
}

const SpaceInputForm = ({ onGenerate, isGenerating }: SpaceInputFormProps) => {
  const [length, setLength] = useState<string>("30");
  const [width, setWidth] = useState<string>("20");
  const [eventType, setEventType] = useState<EventType>("Exhibition");
  const [priority, setPriority] = useState<Priority>("Balanced Layout");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (l > 0 && w > 0) {
      onGenerate({ length: l, width: w, eventType, priority });
    }
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Space Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (meters)</Label>
              <Input
                id="length"
                type="number"
                min="5"
                max="500"
                step="0.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (meters)</Label>
              <Input
                id="width"
                type="number"
                min="5"
                max="500"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g. 20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Exhibition">Exhibition</SelectItem>
                <SelectItem value="Job Fair">Job Fair</SelectItem>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Max Booth Count">Max Booth Count</SelectItem>
                <SelectItem value="Premium Experience">Premium Experience</SelectItem>
                <SelectItem value="Balanced Layout">Balanced Layout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Layouts"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SpaceInputForm;
