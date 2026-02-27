"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import BasicDetails from "@/components/postProperty/BasicDetails";
import LocationDetails from "@/components/postProperty/LocationDetails";
import PropertyProfile from "@/components/postProperty/PropertyProfile";
import PhotosUpload from "@/components/postProperty/PhotosUpload";
import PricingDetails from "@/components/postProperty/PricingDetails";
import axios from "axios";

const steps = [
  "Basic Details",
  "Location Details",
  "Property Profile",
  "Photos & Videos",
  "Pricing",
];

export type FormType = {
  purpose: "sell" | "rent" | "pg";

  category: string;
  type: string;

  status: string;

  city: string;
  locality: string;

  bhk: string;
  bed: string;
  bath: string;
  bal: string;
  furnish: string;
  age: string;

  price: string;
  deposit: string;
  maintenance: string;
  description: string;
  tenant: string;
  broker: string;
  area: string;
  areaUnit: string;
  availableFrom: string;

  images: File[];
  video: File | null;
  youtube: string;

  ownership: string;
  negotiable: string;
  maintenanceType: string;
};

export default function PostPropertyPage() {
  const [step, setStep] = useState(0);
  // type Purpose = "sell" | "rent" | "pg";
  const [loading, setLoading] = useState(false);

  // const [form, setForm] = useState<{ purpose: Purpose }>({
  //   purpose: "rent",
  // });

  const [form, setForm] = useState<FormType>({
    purpose: "rent",

    // basic
    category: "",
    type: "",

    status: "new",

    // location
    city: "",
    locality: "",

    // profile
    bhk: "",
    bed: "",
    bath: "",
    bal: "",
    furnish: "",
    age: "",
    tenant: "",
    broker: "",
    area: "",
    areaUnit: "sq.ft.",
    availableFrom: "",

    // pricing
    price: "",
    deposit: "",
    maintenance: "",
    description: "",

    ownership: "Freehold",
    negotiable: "Yes",
    maintenanceType: "Included",

    // media
    images: [],
    video: null,
    youtube: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BasicDetails form={form} setForm={setForm} />;
      case 1:
        return <LocationDetails form={form} setForm={setForm} />;
      case 2:
        return <PropertyProfile form={form} setForm={setForm} />;
      case 3:
        return <PhotosUpload form={form} setForm={setForm} />;
      case 4:
        return <PricingDetails form={form} setForm={setForm} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();

      // append normal fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          (value as File[]).forEach((file) => {
            fd.append("images", file);
          });
        } else if (key === "video" && value) {
          fd.append("video", value as File);
        } else {
          fd.append(key, value as any);
        }
      });

      await axios.post("/api/auth/property/create", fd, {});

      alert("Property Posted!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 p-8 max-w-7xl mx-auto">
      {/* LEFT SIDEBAR */}

      <Card className="w-72 p-7 rounded-2xl">
        <div className="relative">
          {/* vertical center line */}
          <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gray-200" />

          {steps.map((name, i) => {
            const completed = i < step;
            const current = i === step;

            return (
              <div key={i} className="flex items-start gap-4 mb-8 relative">
                {/* circle */}

                <div
                  className={`
            relative z-10 flex items-center justify-center
            w-7 h-7 rounded-full text-sm font-semibold
            transition-all duration-300

            ${completed && "bg-blue-600 text-white shadow"}
            ${current && "bg-white border-2 border-blue-600"}
            ${!completed && !current && "bg-white border border-gray-300"}
          `}
                >
                  {completed ? "✓" : ""}
                </div>

                {/* text */}

                <div className="pt-[2px]">
                  <p
                    className={`
              text-[15px] leading-tight
              ${current ? "text-blue-600 font-semibold" : "text-gray-700"}
            `}
                  >
                    {name}
                  </p>

                  <p className="text-xs text-gray-400 mt-[2px]">Step {i + 1}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* RIGHT AREA */}

      <Card className="flex-1 p-10">
        {renderStep()}

        <div className="flex gap-4 mt-10">
          {step > 0 && (
            <button onClick={back} className="px-6 py-2 border rounded-lg">
              Back
            </button>
          )}

          {step < steps.length - 1 && (
            <button
              onClick={next}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Continue
            </button>
          )}

          {step === steps.length - 1 && (
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Posting..." : "Post Property"}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
