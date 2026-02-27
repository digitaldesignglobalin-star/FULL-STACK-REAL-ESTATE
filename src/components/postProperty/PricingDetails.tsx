"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { FormType } from "@/app/dashboard/post-property/page";
// type Props = {
//   form.purpose?: "sell" | "rent" | "pg"
// }

type PillProps = {
  value: string;
  selected: string;
  set: (v: string) => void;
};

const Pill = ({ value, selected, set }: PillProps) => (
  <button
    type="button"
    onClick={() => set(value)}
    className={`px-4 py-2 rounded-full border text-sm
    ${
      selected === value ? "bg-blue-600 text-white border-blue-600" : "bg-white"
    }`}
  >
    {value}
  </button>
);

export default function PricingDetails({
  form,
  setForm,
}: {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  // const [negotiable,setNegotiable]=useState("Yes")
  // const [ownership,setOwnership]=useState("Freehold")
  // const [maintenanceType,setMaintenanceType]=useState("Included")

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-3xl font-semibold">Pricing & other details</h2>

      {/* ================= PRICE ================= */}

      <div>
        <p className="font-medium mb-2">
          {form.purpose === "sell" && "Expected Sale Price"}
          {form.purpose === "rent" && "Expected Monthly Rent"}
          {form.purpose === "pg" && "PG Monthly Charges"}
        </p>

        <Input
          value={form.price}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, price: e.target.value }))
          }
          placeholder={
            form.purpose === "sell"
              ? "₹ Enter sale price"
              : form.purpose === "rent"
                ? "₹ Enter monthly rent"
                : "₹ Enter PG charges"
          }
        />
      </div>

      {/* ================= RENT + PG ONLY ================= */}

      {(form.purpose === "rent" || form.purpose === "pg") && (
        <>
          <div>
            <p className="font-medium mb-2">Security Deposit</p>
            <Input
              value={form.deposit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, deposit: e.target.value }))
              }
              placeholder="₹ Deposit amount"
            />
          </div>

          <div>
            <p className="font-medium mb-3">Maintenance charges</p>

            <div className="flex gap-3 mb-2">
              {["Included", "Excluded"].map((v) => (
                <Pill
                  key={v}
                  value={v}
                  selected={form.maintenanceType}
                  set={(val) =>
                    setForm((prev) => ({ ...prev, maintenanceType: val }))
                  }
                />
              ))}
            </div>

            <Input
              value={form.maintenance}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, maintenance: e.target.value }))
              }
              placeholder="₹ Monthly maintenance"
            />
          </div>
        </>
      )}

      {/* ================= SELL ONLY ================= */}

      {form.purpose === "sell" && (
        <div>
          <p className="font-medium mb-3">Ownership Type</p>

          <div className="flex gap-3">
            {["Freehold", "Leasehold", "Co-operative", "Power of Attorney"].map(
              (v) => (
                <Pill
                  key={v}
                  value={v}
                  selected={form.ownership}
                  set={(val) =>
                    setForm((prev) => ({ ...prev, ownership: val }))
                  }
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* ================= PRICE NEGOTIABLE ================= */}

      <div>
        <p className="font-medium mb-3">Price Negotiable?</p>

        <div className="flex gap-3">
          {["Yes", "No"].map((v) => (
            <Pill
              key={v}
              value={v}
              selected={form.negotiable}
              set={(val) => setForm((prev) => ({ ...prev, negotiable: val }))}
            />
          ))}
        </div>
      </div>

      {/* ================= DESCRIPTION (ALL) ================= */}

      <div>
        <p className="font-medium mb-2">Property Description</p>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="border rounded p-3 w-full h-32"
        />
      </div>
    </div>
  );
}
