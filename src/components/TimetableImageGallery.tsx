import { useState } from "react";
import { Images, Trash2, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { TimetableImage } from "@/types";

interface TimetableImageGalleryProps {
  images: TimetableImage[];
  onDeleteImage: (id: string) => void;
  onClearImages: () => void;
}

export function TimetableImageGallery({
  images,
  onDeleteImage,
  onClearImages,
}: TimetableImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<TimetableImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const openLightbox = (image: TimetableImage) => {
    setSelectedImage(image);
    setZoom(1);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    setZoom(1);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    if (currentIndex === -1) return;

    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + images.length) % images.length
        : (currentIndex + 1) % images.length;

    setSelectedImage(images[newIndex]);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 w-full justify-center text-xs">
            <Images className="h-3.5 w-3.5" />
            View
            {images.length > 0 && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                {images.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Images className="h-5 w-5" />
              Timetable Images
            </DialogTitle>
            <DialogDescription>
              View and manage your uploaded timetable reference images.
            </DialogDescription>
          </DialogHeader>

          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Images className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">No timetable images uploaded yet</p>
              <p className="text-xs mt-1">Upload images to view them here</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative aspect-4/3 rounded-lg overflow-hidden border bg-muted/30 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 hover:shadow-md"
                      onClick={() => openLightbox(image)}
                    >
                      <img
                        src={image.dataUrl}
                        alt={image.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-xs text-white font-medium truncate">{image.name}</p>
                        <p className="text-[10px] text-white/70">{formatDate(image.uploadedAt)}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteImage(image.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setClearDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Images
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={lightboxOpen} onOpenChange={closeLightbox}>
        <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95 overflow-hidden">
          <div className="relative flex flex-col h-full">
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-linear-to-b from-black/80 to-transparent">
              <div className="text-white">
                <p className="font-medium">{selectedImage?.name}</p>
                <p className="text-xs text-white/70">
                  {selectedImage && formatDate(selectedImage.uploadedAt)} •{" "}
                  {images.findIndex((img) => img.id === selectedImage?.id) + 1} of {images.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 ml-2"
                  onClick={closeLightbox}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-auto p-8">
              {selectedImage && (
                <img
                  src={selectedImage.dataUrl}
                  alt={selectedImage.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                />
              )}
            </div>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20 rounded-full"
                  onClick={() => navigateImage("prev")}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20 rounded-full"
                  onClick={() => navigateImage("next")}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Images?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all {images.length} timetable image
              {images.length !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onClearImages();
                setClearDialogOpen(false);
              }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
