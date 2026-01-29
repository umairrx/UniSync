import { useState } from "react";

export function useClassroomManagement() {
  const [editingRoomCourseId, setEditingRoomCourseId] = useState<string | null>(null);
  const [editRoomValue, setEditRoomValue] = useState("");
  const [classroomOverride, setClassroomOverride] = useState("");

  const startEditing = (courseId: string, currentRoom: string) => {
    setEditingRoomCourseId(courseId);
    setEditRoomValue(currentRoom === "No Room" ? "" : currentRoom);
  };

  const stopEditing = () => {
    setEditingRoomCourseId(null);
    setEditRoomValue("");
  };

  return {
    editingRoomCourseId,
    setEditingRoomCourseId,
    editRoomValue,
    setEditRoomValue,
    classroomOverride,
    setClassroomOverride,
    startEditing,
    stopEditing,
  };
}
