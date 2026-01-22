import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, ArrowLeft, Plus, Package, DollarSign, AlertCircle, Search,
  LayoutGrid, List, MoreVertical, Pencil, Trash2, HandCoins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CreateAssetDialog } from '@/components/assets/CreateAssetDialog';
import { EditAssetDialog } from '@/components/assets/EditAssetDialog';
import { DeleteAssetDialog } from '@/components/assets/DeleteAssetDialog';
import { LendAssetDialog } from '@/components/assets/LendAssetDialog';
import { ReturnAssetDialog } from '@/components/assets/ReturnAssetDialog';
import type { Tables } from '@/integrations/supabase/types';

type Asset = Tables<'assets'>;
type AssetCategory = Tables<'asset_categories'>;

const Assets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lendDialogOpen, setLendDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (memberError) throw memberError;
      setOrganizationId(memberData?.organization_id ?? null);

      const [assetsRes, categoriesRes] = await Promise.all([
        supabase.from('assets').select('*').order('created_at', { ascending: false }),
        supabase.from('asset_categories').select('*')
      ]);

      if (assetsRes.error) throw assetsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setAssets(assetsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || asset.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = assets.reduce((sum, asset) => sum + (Number(asset.current_value) || 0), 0);
  const lentOutCount = assets.filter(a => a.status === 'lent_out').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'lent_out':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'retired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditDialogOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleLend = (asset: Asset) => {
    setSelectedAsset(asset);
    setLendDialogOpen(true);
  };

  const handleAddAsset = () => {
    if (loading) return;
    if (!organizationId) {
      toast.error('Create an organization first', {
        description: 'You need an organization to add assets.'
      });
      navigate('/dashboard');
      return;
    }
    setCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Assets
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {organizationId && (
                <ReturnAssetDialog
                  organizationId={organizationId}
                  onReturned={fetchData}
                />
              )}

              <Button 
                onClick={handleAddAsset}
                disabled={loading}
                className="gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-display font-bold text-foreground">{assets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lent Out</p>
                <p className="text-2xl font-display font-bold text-foreground">{lentOutCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Assets View */}
        {loading ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-2"
          }>
            {[...Array(8)].map((_, i) => (
              viewMode === 'grid' ? (
                <div key={i} className="bg-card rounded-xl p-4 shadow-soft animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-5 bg-muted rounded mb-2 w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ) : (
                <div key={i} className="bg-card rounded-xl p-4 shadow-soft animate-pulse flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded mb-2 w-1/4" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                </div>
              )
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="bg-card rounded-xl p-12 shadow-soft text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              {assets.length === 0 ? 'No assets yet' : 'No matching assets'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {assets.length === 0 
                ? 'Add your first asset to get started tracking your inventory.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {assets.length === 0 && (
              <Button 
                onClick={handleAddAsset}
                disabled={loading}
                className="gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Asset
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all group"
              >
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {asset.image_url ? (
                    <img
                      src={asset.image_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <Badge className={`absolute top-3 left-3 ${getStatusColor(asset.status)}`}>
                    {asset.status.replace('_', ' ')}
                  </Badge>
                  
                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(asset)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLend(asset)}>
                        <HandCoins className="w-4 h-4 mr-2" />
                        {asset.status === 'lent_out' ? 'Manage Lending' : 'Lend'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(asset)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-1 truncate">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {getCategoryName(asset.category_id)}
                  </p>
                  {asset.current_value && (
                    <p className="text-sm font-medium text-primary">
                      ${Number(asset.current_value).toLocaleString()}
                    </p>
                  )}
                  {asset.status === 'lent_out' && asset.lent_to && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      Lent to: {asset.lent_to}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-card rounded-xl p-4 shadow-soft hover:shadow-medium transition-all flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {asset.image_url ? (
                    <img
                      src={asset.image_url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-foreground truncate">
                      {asset.name}
                    </h3>
                    <Badge className={`${getStatusColor(asset.status)} text-xs`}>
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryName(asset.category_id)}
                    {asset.current_value && (
                      <span className="ml-2 text-primary font-medium">
                        ${Number(asset.current_value).toLocaleString()}
                      </span>
                    )}
                  </p>
                  {asset.status === 'lent_out' && asset.lent_to && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Lent to: {asset.lent_to}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLend(asset)}
                    title={asset.status === 'lent_out' ? 'Manage Lending' : 'Lend'}
                  >
                    <HandCoins className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(asset)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(asset)}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      {organizationId && (
        <CreateAssetDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          categories={categories}
          organizationId={organizationId}
          onAssetCreated={fetchData}
        />
      )}

      {selectedAsset && (
        <>
          <EditAssetDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            asset={selectedAsset}
            categories={categories}
            onAssetUpdated={fetchData}
          />
          <DeleteAssetDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            asset={selectedAsset}
            onAssetDeleted={fetchData}
          />
          <LendAssetDialog
            open={lendDialogOpen}
            onOpenChange={setLendDialogOpen}
            asset={selectedAsset}
            onAssetUpdated={fetchData}
          />
        </>
      )}
    </div>
  );
};

export default Assets;
