"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import type { FormType } from "@/app/dashboard/post-property/page";

export default function LocationDetails({
  form,
  setForm,
}: {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  const [showLocality, setShowLocality] = useState(false);

  const handlePickLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );

          const data = await res.json();

          const detectedCity =
            data.address.city || data.address.town || data.address.state || "";

          setForm({ ...form, city: detectedCity });
          setShowLocality(true);
        } catch {
          alert("Failed to detect location");
        }
      },

      () => alert("Unable to fetch location"),
    );
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-3xl font-semibold mb-2">
        Where is your property located?
      </h2>

      <p className="text-gray-500 mb-8">
        An accurate location helps you connect with the right buyers
      </p>

      <div className="relative mb-6 ">
        <Input
          placeholder="City"
          value={form.city}
          onChange={(e) => {
            setForm({ ...form, city: e.target.value });
            if (e.target.value.length > 1) setShowLocality(true);
          }}
          className="h-14 text-lg pr-40 border border-gray-400 rounded-lg px-4 py-2"
        />

        <button
          onClick={handlePickLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
        >
          <MapPin size={18} />
          Pick my location
        </button>
      </div>

      {showLocality && (
        <Input
          placeholder="Locality / Apartment / Society"
          value={form.locality}
          onChange={(e) => setForm({ ...form, locality: e.target.value })}
          className="h-14 text-lg border border-gray-400 rounded-lg px-4 py-2"
        />
      )}
    </div>
  );
}
