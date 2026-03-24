"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormType } from "@/app/dashboard/post-property/page";

interface BasicDetailsProps {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

export default function BasicDetails({ form, setForm }: BasicDetailsProps) {
  
  const propertyTypes =
    form.purpose === "pg"
      ? ["PG", "Hostel", "Co-living", "Other"]
      : [
          "Flat/Apartment",
          "Independent House / Villa",
          "Independent / Builder Floor",
          "Plot / Land",
          "1 RK / Studio Apartment",
          "Serviced Apartment",
          "Farmhouse",
          "Other",
        ];

  // ✅ NEW: dynamic category options
  const categoryOptions =
    form.purpose === "pg"
      ? [
          { label: "Boys PG", value: "boys" },
          { label: "Girls PG", value: "girls" },
          // { label: "Co-ed PG", value: "coed" },
        ]
      : [
          { label: "Residential", value: "residential" },
          { label: "Commercial", value: "commercial" },
        ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold mb-8">
        Fill out basic details
      </h2>

      <p className="font-medium mb-3">I'm looking to</p>

      <div className="flex gap-3 mb-8">
        <Button
          variant={form.purpose === "sell" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "sell" })}
          className="border border-gray-500 rounded-lg px-4 py-2"
        >
          Sell
        </Button>

        <Button
          variant={form.purpose === "rent" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "rent" })}
          className="border border-gray-500 rounded-lg px-4 py-2"
        >
          Rent / Lease
        </Button>

        <Button
          variant={form.purpose === "pg" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "pg" })}
          className="border border-gray-500 rounded-lg px-4 py-2"
        >
          PG
        </Button>
      </div>

      <p className="font-medium mb-3">
        {form.purpose === "pg"
          ? "Who is this PG for?"
          : "What kind of property do you have?"}
      </p>

      <RadioGroup
        value={form.category}
        onValueChange={(value) => setForm({ ...form, category: value })}
        className="flex gap-8 mb-6"
      >
        {categoryOptions.map((item, index) => (
          <div
            key={item.value}
            className="flex items-center gap-2 border border-gray-500 rounded-lg px-3 py-2 cursor-pointer"
          >
            <RadioGroupItem
              value={item.value}
              id={`r${index}`}
              className="border border-gray-500"
            />
            <label htmlFor={`r${index}`} className="cursor-pointer">
              {item.label}
            </label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex flex-wrap gap-3">
        {propertyTypes.map((item) => (
          <Button
            key={item}
            variant={form.type === item ? "default" : "outline"}
            className="border border-gray-500 rounded-lg px-4 py-2"
            onClick={() => setForm({ ...form, type: item })}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}