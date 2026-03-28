import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import SpaceInputForm from "@/components/space/SpaceInputForm";
import LayoutVisualization from "@/components/space/LayoutVisualization";
import AdjustmentControls from "@/components/space/AdjustmentControls";
import {
  generateLayouts,
  type BoothLayout,
  type EventType,
  type Priority,
  type BoothPreference,
  type WalkwayWidth,
} from "@/lib/layoutGenerator";

const SpaceManagement = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<BoothLayout[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Persist form values for regeneration
  const [formData, setFormData] = useState<{
    length: number;
    width: number;
    eventType: EventType;
    priority: Priority;
  } | null>(null);

  const [boothPreference, setBoothPreference] = useState<BoothPreference>("Small");
  const [walkwayWidth, setWalkwayWidth] = useState<WalkwayWidth>(2);
  const [aiPrompt, setAIPrompt] = useState("");

  const handleGenerate = (data: {
    length: number;
    width: number;
    eventType: EventType;
    priority: Priority;
  }) => {
    setIsGenerating(true);
    setFormData(data);
    setTimeout(() => {
      const result = generateLayouts({
        ...data,
        walkwayWidth,
        boothPreference,
        aiKeywords: aiPrompt ? aiPrompt.split(" ") : undefined,
      });
      setLayouts(result);
      setSelectedIndex(0);
      setIsGenerating(false);
    }, 400);
  };

  const handleRegenerate = () => {
    if (!formData) return;
    handleGenerate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">SpaceBooth AI</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left sidebar */}
          <div className="space-y-4">
            <SpaceInputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            {layouts.length > 0 && (
              <AdjustmentControls
                boothPreference={boothPreference}
                walkwayWidth={walkwayWidth}
                aiPrompt={aiPrompt}
                onBoothPreferenceChange={setBoothPreference}
                onWalkwayWidthChange={setWalkwayWidth}
                onAIPromptChange={setAIPrompt}
                onRegenerate={handleRegenerate}
              />
            )}
          </div>

          {/* Main content */}
          <div>
            {layouts.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 text-center">
                <LayoutGrid className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <h2 className="text-lg font-semibold text-foreground">No layouts generated yet</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Configure your space dimensions and preferences, then click "Generate Layouts" to see booth options.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {layouts.map((layout, i) => (
                  <LayoutVisualization
                    key={`${layout.type}-${i}`}
                    layout={layout}
                    isSelected={selectedIndex === i}
                    onSelect={() => setSelectedIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpaceManagement;
