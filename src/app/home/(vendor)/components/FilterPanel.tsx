// FilterPanel.tsx (বা মেইন ফাইলের বাইরে)
import { SlidersHorizontal, RotateCcw, Palette, Ruler, Flag as FlagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface FilterPanelProps {
    minPrice: string;
    setMinPrice: (val: string) => void;
    maxPrice: string;
    setMaxPrice: (val: string) => void;
    uniqueBrands: string[];
    selectedBrands: string[];
    setSelectedBrands: (val: string[]) => void;
    uniqueColors: string[];
    selectedColors: string[];
    setSelectedColors: (val: string[]) => void;
    uniqueSizes: string[];
    selectedSizes: string[];
    setSelectedSizes: (val: string[]) => void;
    uniqueFlags: string[];
    selectedFlags: string[];
    setSelectedFlags: (val: string[]) => void;
    handleClear: () => void;
    applyFilters: (overrides?: any) => void;
}

const FilterPanel = ({
    minPrice, setMinPrice, maxPrice, setMaxPrice,
    uniqueBrands, selectedBrands, setSelectedBrands,
    uniqueColors, selectedColors, setSelectedColors,
    uniqueSizes, selectedSizes, setSelectedSizes,
    uniqueFlags, selectedFlags, setSelectedFlags,
    handleClear, applyFilters
}: FilterPanelProps) => {
    return (
        <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
            <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</h3>
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive h-7"><RotateCcw className="w-3 h-3 mr-1" /> Reset</Button>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
                <Label className="text-sm font-semibold">Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
                <Button onClick={() => applyFilters({ page: 1 })} className="w-full h-9" variant="outline">Apply Price</Button>
            </div>

            <Separator />

            {/* Brands */}
            {uniqueBrands.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Brands</Label>
                    <div className="space-y-2">
                        {uniqueBrands.map(b => (
                            <div key={b} className="flex items-center gap-2">
                                <Checkbox
                                    id={`brand-${b}`}
                                    checked={selectedBrands.includes(b)}
                                    onCheckedChange={(checked) => {
                                        const next = checked ? [...selectedBrands, b] : selectedBrands.filter(x => x !== b);
                                        setSelectedBrands(next);
                                        applyFilters({ brand: next.join(','), page: 1 });
                                    }}
                                />
                                <label htmlFor={`brand-${b}`} className="text-sm cursor-pointer">{b}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Colors */}
            {uniqueColors.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2"><Palette className="w-4 h-4" /> Colors</Label>
                    <div className="flex flex-wrap gap-2">
                        {uniqueColors.map(c => (
                            <button
                                key={c}
                                onClick={() => {
                                    const next = selectedColors.includes(c) ? selectedColors.filter(x => x !== c) : [...selectedColors, c];
                                    setSelectedColors(next);
                                    applyFilters({ color: next.join(','), page: 1 });
                                }}
                                className={`px-3 py-1 rounded-full text-xs capitalize border transition-all ${selectedColors.includes(c) ? 'bg-primary text-white border-primary' : 'bg-transparent border-gray-300'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {uniqueSizes.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2"><Ruler className="w-4 h-4" /> Sizes</Label>
                    <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(s => (
                            <button
                                key={s}
                                onClick={() => {
                                    const next = selectedSizes.includes(s) ? selectedSizes.filter(x => x !== s) : [...selectedSizes, s];
                                    setSelectedSizes(next);
                                    applyFilters({ size: next.join(','), page: 1 });
                                }}
                                className={`w-10 h-10 rounded-md border flex items-center justify-center text-xs transition-all ${selectedSizes.includes(s) ? 'bg-black text-white border-black' : 'bg-white border-gray-200'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Flags */}
            {uniqueFlags.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2"><FlagIcon className="w-4 h-4" /> Tags</Label>
                    <div className="space-y-2">
                        {uniqueFlags.map(f => (
                            <div key={f} className="flex items-center gap-2">
                                <Checkbox
                                    id={`flag-${f}`}
                                    checked={selectedFlags.includes(f)}
                                    onCheckedChange={(checked) => {
                                        const next = checked ? [...selectedFlags, f] : selectedFlags.filter(x => x !== f);
                                        setSelectedFlags(next);
                                        applyFilters({ flag: next.join(','), page: 1 });
                                    }}
                                />
                                <label htmlFor={`flag-${f}`} className="text-sm cursor-pointer">{f}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;