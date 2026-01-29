import { useState, useCallback, useRef } from "react";
import * as htmlToImage from "html-to-image";

export function useTimetableExport(resolvedTheme: string | undefined) {
  const timetableRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPng = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      if (timetableRef.current === null) {
        throw new Error("Timetable not ready for export");
      }

      const dataUrl = await htmlToImage.toPng(timetableRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: resolvedTheme === "dark" ? "#1a1a1a" : "#ffffff",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `timetable-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setExportError(`Export failed: ${errorMessage}`);
      console.error("Failed to export timetable", err);
    } finally {
      setIsExporting(false);
    }
  }, [resolvedTheme]);

  return {
    timetableRef,
    isExporting,
    exportError,
    handleExportPng,
  };
}
