"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { FormType } from "@/app/dashboard/post-property/page";
import { toast } from "sonner";

interface PropertyProfileProps {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

export default function PropertyProfile({
  form,
  setForm,
}: PropertyProfileProps) {
  const [customBhk, setCustomBhk] = useState("");

  interface PillProps {
    value: string;
    selected: string;
    field: keyof FormType;
  }

  const Pill = ({ value, selected, field }: PillProps) => (
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          [field]: value,
        }))
      }
      className={`px-4 py-2 rounded-full border text-sm ${
        selected === value
          ? "bg-blue-600 text-white border-blue-600 cursor-pointer"
          : "bg-white border border-gray-400 rounded-lg px-4 py-2 cursor-pointer"
      }`}
    >
      {value}
    </button>
  );

  interface NumRowProps {
    title: string;
    state: string;
    field: keyof FormType;
  }

  const NumRow = ({ title, state, field }: NumRowProps) => (
    <div>
      <p className="text-sm mb-2">{title}</p>
      <div className="flex gap-2 flex-wrap">
        {["1", "2", "3", "4", "5", "More"].map((v) => (
          <Pill key={v} value={v} selected={state} field={field} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-3xl font-semibold">Tell us about your property</h2>

      {/* ==================== SELL + RENT ONLY ==================== */}
      {(form.purpose === "sell" || form.purpose === "rent") && (
        <>
          <p className="font-medium mb-3">Construction Status</p>

          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as FormType["status"],
              }))
            }
            className="border rounded-md p-2 mb-6 border-gray-400 px-4 py-2 cursor-pointer"
          >
            <option value="new">New Project</option>
            <option value="launched">Newly Launched</option>
            <option value="ready">Ready to Move</option>
            <option value="under-construction">Under Construction</option>
          </select>
        </>
      )}

      {/* ==================== BHK - COMMON FOR ALL ==================== */}
      <div>
        <p className="font-medium mb-3">
          {form.purpose === "pg" ? "PG Room Configuration" : "Your apartment is a"}
        </p>
        <div className="flex gap-3 flex-wrap">
          {["1", "2", "3", "Other"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                if (v === "Other") {
                  setForm((prev) => ({ ...prev, bhk: "Other" }));
                } else {
                  setCustomBhk("");
                  setForm((prev) => ({ ...prev, bhk: v }));
                }
              }}
              className={`px-4 py-2 rounded-full border text-sm ${
                form.bhk === v
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border border-gray-400"
              }`}
            >
              {v} {form.purpose === "pg" ? "BHK" : "BHK"}
            </button>
          ))}
        </div>
        {form.bhk === "Other" && (
          <input
            type="number"
            autoFocus
            placeholder={`Enter ${form.purpose === "pg" ? "BHK" : "BHK"} (e.g. 4, 5...)`}
            value={customBhk}
            onChange={(e) => {
              const value = e.target.value;
              if (Number(value) > 0 && Number(value) <= 20) {
                setCustomBhk(value);
                setForm((prev) => ({
                  ...prev,
                  bhk: value,
                }));
              } else {
                setCustomBhk("");
              }
            }}
            className="border w-full p-2 mt-2 rounded-lg border-gray-400"
          />
        )}
      </div>

      {/* ==================== AREA - COMMON FOR ALL ==================== */}
      <div>
        <p className="font-medium mb-3">
          {form.purpose === "pg" ? "Room Size" : "Add Area Details"}
        </p>
        <div className="flex gap-3">
          <Input
            value={form.area}
            onChange={(e) => {
              const value = e.target.value;
              if (Number(value) < 0) {
                toast.error("Invalid area");
                return;
              }
              setForm({ ...form, area: value });
            }}
            placeholder={form.purpose === "pg" ? "Room Area" : "Carpet Area"}
            className="border border-gray-400 rounded-lg px-4 py-2"
            type="number"
            min="0"
          />
          <select
            value={form.areaUnit}
            onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
            className="border border-gray-400 rounded-lg px-4 py-1 cursor-pointer"
          >
            <option>sq.ft.</option>
            <option>sq.m.</option>
          </select>
        </div>
      </div>

      {/* ==================== PRICE PER SQFT - COMMON FOR ALL ==================== */}
      <div>
        <p className="font-medium mb-2">Price per sq.ft</p>
        <Input
          value={form.pricePerSqft}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) < 0) {
              toast.error("Invalid amount");
              return;
            }
            setForm({ ...form, pricePerSqft: value });
          }}
          placeholder="₹ Price per sq.ft"
          type="number"
          min="0"
          className="border border-gray-400 rounded-lg px-4 py-2"
        />
      </div>

      {/* ==================== ROOM DETAILS - SELL + RENT ONLY ==================== */}
      {(form.purpose === "sell" || form.purpose === "rent") && (
        <div className="space-y-5">
          <p className="font-medium">Add Room Details</p>
          <NumRow title="No. of Bedrooms" state={form.bed} field="bed" />
          <NumRow title="No. of Bathrooms" state={form.bath} field="bath" />
          <NumRow title="Balconies" state={form.bal} field="bal" />
        </div>
      )}

      {/* ==================== FURNISHING - SELL + RENT ONLY ==================== */}
      {(form.purpose === "sell" || form.purpose === "rent") && (
        <div>
          <p className="font-medium mb-3">Furnishing</p>
          <div className="flex gap-3 flex-wrap">
            {["Furnished", "Semi-furnished", "Un-furnished"].map((v) => (
              <Pill key={v} value={v} selected={form.furnish} field="furnish" />
            ))}
          </div>
        </div>
      )}

      {/* ==================== COMMON: AGE OF PROPERTY ==================== */}
      <div>
        <p className="font-medium mb-3">Age of property</p>
        <div className="flex gap-3 flex-wrap">
          {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((v) => (
            <Pill key={v} value={v} selected={form.age} field="age" />
          ))}
        </div>
      </div>

      {/* ==================== RENT ONLY: AVAILABLE DATE ==================== */}
      {form.purpose === "rent" && (
        <div>
          <p className="font-medium mb-2">Available from</p>
          <Input
            value={form.availableFrom}
            onChange={(e) =>
              setForm({ ...form, availableFrom: e.target.value })
            }
            type="date"
            className="border border-gray-400 rounded-lg px-4 py-2 cursor-pointer"
          />
        </div>
      )}

      {/* ==================== RENT + PG: TENANT TYPE ==================== */}
      {(form.purpose === "rent" || form.purpose === "pg") && (
        <div>
          <p className="font-medium mb-3">Willing to rent out to</p>
          <div className="flex gap-3 flex-wrap">
            {form.purpose === "pg"
              ? ["Bachelors", "Boys", "Girls"].map((v) => (
                  <Pill key={v} value={v} selected={form.tenant} field="tenant" />
                ))
              : ["Family", "Bachelors", "Boys", "Girls"].map((v) => (
                  <Pill key={v} value={v} selected={form.tenant} field="tenant" />
                ))}
          </div>
        </div>
      )}

      {/* ==================== COMMON: PRICE ==================== */}
      <div>
        <p className="font-medium mb-2">
          {form.purpose === "sell" && "Sale Price"}
          {form.purpose === "rent" && "Expected Rent"}
          {form.purpose === "pg" && "PG Monthly Rent"}
        </p>
        <Input
          value={form.price}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) < 0) {
              toast.error("Invalid amount");
              return;
            }
            setForm({ ...form, price: value });
          }}
          placeholder={
            form.purpose === "sell"
              ? "₹ Property Sale Price"
              : form.purpose === "rent"
                ? "₹ Expected Monthly Rent"
                : "₹ PG Monthly Charges"
          }
          type="number"
          min="0"
          className="border border-gray-400 rounded-lg px-4 py-2"
        />
      </div>

      {/* ==================== COMMON: BROKER ==================== */}
      <div>
        <p className="font-medium mb-3">
          Are you ok with brokers contacting you?
        </p>
        <div className="flex gap-3">
          {["Yes", "No"].map((v) => (
            <Pill key={v} value={v} selected={form.broker} field="broker" />
          ))}
        </div>
      </div>
    </div>
  );
}