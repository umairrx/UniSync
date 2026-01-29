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
import type { Course, DayOfWeek, TimeSlot } from "@/types";
import { createSlotKey } from "@/utils/timetable";

interface ImportTimetableModalProps {
  courses: Course[];
  onImportTimetable: (assignments: { slotKey: string; courseId: string; classroom?: string }[]) => void;
}

const TIMETABLE_SCHEMA_JSON = `[
  {
    "day": "Monday",
    "time": "08:00",
    "courseCode": "CS434",
    "section": "BSCS-F-22-A-799",
    "classroom": "C-303 (Shift-I)"
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
5. **Classroom**: Include if available.
`;

export function ImportTimetableModal({ courses, onImportTimetable }: ImportTimetableModalProps) {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of assignment objects");
      }

      const assignments: { slotKey: string; courseId: string; classroom?: string }[] = [];
      const errors: string[] = [];

      parsed.forEach((item: any, index) => {
        if (!item.day || !item.time || !item.courseCode) {
          errors.push(`Item ${index + 1}: Missing day, time, or courseCode`);
          return;
        }

        const day = item.day as DayOfWeek;

        if (!["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)) {
          errors.push(`Item ${index + 1}: Invalid day '${day}'`);
          return;
        }

        const time = item.time as TimeSlot;

        let foundCourse: Course | undefined;
        if (item.section) {
          foundCourse = courses.find((c) => c.code === item.courseCode && c.class === item.section);
        } else {
          const matches = courses.filter((c) => c.code === item.courseCode);
          if (matches.length === 1) {
            foundCourse = matches[0];
          } else if (matches.length > 1) {
            errors.push(
              `Item ${index + 1}: Multiple courses found for code '${item.courseCode}'. Please specify 'section'.`,
            );
            return;
          } else {
            errors.push(`Item ${index + 1}: Course '${item.courseCode}' not found.`);
            return;
          }
        }

        if (!foundCourse) {
          if (!errors[errors.length - 1]?.includes("Course")) {
            errors.push(
              `Item ${index + 1}: Course '${item.courseCode}' ${item.section ? `(Section ${item.section})` : ""} not found.`,
            );
          }
          return;
        }

        assignments.push({
          slotKey: createSlotKey(day, time),
          courseId: foundCourse.id,
          classroom: item.classroom,
        });
      });

      if (errors.length > 0) {
        throw new Error(
          `Import failed with ${errors.length} errors:\n` +
            errors.slice(0, 3).join("\n") +
            (errors.length > 3 ? `\n...and ${errors.length - 3} more` : ""),
        );
      }

      if (assignments.length === 0) {
        throw new Error("No valid assignments found to import.");
      }

      onImportTimetable(assignments);
      setOpen(false);
      setJsonInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
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
        <Button variant="outline" className="gap-2 w-full">
          <Upload className="h-4 w-4" />
          Import Timetable
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
