import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

interface SearchResult {
  properties: any[];
  suggestions: {
    cities: string[];
    localities: string[];
    types: string[];
  };
  popularSearches: string[];
}

export async function GET(req: NextRequest): Promise<NextResponse<SearchResult | { error: string }>> {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    const result: SearchResult = {
      properties: [],
      suggestions: {
        cities: [],
        localities: [],
        types: []
      },
      popularSearches: []
    };

    if (!query || query.length < 1) {
      // Return popular searches when no query
      const popularCities = await Property.aggregate([
        { $match: { status: { $nin: ["pending", "rejected"] } } },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      result.popularSearches = popularCities
        .filter(p => p._id)
        .map(p => p._id as string);
      
      return NextResponse.json(result);
    }

    const searchQuery = query.trim();

    // Try Atlas Search first, fallback to regex
    try {
      const pipeline = [
        {
          $search: {
            index: "propertysearch",
            text: {
              query: searchQuery,
              path: { wildcard: "*" },
              fuzzy: { maxEdits: 2, prefixLength: 1 }
            }
          }
        },
        { $match: { status: { $nin: ["pending", "rejected"] } } },
        { $limit: limit },
        {
          $project: {
            _id: 1, type: 1, purpose: 1, city: 1, locality: 1,
            bhk: 1, bed: 1, bath: 1, area: 1, price: 1,
            images: 1, status: 1, score: { $meta: "searchScore" }
          }
        }
      ];

      result.properties = await Property.aggregate(pipeline).allowDiskUse(true);
    } catch {
      // Fallback to regex search
      const regexQuery = new RegExp(searchQuery, "i");
      
      result.properties = await Property.find({
        $or: [
          { city: regexQuery },
          { locality: regexQuery },
          { type: regexQuery },
          { description: regexQuery }
        ],
        status: { $nin: ["pending", "rejected"] }
      })
        .select("type purpose city locality bhk bed bath area price images status")
        .limit(limit)
        .lean();
    }

    // Get suggestions - cities matching query
    const citySuggestions = await Property.distinct("city", {
      city: { $regex: `^${searchQuery}`, $options: "i" },
      status: { $nin: ["pending", "rejected"] }
    });
    
    // Get localities matching query
    const localitySuggestions = await Property.distinct("locality", {
      locality: { $regex: `^${searchQuery}`, $options: "i" },
      status: { $nin: ["pending", "rejected"] }
    });

    // Get property types matching query
    const typeSuggestions = await Property.distinct("type", {
      type: { $regex: searchQuery, $options: "i" },
      status: { $nin: ["pending", "rejected"] }
    });

    result.suggestions = {
      cities: citySuggestions.slice(0, 5) as string[],
      localities: localitySuggestions.slice(0, 5) as string[],
      types: typeSuggestions.slice(0, 5) as string[]
    };

    // If no exact matches, get related suggestions
    if (result.properties.length === 0) {
      const relatedCities = await Property.distinct("city", {
        $or: [
          { city: { $regex: searchQuery, $options: "i" } },
          { locality: { $regex: searchQuery, $options: "i" } }
        ],
        status: { $nin: ["pending", "rejected"] }
      });
      result.suggestions.cities = relatedCities.slice(0, 5) as string[];
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", properties: [], suggestions: { cities: [], localities: [], types: [] }, popularSearches: [] },
      { status: 500 }
    );
  }
}
