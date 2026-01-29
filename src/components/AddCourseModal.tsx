import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Course } from "@/types";

interface AddCourseModalProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, "id">) => void;
}

export function AddCourseModal({ courses, onAddCourse }: AddCourseModalProps) {
  const [open, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [classSection, setClassSection] = useState("");
  const [credits, setCredits] = useState("3");
  const [faculty, setFaculty] = useState("");
  const [classroom, setClassroom] = useState("");

  const [error, setError] = useState<string>("");

  const resetForm = () => {
    setCode("");
    setName("");
    setClassSection("");
    setCredits("3");
    setFaculty("");
    setClassroom("");
    setError("");
  };

  useEffect(() => {
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode) {
      const existingCourse = courses.find((c) => c.code === trimmedCode);
      if (existingCourse) {
        setName((prev) =>
          prev === "" || prev !== existingCourse.name ? existingCourse.name : prev,
        );
        setCredits(existingCourse.credits.toString());
        if (existingCourse.faculty) {
          setFaculty(existingCourse.faculty);
        }
        if (existingCourse.classroom) {
          setClassroom(existingCourse.classroom);
        }
      }
    }
  }, [code, courses]);

  const handleNewCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Course code is required");
      return;
    }
    if (!/^[A-Z0-9]{1,10}$/.test(code.trim().toUpperCase())) {
      setError("Course code must be 1-10 alphanumeric characters");
      return;
    }

    if (!name.trim()) {
      setError("Course name is required");
      return;
    }
    if (name.trim().length < 3 || name.trim().length > 100) {
      setError("Course name must be 3-100 characters long");
      return;
    }

    if (!classSection.trim()) {
      setError("Section is required");
      return;
    }
    if (!/^[A-Z0-9-]{1,20}$/.test(classSection.trim().toUpperCase())) {
      setError("Section must be 1-20 alphanumeric characters (hyphens allowed)");
      return;
    }

    const creditValue = parseInt(credits, 10);
    if (isNaN(creditValue) || creditValue < 0 || creditValue > 6) {
      setError("Credits must be a number between 0 and 6");
      return;
    }

    try {
      onAddCourse({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        class: classSection.trim().toUpperCase(),
        credits: creditValue,
        faculty: faculty.trim() || undefined,
        classroom: classroom.trim() || undefined,
      });

      resetForm();
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
          <DialogDescription>Add a new course details.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleNewCourseSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                placeholder="CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Introduction to Programming"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class" className="text-right">
                Section
              </Label>
              <Input
                id="class"
                placeholder="A"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Credits
              </Label>
              <Input
                id="credits"
                type="number"
                min={0}
                max={6}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="faculty" className="text-right">
                Faculty
              </Label>
              <Input
                id="faculty"
                placeholder="Mr. John Doe (Optional)"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classroom" className="text-right">
                Room
              </Label>
              <Input
                id="classroom"
                placeholder="C-303 (Optional)"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
