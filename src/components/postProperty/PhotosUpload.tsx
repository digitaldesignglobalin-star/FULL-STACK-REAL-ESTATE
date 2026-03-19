"use client";

import { useRef, useState } from "react";

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
  const [preview, setPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<"upload" | "youtube">("upload");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // IMAGE UPLOAD
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const newFiles = Array.from(files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));

    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const removeVideo = () => {
    setForm((prev) => ({
      ...prev,
      video: null,
    }));

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-3xl font-semibold">Add photos & video of property</h2>

      {/* ================= IMAGES ================= */}

      <div className="border rounded-xl p-6 border border-gray-400 rounded-lg px-4 py-2">
        <p className="font-medium mb-3">Upload Photos</p>

        <input
          ref={fileInputRef}
          className="cursor-pointer border border-gray-400 rounded-lg px-4 py-2 w-full sm:w-[50%]"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
        />
        {form.images.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {form.images.length} image{form.images.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}

        {/* PREVIEW */}

        <div className="flex gap-3 mt-4 flex-wrap ">
          {form.images.map((img, i) => {
            if (!(img instanceof File)) return null;

            const url = URL.createObjectURL(img);

            return (
              <div key={i} className="relative">
                <img
                  src={url}
                  onClick={() => setPreview(url)}
                  // onLoad={() => URL.revokeObjectURL(url)}
                  className="w-32 h-32 object-cover rounded cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black text-white px-2 rounded cursor-pointer"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>

        {preview && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 "
            onClick={() => setPreview(null)}
          >
            <img
              src={preview}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90%] max-h-[90%] rounded-lg"
            />
          </div>
        )}
      </div>

      {/* ================= VIDEO ================= */}

      <div className="border rounded-xl p-6 border border-gray-400 rounded-lg px-4 py-2">
        <p className="font-medium mb-4">Add one video of property</p>

        {/* TABS */}

        <div className="flex gap-6 border-b border-b-gray-300 mb-4 ">
          <button
            type="button"
            className={`pb-2 cursor-pointer ${tab === "upload" && "border-b-2 border-blue-600 cursor-pointer"}`}
            onClick={() => setTab("upload")}
          >
            Upload Video
          </button>

          <button
            type="button"
            className={`pb-2 cursor-pointer ${tab === "youtube" && "border-b-2 border-blue-600 cursor-pointer"}`}
            onClick={() => setTab("youtube")}
          >
            YouTube Link
          </button>
        </div>

        {/* UPLOAD VIDEO */}

        {tab === "upload" && (
          <div className="space-y-3">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideo}
              className="cursor-pointer border border-gray-400 rounded-lg px-4 py-2 w-full sm:w-[50%]"
            />

            {form.video && (
              <div className="relative mt-3 w-full max-w-md">
                <video
                  src={URL.createObjectURL(form.video)}
                  controls
                  className="w-full rounded-lg"
                />

                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-black text-white px-2 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* YOUTUBE */}

        {tab === "youtube" && (
          <input
            placeholder="Paste YouTube link"
            className="border p-3 rounded-lg w-full  border-gray-400  px-4 py-2"
            value={form.youtube}
            onChange={(e) => setForm({ ...form, youtube: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
