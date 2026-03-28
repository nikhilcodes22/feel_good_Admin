import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SlidersHorizontal, Sparkles, RefreshCw } from "lucide-react";
import type { BoothPreference, WalkwayWidth } from "@/lib/layoutGenerator";

interface AdjustmentControlsProps {
  boothPreference: BoothPreference;
  walkwayWidth: WalkwayWidth;
  aiPrompt: string;
  onBoothPreferenceChange: (v: BoothPreference) => void;
  onWalkwayWidthChange: (v: WalkwayWidth) => void;
  onAIPromptChange: (v: string) => void;
  onRegenerate: () => void;
}

const AdjustmentControls = ({
  boothPreference,
  walkwayWidth,
  aiPrompt,
  onBoothPreferenceChange,
  onWalkwayWidthChange,
  onAIPromptChange,
  onRegenerate,
}: AdjustmentControlsProps) => {
  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Adjust Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Booth Preference</Label>
            <Select value={boothPreference} onValueChange={(v) => onBoothPreferenceChange(v as BoothPreference)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Small (3m×3m)</SelectItem>
                <SelectItem value="Medium">Medium (4.5m×4.5m)</SelectItem>
                <SelectItem value="Large">Large (6m×6m)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Walkway Width</Label>
            <Select value={String(walkwayWidth)} onValueChange={(v) => onWalkwayWidthChange(parseFloat(v) as WalkwayWidth)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">Narrow (1.5m)</SelectItem>
                <SelectItem value="2">Medium (2m)</SelectItem>
                <SelectItem value="3">Wide (3m)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onRegenerate} className="w-full" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Layout
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Describe what you want to improve, e.g. 'Add more premium booths' or 'Reduce congestion'"
            value={aiPrompt}
            onChange={(e) => onAIPromptChange(e.target.value)}
            rows={3}
          />
          <div className="flex flex-wrap gap-1.5">
            {["More premium booths", "Maximize capacity", "Spacious walkways"].map((hint) => (
              <button
                key={hint}
                onClick={() => onAIPromptChange(hint)}
                className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                {hint}
              </button>
            ))}
          </div>
          <Button onClick={onRegenerate} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Apply AI Suggestion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdjustmentControls;
