import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, IntakeItem } from '../types';
import {
  Search,
  Filter,
  Plus,
  Check,
  Package,
  Layers,
  Info,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ProductCatalogProps {
  onAddToIntake: (item: Omit<IntakeItem, 'id' | 'totalPrice' | 'totalWeightKg'>) => void;
  onNavigateTab: (tab: 'voice' | 'catalog' | 'intake' | 'orders') => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onAddToIntake,
  onNavigateTab
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFinish, setSelectedFinish] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedIntendedUse, setSelectedIntendedUse] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductSpec, setSelectedProductSpec] = useState<Product | null>(null);

  // Per-product selected finish and quantity state
  const [itemSelections, setItemSelections] = useState<Record<string, { finish: string; qty: number }>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Hinges',
    'Drawer Slides',
    'Brackets & Connectors',
    'Nails & Screws',
    'Pins & Inserts',
    'Structural Fasteners'
  ];

  const finishes = ['All', 'Satin Nickel', 'Zinc Coated', 'Polished Brass', 'Matte Black Anodized', 'Natural Wood', 'Raw Steel'];
  const materials = ['All', 'Cold-Rolled Steel', 'Zinc Alloy', 'Stainless Steel 304', 'Galvanized Steel', 'Hardened Steel', 'Beechwood'];
  const intendedUses = ['All', 'Cabinetry & Casegoods', 'Heavy-Duty Doors', 'Tables & Frames', 'Flat-Pack Assembly', 'Trim & Molding'];
  const sizes = ['All', 'Small (<50mm)', 'Medium (50-200mm)', 'Large (>200mm)'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedFinish, selectedMaterial, selectedIntendedUse, selectedSize, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedFinish !== 'All') params.append('finish', selectedFinish);
      if (selectedMaterial !== 'All') params.append('material', selectedMaterial);
      if (selectedIntendedUse !== 'All') params.append('intendedUse', selectedIntendedUse);
      if (selectedSize !== 'All') params.append('sizeCategory', selectedSize);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);

      // Initialize selection defaults
      const defaults: Record<string, { finish: string; qty: number }> = {};
      (data.products || []).forEach((p: Product) => {
        defaults[p.id] = {
          finish: p.finishOptions[0] || 'Standard',
          qty: 1
        };
      });
      setItemSelections(prev => ({ ...defaults, ...prev }));
    } catch (err) {
      console.error('Error fetching catalog products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (productId: string, qty: number) => {
    setItemSelections(prev => ({
      ...prev,
      [productId]: {
        finish: prev[productId]?.finish || 'Standard',
        qty: Math.max(1, qty)
      }
    }));
  };

  const handleFinishChange = (productId: string, finish: string) => {
    setItemSelections(prev => ({
      ...prev,
      [productId]: {
        finish,
        qty: prev[productId]?.qty || 1
      }
    }));
  };

  const handleAdd = (product: Product) => {
    const selection = itemSelections[product.id] || {
      finish: product.finishOptions[0] || 'Standard',
      qty: 1
    };

    // Calculate volume tier price
    let unitPrice = product.baseUnitPrice;
    const tier = [...product.tierPricing].reverse().find(t => selection.qty >= t.minQty);
    if (tier) {
      unitPrice = tier.unitPrice;
    }

    onAddToIntake({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      unitOfMeasure: product.unitOfMeasure,
      selectedFinish: selection.finish,
      quantity: selection.qty,
      unitPrice
    });

    setAddedNotice(`Added ${selection.qty}x ${product.name} to intake list`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs border border-slate-800 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {addedNotice}
        </div>
      )}

      {/* Catalog Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-700" /> Commercial Hardware Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Furniture assembly hinges, full-extension slides, structural fasteners, nails & joinery pins
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('voice')}
          className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          Need help? Ask AI Voice Agent
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Keyword Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, name, or spec (hinges, nails, M4x30)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Attribute Dropdowns Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            {/* Finish Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 mb-0.5">Finish</label>
              <select
                value={selectedFinish}
                onChange={e => setSelectedFinish(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {finishes.map(f => (
                  <option key={f} value={f}>
                    {f === 'All' ? 'All Finishes' : f}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 mb-0.5">Material</label>
              <select
                value={selectedMaterial}
                onChange={e => setSelectedMaterial(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {materials.map(m => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Materials' : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Intended Use Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 mb-0.5">Intended Use</label>
              <select
                value={selectedIntendedUse}
                onChange={e => setSelectedIntendedUse(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {intendedUses.map(u => (
                  <option key={u} value={u}>
                    {u === 'All' ? 'All Applications' : u}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 mb-0.5">Size / Dimensions</label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {sizes.map(s => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All Sizes' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills & Reset Button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'All' ||
            selectedFinish !== 'All' ||
            selectedMaterial !== 'All' ||
            selectedIntendedUse !== 'All' ||
            selectedSize !== 'All' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedFinish('All');
                setSelectedMaterial('All');
                setSelectedIntendedUse('All');
                setSelectedSize('All');
                setSearchQuery('');
              }}
              className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-rose-200 transition-all shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading hardware database catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-2 shadow-sm">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No hardware components found</h3>
          <p className="text-xs">Try clearing search filters or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const currentSel = itemSelections[product.id] || {
              finish: product.finishOptions[0] || 'Standard',
              qty: 1
            };

            // Calculate current active unit price based on quantity
            const currentTier = [...product.tierPricing].reverse().find(t => currentSel.qty >= t.minQty);
            const activePrice = currentTier ? currentTier.unitPrice : product.baseUnitPrice;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Category & Stock Header */}
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {product.category}
                    </span>
                    <span className="text-slate-500">
                      Stock: <strong className="text-emerald-700 font-semibold">{product.stockAvailable.toLocaleString()} {product.unitOfMeasure}s</strong>
                    </span>
                  </div>

                  {/* Product Title & SKU */}
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-slate-700 transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    SKU: <span className="text-slate-800 font-semibold">{product.sku}</span> | Material: {product.material}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Technical Specs Summary Button */}
                  <button
                    onClick={() => setSelectedProductSpec(product)}
                    className="mt-2 text-[11px] text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" /> View Technical Datasheet Specs
                  </button>

                  {/* Volume Tier Pricing Table */}
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px]">
                    <span className="font-bold text-slate-700 block mb-1">
                      Bulk Tier Discounts ({product.unitOfMeasure}):
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-slate-600">
                      {product.tierPricing.map((tier, idx) => {
                        const isActive = currentSel.qty >= tier.minQty && (idx === product.tierPricing.length - 1 || currentSel.qty < product.tierPricing[idx + 1].minQty);
                        return (
                          <div
                            key={idx}
                            className={`p-1 px-2 rounded border flex justify-between ${
                              isActive
                                ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <span>{tier.minQty}+ pkgs:</span>
                            <span>${tier.unitPrice.toFixed(2)}/pkg</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Order Controls */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  {/* Finish Options Selector */}
                  {product.finishOptions.length > 0 && (
                    <div>
                      <label className="block text-[11px] text-slate-500 font-medium mb-1">
                        Select Surface Finish:
                      </label>
                      <select
                        value={currentSel.finish}
                        onChange={e => handleFinishChange(product.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        {product.finishOptions.map(f => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity & Add Button Row */}
                  <div className="flex items-center gap-3">
                    <div className="w-28">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Quantity (pkgs):</label>
                      <input
                        type="number"
                        min="1"
                        value={currentSel.qty}
                        onChange={e => handleQtyChange(product.id, Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="text-[10px] text-slate-500 text-right">
                        Line Total: <strong className="text-emerald-700 text-xs">${(activePrice * currentSel.qty).toFixed(2)}</strong>
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        className="w-full mt-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Intake
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Technical Datasheet Specs Modal */}
      {selectedProductSpec && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedProductSpec.name}</h3>
                <span className="text-xs text-slate-500 font-mono">SKU: {selectedProductSpec.sku}</span>
              </div>
              <button
                onClick={() => setSelectedProductSpec(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Description:</span>
                <p className="text-slate-800 mt-1">{selectedProductSpec.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Unit of Measure:</span>
                  <strong className="text-slate-900">{selectedProductSpec.unitOfMeasure}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Package Weight:</span>
                  <strong className="text-slate-900">{selectedProductSpec.weightKgPerUnit} kg</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Dimensions:</span>
                  <strong className="text-slate-900">{selectedProductSpec.dimensions}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Material:</span>
                  <strong className="text-slate-900">{selectedProductSpec.material}</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-2">Technical Specification Values:</span>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {Object.entries(selectedProductSpec.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-200/80 pb-1 text-slate-700">
                      <span>{key}:</span>
                      <strong className="text-slate-900">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedProductSpec(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs"
              >
                Close Technical Datasheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
