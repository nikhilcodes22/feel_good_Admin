import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Asset = Tables<'assets'>;

interface DeleteAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset;
  onAssetDeleted: () => void;
}

export function DeleteAssetDialog({
  open,
  onOpenChange,
  asset,
  onAssetDeleted,
}: DeleteAssetDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete the image from storage if it exists
      if (asset.image_url) {
        const urlParts = asset.image_url.split('/');
        const filePath = urlParts.slice(-2).join('/');
        await supabase.storage.from('assets').remove([filePath]);
      }

      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', asset.id);

      if (error) throw error;

      toast.success('Asset deleted successfully');
      onOpenChange(false);
      onAssetDeleted();
    } catch (error: any) {
      console.error('Error deleting asset:', error);
      toast.error(error.message || 'Failed to delete asset');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Are you sure you want to delete <strong>"{asset.name}"</strong>? This action cannot be undone and will permanently remove the asset and its image from your inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Asset'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
