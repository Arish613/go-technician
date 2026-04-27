"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X, Tag, Banknote, Snowflake, LayoutGrid } from "lucide-react";
import { Prisma } from "@prisma/client";

type Product = Prisma.ProductGetPayload<{
  include: { city: true; locality: true };
}>;

export type SortOption = "popularity" | "newest" | "price-asc" | "price-desc";

interface FilterSidebarProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  onSortChange: (sort: SortOption) => void;
  sort: SortOption;
}

interface FilterState {
  brands: string[];
  minPrice: number;
  maxPrice: number;
  capacity: string | null;
  unitType: string | null;
}

function extractCapacity(name: string | null): string | null {
  if (!name) return null;
  const match = name.match(/(\d+\.?\d*)\s*ton/i);
  if (match) return `${match[1]} Ton`;
  return null;
}

function extractUnitType(specifications: string | null): string | null {
  if (!specifications) return null;
  const upper = specifications.toLowerCase();
  if (upper.includes("window")) return "Window";
  if (upper.includes("split")) return "Split";
  if (upper.includes("inverter")) return "Inverter";
  return null;
}

function extractBrands(products: Product[]): string[] {
  const brands = products
    .map((p) => p.brand)
    .filter((b): b is string => !!b && b.trim() !== "");
  return [...new Set(brands)].sort();
}

function extractPriceRange(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 50000];
  const prices = products.map((p) => (p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price));
  return [Math.min(...prices), Math.max(...prices)];
}

interface FilterContentProps {
  filters: FilterState;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  brands: string[];
  capacityOptions: string[];
  unitTypeOptions: string[];
  onToggleBrand: (brand: string) => void;
  onPriceChange: (values: number[]) => void;
  onCapacitySelect: (capacity: string) => void;
  onUnitTypeChange: (type: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

function FilterContent({
  filters,
  priceRange,
  minPrice,
  maxPrice,
  brands,
  capacityOptions,
  unitTypeOptions,
  onToggleBrand,
  onPriceChange,
  onCapacitySelect,
  onUnitTypeChange,
  onClearFilters,
  activeFilterCount,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {brands.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Tag className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wider font-bold">Brand</span>
          </div>
          <div className="space-y-2 px-1">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => onToggleBrand(brand)}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground font-medium">
          <Banknote className="h-4 w-4" />
          <span className="text-sm uppercase tracking-wider font-bold">Price Range</span>
        </div>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={onPriceChange}
            min={minPrice}
            max={maxPrice}
            step={500}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-bold">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}+</span>
          </div>
        </div>
      </div>

      {capacityOptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Snowflake className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wider font-bold">Capacity</span>
          </div>
          <div className="grid grid-cols-2 gap-2 px-1">
            {capacityOptions.map((capacity) => (
              <button
                key={capacity}
                onClick={() => onCapacitySelect(capacity)}
                className={`px-2 py-1.5 text-xs border rounded-lg transition-colors ${filters.capacity === capacity
                  ? "bg-primary/10 border-primary text-primary font-medium"
                  : "border-border hover:bg-muted"
                  }`}
              >
                {capacity}
              </button>
            ))}
          </div>
        </div>
      )}

      {unitTypeOptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <LayoutGrid className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wider font-bold">Unit Type</span>
          </div>
          <RadioGroup
            value={filters.unitType || ""}
            onValueChange={onUnitTypeChange}
            className="space-y-2 px-1"
          >
            {unitTypeOptions.map((type) => (
              <label key={type} className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
                <RadioGroupItem value={type} className="border-primary text-primary" />
                {type}
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {activeFilterCount > 0 && (
        <Button onClick={onClearFilters} variant="outline" className="w-full mt-4">
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

export function FilterSidebar({ products, onFilterChange, onSortChange, sort }: FilterSidebarProps) {
  const brands = extractBrands(products);
  const [minPrice, maxPrice] = extractPriceRange(products);

  // Derive which capacity/unit-type values actually exist in the data
  const capacityOptions = [...new Set(
    products.map((p) => extractCapacity(p.name)).filter((c): c is string => c !== null)
  )].sort();
  const unitTypeOptions = [...new Set(
    products.map((p) => extractUnitType(p.specifications)).filter((t): t is string => t !== null)
  )].sort();

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice,
    maxPrice,
    capacity: null,
    unitType: null,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => p.brand && filters.brands.includes(p.brand));
    }

    filtered = filtered.filter((p) => {
      const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    if (filters.capacity) {
      filtered = filtered.filter((p) => extractCapacity(p.name) === filters.capacity);
    }

    if (filters.unitType) {
      filtered = filtered.filter((p) => extractUnitType(p.specifications) === filters.unitType);
    }

    onFilterChange(filtered);
  }, [filters, products, onFilterChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand) ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
    }));
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    setFilters((prev) => ({ ...prev, minPrice: values[0], maxPrice: values[1] }));
  };

  const handleCapacitySelect = (capacity: string) => {
    setFilters((prev) => ({
      ...prev,
      capacity: prev.capacity === capacity ? null : capacity,
    }));
  };

  const handleUnitTypeChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      unitType: prev.unitType === type ? null : type,
    }));
  };

  // Fix: reset minPrice/maxPrice in filters state too so price filter is actually cleared
  const clearFilters = () => {
    setFilters({ brands: [], minPrice, maxPrice, capacity: null, unitType: null });
    setPriceRange([minPrice, maxPrice]);
  };

  const activeFilterCount = filters.brands.length + (filters.capacity ? 1 : 0) + (filters.unitType ? 1 : 0);

  const sharedContentProps = {
    filters,
    priceRange,
    minPrice,
    maxPrice,
    brands,
    capacityOptions,
    unitTypeOptions,
    onToggleBrand: toggleBrand,
    onPriceChange: handlePriceChange,
    onCapacitySelect: handleCapacitySelect,
    onUnitTypeChange: handleUnitTypeChange,
    onClearFilters: clearFilters,
    activeFilterCount,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-20 overflow-y-auto bg-card border border-border/50 rounded-xl p-4">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <p className="text-sm text-muted-foreground">Refine your results</p>
        </div>
        <FilterContent {...sharedContentProps} />
      </aside>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden sticky top-16 z-40 -mx-4 px-4 py-3 bg-card/80 backdrop-blur-md flex items-center justify-between ">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 justify-center items-center text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto p-5">
              <SheetTitle>Filters</SheetTitle>
              <FilterContent {...sharedContentProps} />
            </SheetContent>
          </Sheet>

          {/* Active filter pills */}
          {filters.capacity && (
            <Badge variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
              {filters.capacity}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, capacity: null }))} />
            </Badge>
          )}
          {filters.unitType && (
            <Badge variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
              {filters.unitType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, unitType: null }))} />
            </Badge>
          )}
        </div>

        {/* Mobile sort dropdown */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-muted border-none text-sm font-medium px-3 py-1.5 rounded-full cursor-pointer focus:ring-0"
        >
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </>
  );
}
