"use client";

import { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/context/search-context";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "recent", label: "Recent" },
  { value: "animal", label: "Animal" },
  { value: "food", label: "Food" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "fashion", label: "Fashion" },
  { value: "fitness", label: "Fitness" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Others" },
];

export function SearchBar() {
  const {
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
  } = useSearch();
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = searchQuery || selectedCategory !== "all";

  return (
    <div className="flex items-center gap-2 max-w-md w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative bg-transparent"
          >
            <Filter className="h-4 w-4" />
            {selectedCategory !== "all" && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearFilters();
                    setIsOpen(false);
                  }}
                  className="h-auto p-1 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          className="h-9 w-9"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
