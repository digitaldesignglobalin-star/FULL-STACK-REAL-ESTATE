"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import BasicDetails from "@/components/postProperty/BasicDetails";
import LocationDetails from "@/components/postProperty/LocationDetails";
import PropertyProfile from "@/components/postProperty/PropertyProfile";
import PhotosUpload from "@/components/postProperty/PhotosUpload";
import PricingDetails from "@/components/postProperty/PricingDetails";
import axios from "axios";
import { toast } from "sonner";

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
  roomType?: string;
  gender?: string;
  food?: string;
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
  pricePerSqft: string;
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
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("propertyStep");
      return savedStep ? Number(savedStep) : 0;
    }
    return 0;
  });
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState<FormType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("propertyForm");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          return {
            ...parsed,
            images: [],
            video: null,
          };
        } catch {
          localStorage.removeItem("propertyForm");
        }
      }
    }

    return {
      purpose: "rent",
      category: "",
      type: "",
      status: "new",
      city: "",
      locality: "",
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
      price: "",
      pricePerSqft: "",
      deposit: "",
      maintenance: "",
      description: "",
      ownership: "Freehold",
      negotiable: "Yes",
      maintenanceType: "Included",
      images: [],
      video: null,
      youtube: "",
    };
  });

  useEffect(() => {
    localStorage.setItem("propertyForm", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem("propertyStep", step.toString());
  }, [step]);

  const next = () => {
    if (step === 0) {
      if (!form.category || !form.type || !form.purpose) {
        toast.error("Please fill all basic property details");
        return;
      }
    }

    if (step === 1) {
      if (!form.city || !form.locality) {
        toast.error("Please enter city and locality");
        return;
      }
    }

    if (step === 2) {
      if (form.purpose === "pg") {
        if (!form.bhk) {
          toast.error("Please select room configuration");
          return;
        }
        if (!form.area || Number(form.area) <= 0) {
          toast.error("Please enter room size");
          return;
        }
        if (!form.pricePerSqft || Number(form.pricePerSqft) <= 0) {
          toast.error("Please enter price per sq.ft");
          return;
        }
        if (!form.age) {
          toast.error("Please select age of property");
          return;
        }
        if (!form.tenant) {
          toast.error("Please select tenant type");
          return;
        }
        if (!form.price || Number(form.price) <= 0) {
          toast.error("Please enter PG monthly rent");
          return;
        }
        if (!form.broker) {
          toast.error("Please select broker contact preference");
          return;
        }
      } else {
        if (
          !form.bhk ||
          !form.area ||
          !form.pricePerSqft ||
          !form.furnish ||
          !form.age ||
          !form.bed ||
          !form.bath ||
          !form.bal ||
          !form.broker
        ) {
          toast.error("Please complete property profile");
          return;
        }

        if (form.purpose === "rent" && !form.tenant) {
          toast.error("Please select tenant type");
          return;
        }

        if (form.purpose === "rent" && !form.availableFrom) {
          toast.error("Please select available date");
          return;
        }
      }
    }

    if (step === 3) {
      if (form.images.length === 0) {
        toast.error("Please upload at least one property image");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

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

  const performReset = () => {
    const previousForm = form;

    const defaultForm: FormType = {
      purpose: "rent",
      category: "",
      type: "",
      status: "new",
      city: "",
      locality: "",
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
      price: "",
      pricePerSqft: "",
      deposit: "",
      maintenance: "",
      description: "",
      ownership: "Freehold",
      negotiable: "Yes",
      maintenanceType: "Included",
      images: [],
      video: null,
      youtube: "",
    };

    setForm(defaultForm);
    setStep(0);

    localStorage.removeItem("propertyForm");
    localStorage.removeItem("propertyStep");

    toast("Form reset", {
      action: {
        label: "Undo",
        onClick: () => {
          setForm(previousForm);
          toast.success("Form restored");
        },
      },
      actionButtonStyle: {
        padding: "18px 20px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: "black",
        color: "white",
        borderRadius: "6px",
      },
      style: {
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
      },
    });
  };

  const confirmReset = () => {
    toast("Reset the form?", {
      description: "All entered data will be removed.",
      action: {
        label: "Reset",
        onClick: performReset,
      },
      actionButtonStyle: {
        padding: "18px 20px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: "#dc2626",
        color: "white",
        borderRadius: "6px",
      },
      style: {
        border: "1px solid #ccc",
        borderRadius: "10px",
        width: "320px",
        padding: "18px",
        fontSize: "16px",
      },
    });
  };

  const handleSubmit = async () => {
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Please enter valid price");
      return;
    }

    if (!form.description) {
      toast.error("Please add property description");
      return;
    }

    if (form.purpose !== "sell" && !form.deposit) {
      toast.error("Please add deposit amount");
      return;
    }

    if (form.purpose !== "sell" && !form.maintenance && form.maintenanceType === "Included") {
      toast.error("Please add maintenance charges");
      return;
    }

    if (form.purpose === "sell" && !form.ownership) {
      toast.error("Please select ownership type");
      return;
    }

    if (!form.negotiable) {
      toast.error("Please select negotiable option");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();

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

      setForm({
        purpose: "rent",
        category: "",
        type: "",
        status: "new",
        city: "",
        locality: "",
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
        price: "",
        pricePerSqft: "",
        deposit: "",
        maintenance: "",
        description: "",
        ownership: "Freehold",
        negotiable: "Yes",
        maintenanceType: "Included",
        images: [],
        video: null,
        youtube: "",
      });

      setStep(0);
      localStorage.removeItem("propertyForm");
      localStorage.removeItem("propertyStep");

      toast.success("Property posted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto ">
      <Card className="w-full lg:w-72 p-4 sm:p-6 lg:p-7 rounded-2xl overflow-x-auto border border-gray-400">
        <div className="flex lg:hidden gap-6 min-w-max">
          {steps.map((name, i) => {
            const completed = i < step;
            const current = i === step;

            return (
              <div key={i} className="flex flex-col items-center min-w-[80px] ">
                <div
                  className={`
                  flex items-center justify-center
                  w-7 h-7 rounded-full  text-sm font-semibold
                  ${completed && "bg-blue-600 text-white"}
                  ${current && "bg-white border-2 border-blue-600"}
                  ${!completed && !current && "bg-white border border-gray-300"}
                `}
                >
                  {completed ? "✓" : i + 1}
                </div>

                <p
                  className={`text-xs mt-2 text-center ${
                    current ? "text-blue-600 font-semibold" : "text-gray-600"
                  }`}
                >
                  {name}
                </p>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:block relative">
          <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gray-300 " />

          {steps.map((name, i) => {
            const completed = i < step;
            const current = i === step;

            return (
              <div key={i} className="flex items-start gap-4 mb-8 relative">
                <div
                  className={`
                  relative z-10 flex items-center justify-center
                  w-7 h-7 rounded-full text-sm font-semibold
                  ${completed && "bg-blue-600 text-white"}
                  ${current && "bg-white border-2 border-blue-600"}
                  ${!completed && !current && "bg-white border border-gray-400"}
                `}
                >
                  {completed ? "✓" : ""}
                </div>

                <div className="pt-[2px]">
                  <p
                    className={`text-[15px] leading-tight ${
                      current ? "text-blue-600 font-semibold" : "text-gray-700"
                    }`}
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

      <Card className="flex-1 p-4 sm:p-6 lg:p-10 border border-gray-400">
        {renderStep()}

        <div className="flex flex-wrap gap-4 mt-8 lg:mt-10">
          <button
            onClick={confirmReset}
            className="px-6 py-2 border border-red-400 text-red-600 rounded-lg cursor-pointer"
          >
            Reset
          </button>
          {step > 0 && (
            <button
              onClick={back}
              className="px-6 py-2 border rounded-lg  border-gray-400  px-4 cursor-pointer"
            >
              Back
            </button>
          )}

          {step < steps.length - 1 && (
            <button
              onClick={next}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Continue
            </button>
          )}

          {step === steps.length - 1 && (
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white  border border-gray-400 rounded-lg cursor-pointer"
            >
              {loading ? "Posting..." : "Post Property"}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
