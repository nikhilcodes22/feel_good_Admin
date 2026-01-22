import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, HandCoins } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Tables } from '@/integrations/supabase/types';

type Asset = Tables<'assets'>;

const lendSchema = z.object({
  lent_to: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  lent_to_phone: z.string().max(20, 'Phone number is too long').optional(),
  lent_to_address: z.string().max(300, 'Address is too long').optional(),
  lent_date: z.string().min(1, 'Issue date is required'),
  expected_return_date: z.string().optional(),
  rent_amount: z.string().optional(),
  is_overdue: z.boolean().default(false),
});

type LendFormData = z.infer<typeof lendSchema>;

interface LendAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset;
  onAssetUpdated: () => void;
}

export function LendAssetDialog({
  open,
  onOpenChange,
  asset,
  onAssetUpdated,
}: LendAssetDialogProps) {
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadyLent = asset.status === 'lent_out';

  const form = useForm<LendFormData>({
    resolver: zodResolver(lendSchema),
    defaultValues: {
      lent_to: asset.lent_to || '',
      lent_to_phone: (asset as any).lent_to_phone || '',
      lent_to_address: (asset as any).lent_to_address || '',
      lent_date: asset.lent_date || new Date().toISOString().split('T')[0],
      expected_return_date: asset.expected_return_date || '',
      rent_amount: (asset as any).rent_amount?.toString() || '',
      is_overdue: (asset as any).is_overdue || false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        lent_to: asset.lent_to || '',
        lent_to_phone: (asset as any).lent_to_phone || '',
        lent_to_address: (asset as any).lent_to_address || '',
        lent_date: asset.lent_date || new Date().toISOString().split('T')[0],
        expected_return_date: asset.expected_return_date || '',
        rent_amount: (asset as any).rent_amount?.toString() || '',
        is_overdue: (asset as any).is_overdue || false,
      });
    }
  }, [open, asset]);

  const onSubmit = async (data: LendFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('assets')
        .update({
          status: 'lent_out',
          lent_to: data.lent_to,
          lent_to_phone: data.lent_to_phone || null,
          lent_to_address: data.lent_to_address || null,
          lent_date: data.lent_date,
          expected_return_date: data.expected_return_date || null,
          rent_amount: data.rent_amount ? parseFloat(data.rent_amount) : null,
          is_overdue: data.is_overdue,
        })
        .eq('id', asset.id);

      if (error) throw error;

      toast.success(isAlreadyLent ? 'Lending details updated' : 'Asset issued successfully');
      onOpenChange(false);
      onAssetUpdated();
    } catch (error: any) {
      console.error('Error lending asset:', error);
      toast.error(error.message || 'Failed to issue asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('assets')
        .update({
          status: 'available',
          lent_to: null,
          lent_to_phone: null,
          lent_to_address: null,
          lent_date: null,
          expected_return_date: null,
          rent_amount: null,
          is_overdue: false,
        })
        .eq('id', asset.id);

      if (error) throw error;

      toast.success('Asset marked as returned');
      onOpenChange(false);
      onAssetUpdated();
    } catch (error: any) {
      console.error('Error returning asset:', error);
      toast.error(error.message || 'Failed to return asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }
    handleClose();
  };

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <HandCoins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{asset.name}</p>
            <p className="text-sm text-muted-foreground">
              {isAlreadyLent ? 'Currently lent out' : 'Available for lending'}
            </p>
          </div>
        </div>

        {/* Lent To */}
        <FormField
          control={form.control}
          name="lent_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued To *</FormLabel>
              <FormControl>
                <Input placeholder="Person's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="lent_to_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 234 567 8900" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="lent_to_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full address"
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lent_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expected_return_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rent Amount */}
        <FormField
          control={form.control}
          name="rent_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent Amount (If any)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Overdue Status */}
        <FormField
          control={form.control}
          name="is_overdue"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Overdue</FormLabel>
                <FormDescription className="text-xs">
                  Mark if the return is overdue
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          {isAlreadyLent && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReturn}
              disabled={isSubmitting}
              className="flex-1"
            >
              Mark Returned
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className={isAlreadyLent ? '' : 'flex-1'}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 gradient-primary border-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isAlreadyLent ? 'Updating...' : 'Issuing...'}
              </>
            ) : (
              isAlreadyLent ? 'Update' : 'Issue Asset'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{isAlreadyLent ? 'Manage Lending' : 'Lend Asset'}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">{FormContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isAlreadyLent ? 'Manage Lending' : 'Lend Asset'}</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  );
}
