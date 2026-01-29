import { useState } from "react";
import { Upload, Copy, Check, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { Course } from "@/types";
import { parseTimetableImport } from "@/utils/importTimetable";

interface ImportTimetableModalProps {
  courses: Course[];
  onImportTimetable: (
    assignments: { slotKey: string; courseId: string; classroom?: string }[],
    clearExisting: boolean,
    missingCourses: { code: string; section?: string; name: string }[],
  ) => void;
}

const TIMETABLE_SCHEMA_JSON = `[
  {
    "day": "Monday",
    "time": "08:00",
    "courseCode": "CS434",
    "section": "BSCS-F-22-A-799",
    "classroom": "C-303"
  },
  {
    "day": "Tuesday",
    "time": "10:00",
    "courseCode": "HU414",
    "classroom": "C-203"
  }
]`;

const PROMPT_TEXT = `Generate timetable assignments as a JSON array matching this strict schema: ${TIMETABLE_SCHEMA_JSON}

IMPORTANT INSTRUCTIONS:
1. **Time Format**: Use ONLY the **Start Time** in 24-hour HH:MM format (e.g., "08:00", "13:00", "14:00").
   - DO NOT use ranges like "10:00am-11:00am".
   - DO NOT use AM/PM.
2. **Multiple Hours**: If a class is 2 hours long (e.g., "11:00am-01:00pm"), you MUST generate **two separate objects**:
   - One for "11:00"
   - One for "12:00"
3. **Days**: Use full English names: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday".
4. **Course Code**: Must match exactly with existing courses.
5. **Classroom**: Room number only (e.g. "C-303"). DO NOT include Shift info like "(Shift-I)".
`;

export function ImportTimetableModal({ courses, onImportTimetable }: ImportTimetableModalProps) {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const [clearExisting, setClearExisting] = useState(false);

  const handleImport = () => {
    setError("");
    const { assignments, missingCourses, errors } = parseTimetableImport(jsonInput, courses);

    if (errors.length > 0) {
      setError(
        `Import failed with ${errors.length} errors:\n` +
          errors.slice(0, 3).join("\n") +
          (errors.length > 3 ? `\n...and ${errors.length - 3} more` : ""),
      );
      return;
    }

    if (assignments.length === 0 && missingCourses.length === 0) {
      setError("No valid assignments found to import.");
      return;
    }

    onImportTimetable(assignments, clearExisting, missingCourses);
    setOpen(false);
    setJsonInput("");
    setClearExisting(false);
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
          Timetable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Timetable</DialogTitle>
          <DialogDescription>
            Import course assignments from JSON. Courses must already exist in the system.
          </DialogDescription>
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
            placeholder={TIMETABLE_SCHEMA_JSON}
            className="h-[200px] font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Paste an array of objects with day, time, and courseCode.
          </p>

          <div className="flex items-center space-x-2 pt-2 border-t mt-4">
            <Checkbox
              id="clear-existing"
              checked={clearExisting}
              onCheckedChange={(checked) => setClearExisting(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="clear-existing"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 text-muted-foreground"
              >
                <Trash2 className="h-3 w-3" />
                Clear existing assignments before importing
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonInput.trim()}>
            Import Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
