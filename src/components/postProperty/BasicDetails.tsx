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
          className="border border-gray-500 rounded-lg px-4 py-2 cursor-pointer"
        >
          Sell
        </Button>

        <Button
          variant={form.purpose === "rent" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "rent" })}
          className="border border-gray-500 rounded-lg px-4 py-2 cursor-pointer"

        >
          Rent / Lease
        </Button>

        <Button
          variant={form.purpose === "pg" ? "default" : "outline"}
          onClick={() => setForm({ ...form, purpose: "pg" })}
          className="border border-gray-500 rounded-lg px-4 py-2 cursor-pointer"

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
        <div className="flex items-center gap-2 border border-gray-500 rounded-lg px-3 py-2 cursor-pointer">
          <RadioGroupItem value="residential" id="r1" className="border border-gray-500 cursor-pointer"/>
          <label className="cursor-pointer" htmlFor="r1">Residential</label>
        </div>

        <div className="flex items-center gap-2 border border-gray-500 rounded-lg px-3 py-2 cursor-pointer">
          <RadioGroupItem value="commercial" id="r2"  className="border border-gray-500 cursor-pointer"/>
          <label className="cursor-pointer" htmlFor="r2">Commercial</label>
        </div>
      </RadioGroup>

      <div className="flex flex-wrap gap-3">
        {propertyTypes.map((item) => (
          <Button
            key={item}
            variant={form.type === item ? "default" : "outline"}
            className=" border border-gray-500 rounded-lg px-4 py-2 cursor-pointer"
            onClick={() => setForm({ ...form, type: item })}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
