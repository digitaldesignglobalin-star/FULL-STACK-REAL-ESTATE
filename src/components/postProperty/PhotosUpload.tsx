"use client";

import { useState } from "react";

import type { FormType } from "@/app/dashboard/post-property/page";

export default function PhotosUpload({
  form,
  setForm,
}: {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  // const [images,setImages] = useState<File[]>([])
  // const [video,setVideo] = useState<File|null>(null)
  // const [youtube,setYoutube] = useState("")
  const [tab, setTab] = useState<"upload" | "youtube">("upload");

  // IMAGE UPLOAD
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...Array.from(files)],
    }));
  };

  // VIDEO UPLOAD
  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      video: file,
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-3xl font-semibold">Add photos & video of property</h2>

      {/* ================= IMAGES ================= */}

      <div className="border rounded-xl p-6">
        <p className="font-medium mb-3">Upload Photos</p>

        <input type="file" multiple accept="image/*" onChange={handleImages} />

        {/* PREVIEW */}

        <div className="flex gap-3 mt-4 flex-wrap">
          {form.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                onLoad={(e) =>
                  URL.revokeObjectURL((e.target as HTMLImageElement).src)
                }
                className="w-32 h-32 object-cover rounded"
              />

              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= VIDEO ================= */}

      <div className="border rounded-xl p-6">
        <p className="font-medium mb-4">Add one video of property</p>

        {/* TABS */}

        <div className="flex gap-6 border-b mb-4">
          <button
            type="button"
            className={`pb-2 ${tab === "upload" && "border-b-2 border-blue-600"}`}
            onClick={() => setTab("upload")}
          >
            Upload Video
          </button>

          <button
            type="button"
            className={`pb-2 ${tab === "youtube" && "border-b-2 border-blue-600"}`}
            onClick={() => setTab("youtube")}
          >
            YouTube Link
          </button>
        </div>

        {/* UPLOAD VIDEO */}

        {tab === "upload" && (
          <div className="space-y-3">
            <input type="file" accept="video/*" onChange={handleVideo} />

            {form.video && (
              <p className="text-green-600">Selected: {form.video.name}</p>
            )}
          </div>
        )}

        {/* YOUTUBE */}

        {tab === "youtube" && (
          <input
            placeholder="Paste YouTube link"
            className="border p-3 rounded w-full"
            value={form.youtube}
            onChange={(e) => setForm({ ...form, youtube: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
