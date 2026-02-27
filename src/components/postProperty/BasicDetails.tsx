"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormType } from "@/app/dashboard/post-property/page";

interface BasicDetailsProps {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

export default function BasicDetails({ form, setForm }: BasicDetailsProps) {
  const propertyTypes = [
    "Flat/Apartment",
    "Independent House / Villa",
    "Independent / Builder Floor",
    "Plot / Land",
    "1 RK / Studio Apartment",
    "Serviced Apartment",
    "Farmhouse",
    "Other",
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold mb-8">Fill out basic details</h2>

      <p className="font-medium mb-3">I'm looking to</p>

      <div className="flex gap-3 mb-8">
        <Button
          variant={form.purpose === "sell" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "sell" })}
        >
          Sell
        </Button>

        <Button
          variant={form.purpose === "rent" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "rent" })}
        >
          Rent / Lease
        </Button>

        <Button
          variant={form.purpose === "pg" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "pg" })}
        >
          PG
        </Button>
      </div>

      

      <p className="font-medium mb-3">What kind of property do you have?</p>

      <RadioGroup
        value={form.category}
        onValueChange={(value) => setForm({ ...form, category: value })}
        className="flex gap-8 mb-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="residential" id="r1" />
          <label htmlFor="r1">Residential</label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem value="commercial" id="r2" />
          <label htmlFor="r2">Commercial</label>
        </div>
      </RadioGroup>

      <div className="flex flex-wrap gap-3">
        {propertyTypes.map((item) => (
          <Button
            key={item}
            variant={form.type === item ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setForm({ ...form, type: item })}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
