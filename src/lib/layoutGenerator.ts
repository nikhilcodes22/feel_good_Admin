export interface BoothLayout {
  type: "max" | "premium" | "balanced";
  label: string;
  booths: Booth[];
  rows: number;
  cols: number;
  totalBooths: number;
  boothSizes: string[];
  spaceUtilization: number;
  spaceWidth: number;
  spaceLength: number;
}

export interface Booth {
  x: number;
  y: number;
  width: number;
  height: number;
  size: "small" | "large";
}

export type EventType = "Exhibition" | "Job Fair" | "NGO" | "Retail";
export type Priority = "Max Booth Count" | "Premium Experience" | "Balanced Layout";
export type BoothPreference = "Small" | "Medium" | "Large";
export type WalkwayWidth = 1.5 | 2 | 3;

interface GenerateOptions {
  length: number;
  width: number;
  eventType: EventType;
  priority: Priority;
  walkwayWidth?: WalkwayWidth;
  boothPreference?: BoothPreference;
  aiKeywords?: string[];
}

function generateGridLayout(
  spaceLength: number,
  spaceWidth: number,
  boothW: number,
  boothH: number,
  walkway: number
): Booth[] {
  const booths: Booth[] = [];
  const cellW = boothW + walkway;
  const cellH = boothH + walkway;
  const cols = Math.floor((spaceWidth - walkway) / cellW);
  const rows = Math.floor((spaceLength - walkway) / cellH);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      booths.push({
        x: walkway + c * cellW,
        y: walkway + r * cellH,
        width: boothW,
        height: boothH,
        size: boothW <= 3 ? "small" : "large",
      });
    }
  }
  return booths;
}

function calcUtilization(booths: Booth[], totalArea: number): number {
  const boothArea = booths.reduce((sum, b) => sum + b.width * b.height, 0);
  return Math.round((boothArea / totalArea) * 100);
}

function applyAIKeywords(opts: GenerateOptions): GenerateOptions {
  const modified = { ...opts };
  if (!opts.aiKeywords) return modified;
  const text = opts.aiKeywords.join(" ").toLowerCase();
  if (text.includes("premium") || text.includes("luxury")) {
    modified.boothPreference = "Large";
  }
  if (text.includes("more booths") || text.includes("maximize")) {
    modified.boothPreference = "Small";
  }
  if (text.includes("spacious") || text.includes("wide") || text.includes("congestion")) {
    modified.walkwayWidth = 3;
  }
  if (text.includes("compact") || text.includes("narrow")) {
    modified.walkwayWidth = 1.5;
  }
  return modified;
}

function getBoothSize(preference?: BoothPreference): number {
  switch (preference) {
    case "Small": return 3;
    case "Large": return 6;
    case "Medium": return 4.5;
    default: return 3;
  }
}

export function generateLayouts(options: GenerateOptions): BoothLayout[] {
  const opts = applyAIKeywords(options);
  const { length, width } = opts;
  const walkway = opts.walkwayWidth ?? 2;
  const totalArea = length * width;

  // Max layout
  const smallSize = opts.boothPreference ? getBoothSize(opts.boothPreference) : 3;
  const maxBooths = generateGridLayout(length, width, smallSize, smallSize, walkway);
  const maxLayout: BoothLayout = {
    type: "max",
    label: "High Capacity",
    booths: maxBooths,
    rows: Math.floor((length - walkway) / (smallSize + walkway)),
    cols: Math.floor((width - walkway) / (smallSize + walkway)),
    totalBooths: maxBooths.length,
    boothSizes: [`${smallSize}m × ${smallSize}m`],
    spaceUtilization: calcUtilization(maxBooths, totalArea),
    spaceWidth: width,
    spaceLength: length,
  };

  // Premium layout
  const largeSize = opts.boothPreference ? Math.max(getBoothSize(opts.boothPreference), 5) : 6;
  const premiumWalkway = walkway + 0.5;
  const premBooths = generateGridLayout(length, width, largeSize, largeSize, premiumWalkway);
  const premLayout: BoothLayout = {
    type: "premium",
    label: "Premium",
    booths: premBooths,
    rows: Math.floor((length - premiumWalkway) / (largeSize + premiumWalkway)),
    cols: Math.floor((width - premiumWalkway) / (largeSize + premiumWalkway)),
    totalBooths: premBooths.length,
    boothSizes: [`${largeSize}m × ${largeSize}m`],
    spaceUtilization: calcUtilization(premBooths, totalArea),
    spaceWidth: width,
    spaceLength: length,
  };

  // Balanced layout - mix of small and large
  const balBooths: Booth[] = [];
  const balSmall = 3;
  const balLarge = 6;
  const cellSmall = balSmall + walkway;
  const cellLarge = balLarge + walkway;
  const totalRows = Math.floor((length - walkway) / cellSmall);
  const totalCols = Math.floor((width - walkway) / cellSmall);

  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const x = walkway + c * cellSmall;
      const y = walkway + r * cellSmall;
      // Every other row+col intersection gets a large booth (if fits)
      if (r % 3 === 0 && c % 2 === 0 && c + 1 < totalCols && r + 1 < totalRows) {
        if (x + balLarge <= width && y + balLarge <= length) {
          balBooths.push({ x, y, width: balLarge, height: balLarge, size: "large" });
          // skip cells occupied by large booth handled by overlap check
        }
      } else {
        // Check no overlap with large booths
        const overlaps = balBooths.some(
          (b) =>
            b.size === "large" &&
            x < b.x + b.width &&
            x + balSmall > b.x &&
            y < b.y + b.height &&
            y + balSmall > b.y
        );
        if (!overlaps && x + balSmall <= width && y + balSmall <= length) {
          balBooths.push({ x, y, width: balSmall, height: balSmall, size: "small" });
        }
      }
    }
  }

  const balLayout: BoothLayout = {
    type: "balanced",
    label: "Balanced",
    booths: balBooths,
    rows: totalRows,
    cols: totalCols,
    totalBooths: balBooths.length,
    boothSizes: [`${balSmall}m × ${balSmall}m`, `${balLarge}m × ${balLarge}m`],
    spaceUtilization: calcUtilization(balBooths, totalArea),
    spaceWidth: width,
    spaceLength: length,
  };

  return [maxLayout, premLayout, balLayout];
}
