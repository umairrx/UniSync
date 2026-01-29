import { useState, useCallback, useEffect } from "react";
import type { TimetableImage } from "@/types";
import { STORAGE_KEYS } from "@/types";
import { generateId } from "@/utils/id";
import { loadFromIDB, saveToIDB } from "@/utils/storage-idb";

export function useTimetableImages() {
  const [images, setImages] = useState<TimetableImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadFromIDB<unknown[]>(STORAGE_KEYS.TIMETABLE_IMAGES, []).then((stored) => {
      if (!mounted) return;

      if (Array.isArray(stored)) {
        const validImages = stored.filter(
          (img): img is TimetableImage =>
            typeof img === "object" && img !== null && "id" in img && "src" in img,
        );
        setImages(validImages);
      } else {
        setImages([]);
      }
      setIsLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToIDB(STORAGE_KEYS.TIMETABLE_IMAGES, images);
    }
  }, [images, isLoaded]);

  const addImage = useCallback((imageData: Omit<TimetableImage, "id" | "uploadedAt">) => {
    const newImage: TimetableImage = {
      ...imageData,
      id: generateId(),
      uploadedAt: Date.now(),
    };
    setImages((prev) => [...prev, newImage]);
    return newImage;
  }, []);

  const deleteImage = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    addImage,
    deleteImage,
    clearImages,
  };
}
