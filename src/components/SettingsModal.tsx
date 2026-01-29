import { useState } from "react";
import { Settings } from "lucide-react";
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
import type { TimetableSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";

interface SettingsModalProps {
  settings: TimetableSettings;
  onSave: (settings: TimetableSettings) => void;
}

export function SettingsModal({ settings, onSave }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TimetableSettings>(settings);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFormData(settings);
    }
    setOpen(isOpen);
  };

  const handleChange = (field: keyof TimetableSettings, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  const handleReset = () => {
    setFormData(DEFAULT_SETTINGS);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timetable Settings</DialogTitle>
          <DialogDescription>
            Configure the start time, end time, and slot duration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interval" className="text-right">
              Interval
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="interval"
                type="number"
                min="10"
                max="180"
                value={formData.intervalMinutes}
                onChange={(e) => handleChange("intervalMinutes", parseInt(e.target.value) || 60)}
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
