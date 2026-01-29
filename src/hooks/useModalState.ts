import { useState } from "react";

export function useModalState() {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clearCoursesDialogOpen, setClearCoursesDialogOpen] = useState(false);
  const [clearTimetableDialogOpen, setClearTimetableDialogOpen] = useState(false);

  return {
    assignModalOpen,
    setAssignModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    clearCoursesDialogOpen,
    setClearCoursesDialogOpen,
    clearTimetableDialogOpen,
    setClearTimetableDialogOpen,
  };
}
