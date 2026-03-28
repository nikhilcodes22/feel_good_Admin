import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import type { BoothLayout } from "@/lib/layoutGenerator";

interface LayoutVisualizationProps {
  layout: BoothLayout;
  isSelected: boolean;
  onSelect: () => void;
}

const LayoutVisualization = ({ layout, isSelected, onSelect }: LayoutVisualizationProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const scale = 8; // pixels per meter

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!gridRef.current) return;
    const canvas = await html2canvas(gridRef.current, { backgroundColor: "#1a1a2e" });
    const link = document.createElement("a");
    link.download = `${layout.label}-layout.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary border-primary" : "border-border/50"
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{layout.label}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={layout.type === "max" ? "default" : layout.type === "premium" ? "secondary" : "outline"}>
              {layout.totalBooths} booths
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleExport} title="Export as PNG">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={gridRef}
          className="relative rounded-md border border-border/30 bg-muted/30 overflow-hidden"
          style={{
            width: layout.spaceWidth * scale,
            height: layout.spaceLength * scale,
            maxWidth: "100%",
            aspectRatio: `${layout.spaceWidth} / ${layout.spaceLength}`,
          }}
        >
          {/* Scale the booths to fit container */}
          <svg
            viewBox={`0 0 ${layout.spaceWidth} ${layout.spaceLength}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {layout.booths.map((booth, i) => (
              <rect
                key={i}
                x={booth.x}
                y={booth.y}
                width={booth.width}
                height={booth.height}
                rx={0.3}
                className={booth.size === "small" ? "fill-sky-400/70" : "fill-blue-700/80"}
                stroke="hsl(var(--border))"
                strokeWidth={0.15}
              />
            ))}
          </svg>
        </div>

        {/* Summary */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <div className="font-semibold text-foreground">{layout.totalBooths}</div>
            <div className="text-muted-foreground">Booths</div>
          </div>
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <div className="font-semibold text-foreground">{layout.boothSizes.join(", ")}</div>
            <div className="text-muted-foreground">Sizes</div>
          </div>
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <div className="font-semibold text-foreground">{layout.spaceUtilization}%</div>
            <div className="text-muted-foreground">Utilization</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutVisualization;
