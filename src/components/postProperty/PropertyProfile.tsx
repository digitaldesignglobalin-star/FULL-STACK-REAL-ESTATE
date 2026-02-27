"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { FormType } from "@/app/dashboard/post-property/page";

interface PropertyProfileProps {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}

export default function PropertyProfile({
  form,
  setForm,
}: PropertyProfileProps) {
  // const [bhk, setBhk] = useState("2 BHK");
  // const [furnish, setFurnish] = useState("");
  // const [age, setAge] = useState("");
  // const [broker, setBroker] = useState("Yes");

  // const [bed, setBed] = useState("");
  // const [bath, setBath] = useState("");
  // const [bal, setBal] = useState("");
  // const [tenant, setTenant] = useState("");

  // type PillProps = {
  //   value: string;
  //   selected: string;
  //   set: (v: string) => void;
  // };

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
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white"
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

      {/* COMMON FOR SELL + RENT */}
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
            className="border rounded-md p-2 mb-6"
          >
            <option value="new">New Project</option>
            <option value="launched">Newly Launched</option>
            <option value="ready">Ready to Move</option>
            <option value="under-construction">Under Construction</option>
          </select>

          <div>
            <p className="font-medium mb-3">Your apartment is a</p>
            <div className="flex gap-3">
              {["1 BHK", "2 BHK", "3 BHK", "Other"].map((v) => (
                <Pill key={v} value={v} selected={form.bhk} field="bhk" />
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mb-3">Add Area Details</p>
            <div className="flex gap-3">
              <Input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="Carpet Area"
              />
              <select
                value={form.areaUnit}
                onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
                className="border rounded px-3"
              >
                <option>sq.ft.</option>
                <option>sq.m.</option>
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <p className="font-medium">Add Room Details</p>
            <NumRow title="No. of Bedrooms" state={form.bed} field="bed" />
            <NumRow title="No. of Bathrooms" state={form.bath} field="bath" />
            <NumRow title="Balconies" state={form.bal} field="bal" />
          </div>
        </>
      )}

      {/* ⭐ FURNISHING FOR SELL + RENT (UPDATED) */}
      {(form.purpose === "sell" || form.purpose === "rent") && (
        <div>
          <p className="font-medium mb-3">Furnishing</p>
          <div className="flex gap-3">
            {["Furnished", "Semi-furnished", "Un-furnished"].map((v) => (
              <Pill key={v} value={v} selected={form.furnish} field="furnish" />
            ))}
          </div>
        </div>
      )}

      {/* ⭐ AGE FOR ALL (UPDATED) */}
      <div>
        <p className="font-medium mb-3">Age of property</p>
        <div className="flex gap-3 flex-wrap">
          {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((v) => (
            <Pill key={v} value={v} selected={form.age} field="age" />
          ))}
        </div>
      </div>

      {/* RENT ONLY DATE */}
      {form.purpose === "rent" && (
        <div>
          <p className="font-medium mb-2">Available from</p>
          <Input
            value={form.availableFrom}
            onChange={(e) =>
              setForm({ ...form, availableFrom: e.target.value })
            }
            type="date"
          />
        </div>
      )}

      {/* ⭐ TENANT TYPE FOR RENT + PG (NEW) */}
      {(form.purpose === "rent" || form.purpose === "pg") && (
        <div>
          <p className="font-medium mb-3">Willing to rent out to</p>

          <div className="flex gap-3 flex-wrap">
            {["Family", "Bachelors", "Boys", "Girls"].map((v) => (
              <Pill key={v} value={v} selected={form.tenant} field="tenant" />
            ))}
          </div>
        </div>
      )}

      {/* PRICE */}
      <div>
        <p className="font-medium mb-2">
          {form.purpose === "sell" && "Sale Price"}
          {form.purpose === "rent" && "Expected Rent"}
          {form.purpose === "pg" && "PG Monthly Rent"}
        </p>

        <Input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder={
            form.purpose === "sell"
              ? "₹ Property Sale Price"
              : form.purpose === "rent"
                ? "₹ Expected Monthly Rent"
                : "₹ PG Monthly Charges"
          }
        />
      </div>

      {/* BROKER */}
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
