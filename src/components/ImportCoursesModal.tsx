import { useState } from "react";
import { Upload, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Course } from "@/types";

interface ImportCoursesModalProps {
  onAddCourse: (course: Omit<Course, "id">) => void;
}

const COURSE_SCHEMA_JSON = `[
  {
    "code": "CS434L",
    "name": "Compiler Construction Lab",
    "class": "BSCS-F-22-A-799",
    "credits": 1,
    "faculty": "Mr. Wahab Ali"
  }
]`;

const PROMPT_TEXT = `Generate a JSON array of courses matching this schema: ${COURSE_SCHEMA_JSON}

IMPORTANT INSTRUCTIONS:
1. **Format**: Strictly follow the JSON structure.
2. **Credits**: Must be a number (e.g. 3, 4, 1).
3. **Faculty**: Teacher's name (optional but recommended).
4. **Class**: Section name e.g. "BSCS-F-22-A".
`;

import {
  validateCourseCode,
  validateCourseName,
  validateSection,
  validateCredits,
} from "@/utils/validation";
import { extractErrorMessage } from "@/utils/errorHandling";

export function ImportCoursesModal({ onAddCourse }: ImportCoursesModalProps) {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of course objects");
      }

      const errors: string[] = [];
      let addedCount = 0;

      parsed.forEach((item: Record<string, unknown>, index) => {
        const itemCode = String(item.code || "").trim();
        const itemName = String(item.name || "").trim();
        const itemClass = String(item.class || "").trim();
        const itemCredits = item.credits as string | number;

        const codeVal = validateCourseCode(itemCode);
        const nameVal = validateCourseName(itemName);
        const classVal = validateSection(itemClass);
        const creditsVal = validateCredits(itemCredits);

        if (!codeVal.isValid || !nameVal.isValid || !classVal.isValid || !creditsVal.isValid) {
          const itemErrors = [
            codeVal.error,
            nameVal.error,
            classVal.error,
            creditsVal.error,
          ].filter(Boolean);
          errors.push(`Item ${index + 1}: ${itemErrors.join(", ")}`);
          return;
        }

        try {
          onAddCourse({
            code: itemCode.toUpperCase(),
            name: itemName,
            class: itemClass.toUpperCase(),
            credits: Number(itemCredits),
            faculty: item.faculty ? String(item.faculty).trim() : undefined,
            classroom: item.classroom ? String(item.classroom).trim() : undefined,
          });
          addedCount++;
        } catch (e) {
          errors.push(`Item ${index + 1}: Failed to add - ${extractErrorMessage(e)}`);
        }
      });

      if (errors.length > 0) {
        throw new Error(
          `Imported ${addedCount} courses, but encountered errors:\n` +
            errors.slice(0, 3).join("\n") +
            (errors.length > 3 ? `\n...and ${errors.length - 3} more` : ""),
        );
      }

      if (addedCount === 0) {
        throw new Error("No valid courses found to import.");
      }

      setOpen(false);
      setJsonInput("");
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 w-full justify-center text-xs">
          <Upload className="h-3.5 w-3.5" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Courses</DialogTitle>
          <DialogDescription>Import courses from JSON array.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg max-h-[100px] overflow-y-auto">
            <p className="text-sm text-destructive whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Paste JSON</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={copyPrompt}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied Prompt" : "Copy Prompt"}
            </Button>
          </div>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={COURSE_SCHEMA_JSON}
            className="h-[200px] font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">Paste an array of course objects.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonInput.trim()}>
            Import Courses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
