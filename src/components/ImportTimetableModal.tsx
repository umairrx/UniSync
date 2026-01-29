import { useState } from "react";
import { Upload, Copy, Check, Trash2, AlertCircle } from "lucide-react";
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
import { parseTimetableImport, TIMETABLE_SCHEMA_JSON } from "@/utils/importTimetable";

interface ImportTimetableModalProps {
  courses: Course[];
  onImportTimetable: (
    assignments: { slotKey: string; courseId: string; classroom?: string }[],
    clearExisting: boolean,
    missingCourses: { code: string; section?: string; name: string }[],
  ) => void;
}

export function ImportTimetableModal({ courses, onImportTimetable }: ImportTimetableModalProps) {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const [clearExisting, setClearExisting] = useState(false);

  const courseListText = courses
    .map((c) => `- ${c.code} (${c.class}): ${c.name}`)
    .join("\n");

  const PROMPT_TEXT = `Generate timetable assignments as a JSON array matching this strict schema: ${TIMETABLE_SCHEMA_JSON}

AVAILABLE COURSES (USE ONLY THESE):
${courseListText || "(No courses added yet - please add courses first!)"}

IMPORTANT INSTRUCTIONS:
1. **Time Format**: Use ONLY the **Start Time** in 24-hour HH:MM format (e.g., "08:00", "13:00", "14:00").
   - DO NOT use ranges like "10:00am-11:00am".
   - DO NOT use AM/PM.
2. **Multiple Hours**: If a class is 2 hours long (e.g., "11:00am-01:00pm"), you MUST generate **two separate objects**:
   - One for each hour block.
3. **Days**: Use full English names: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday".
4. **Course Code**: Must match exactly with the listed course codes above.
5. **Section/Class**: The "section" field must match the section code in parentheses above (e.g., "BSCS-7A").
6. **Classroom**: Room number only (e.g. "C-303").
`;

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

          {courses.length === 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-2">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter">Action Required</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  You cannot import a timetable because your course list is empty. Please add your courses first.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!jsonInput.trim() || courses.length === 0}
            title={
              courses.length === 0 
                ? "Add courses first to enable import" 
                : !jsonInput.trim() 
                  ? "Paste JSON to enable import" 
                  : "Start importing assignments"
            }
          >
            Import Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
