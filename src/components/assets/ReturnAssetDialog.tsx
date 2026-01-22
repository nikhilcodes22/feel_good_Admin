import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw, Search, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Asset = Tables<"assets">;

interface ReturnAssetDialogProps {
  organizationId: string;
  onReturned: () => void;
}

export function ReturnAssetDialog({ organizationId, onReturned }: ReturnAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Returns
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Process Asset Returns</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <ReturnAssetForm
              organizationId={organizationId}
              onReturned={() => {
                onReturned();
                setOpen(false);
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Returns
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Asset Returns</DialogTitle>
        </DialogHeader>
        <ReturnAssetForm
          organizationId={organizationId}
          onReturned={() => {
            onReturned();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ReturnAssetFormProps {
  organizationId: string;
  onReturned: () => void;
}

function ReturnAssetForm({ organizationId, onReturned }: ReturnAssetFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lentAssets, setLentAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSelectedAssets([]);

    try {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("status", "lent_out")
        .ilike("lent_to_phone", `%${phoneNumber.trim()}%`);

      if (error) throw error;

      setLentAssets(data || []);
      if (data?.length === 0) {
        toast.info("No lent assets found for this phone number");
      }
    } catch (error: any) {
      toast.error("Failed to search assets: " + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAssets.length === lentAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(lentAssets.map((asset) => asset.id));
    }
  };

  const handleReturn = async () => {
    if (selectedAssets.length === 0) {
      toast.error("Please select at least one asset to return");
      return;
    }

    setIsReturning(true);

    try {
      const { error } = await supabase
        .from("assets")
        .update({
          status: "available",
          lent_to: null,
          lent_to_phone: null,
          lent_to_address: null,
          lent_date: null,
          expected_return_date: null,
          rent_amount: null,
          is_overdue: false,
        })
        .in("id", selectedAssets);

      if (error) throw error;

      toast.success(`${selectedAssets.length} asset(s) marked as returned`);
      onReturned();
    } catch (error: any) {
      toast.error("Failed to return assets: " + error.message);
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="phone" className="sr-only">
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="Enter borrower's phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {hasSearched && lentAssets.length > 0 && (
        <>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedAssets.length === lentAssets.length}
                onCheckedChange={toggleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Select All ({lentAssets.length} items)
              </Label>
            </div>
            {selectedAssets.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedAssets.length} selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto">
            {lentAssets.map((asset) => (
              <div
                key={asset.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedAssets.includes(asset.id)
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/50"
                }`}
                onClick={() => toggleAssetSelection(asset.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedAssets.includes(asset.id)}
                    onCheckedChange={() => toggleAssetSelection(asset.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {asset.image_url ? (
                        <img
                          src={asset.image_url}
                          alt={asset.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Lent to: {asset.lent_to}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                      {asset.lent_date && (
                        <p>Lent: {new Date(asset.lent_date).toLocaleDateString()}</p>
                      )}
                      {asset.expected_return_date && (
                        <p
                          className={
                            asset.is_overdue ? "text-destructive font-medium" : ""
                          }
                        >
                          Due: {new Date(asset.expected_return_date).toLocaleDateString()}
                          {asset.is_overdue && " (Overdue)"}
                        </p>
                      )}
                      {asset.rent_amount && (
                        <p>Rent: ${asset.rent_amount}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleReturn}
            disabled={selectedAssets.length === 0 || isReturning}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {isReturning
              ? "Processing..."
              : `Mark ${selectedAssets.length} Item(s) as Received`}
          </Button>
        </>
      )}

      {hasSearched && lentAssets.length === 0 && !isSearching && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No lent assets found for this phone number</p>
        </div>
      )}
    </div>
  );
}
