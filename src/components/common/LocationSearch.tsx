"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Loader2 } from "lucide-react";
import axios from "axios";

interface SearchSuggestion {
  cities: string[];
  localities: string[];
  types: string[];
}

interface PropertySuggestion {
  _id: string;
  type: string;
  city: string;
  locality: string;
  bhk?: number;
  price: number;
  images?: string[];
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function LocationSearch({
  value,
  onChange,
  onSelect,
  placeholder = "Enter city, locality or project",
  className = "",
  debounceMs = 300,
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion>({
    cities: [],
    localities: [],
    types: [],
  });
  const [properties, setProperties] = useState<PropertySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length < 1) {
        setSuggestions({ cities: [], localities: [], types: [] });
        setProperties([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get("/api/search", {
          params: { q: value, limit: 8 },
        });
        setSuggestions(res.data.suggestions || { cities: [], localities: [], types: [] });
        setProperties(res.data.properties || []);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, debounceMs);
    return () => clearTimeout(debounceTimer);
  }, [value, debounceMs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSelect(suggestion);
    setShowSuggestions(false);
  };

  const handlePropertyClick = (property: PropertySuggestion) => {
    setShowSuggestions(false);
    onSelect(value);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const hasSuggestions =
    suggestions.cities.length > 0 ||
    suggestions.localities.length > 0 ||
    suggestions.types.length > 0 ||
    properties.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center">
        <Search className="absolute left-3 text-slate-400 z-10" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSelect(value.trim());
              setShowSuggestions(false);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 animate-spin text-blue-500" size={16} />
        )}
      </div>

      {showSuggestions && value.trim().length > 0 && hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {properties.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Properties</p>
              {properties.map((property) => (
                <button
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <img
                    src={property.images?.[0] || "/noimage.png"}
                    alt={property.type}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      {property.type} {property.bhk ? `${property.bhk} BHK` : ""}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {property.locality}, {property.city}
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {suggestions.cities.length > 0 && (
            <div className={`p-2 ${properties.length > 0 ? "border-t" : ""}`}>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cities</p>
              {suggestions.cities.map((city, i) => (
                <button
                  key={`city-${i}`}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <MapPin size={14} className="text-blue-600 shrink-0" />
                  <span className="truncate">{city}</span>
                </button>
              ))}
            </div>
          )}

          {suggestions.localities.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Localities</p>
              {suggestions.localities.map((loc, i) => (
                <button
                  key={`loc-${i}`}
                  onClick={() => handleSuggestionClick(loc)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <MapPin size={14} className="text-green-600 shrink-0" />
                  <span className="truncate">{loc}</span>
                </button>
              ))}
            </div>
          )}

          {suggestions.types.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Property Types</p>
              {suggestions.types.map((type, i) => (
                <button
                  key={`type-${i}`}
                  onClick={() => handleSuggestionClick(type)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <Building2 size={14} className="text-purple-600 shrink-0" />
                  <span className="truncate">{type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
