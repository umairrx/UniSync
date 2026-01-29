import { useState, useMemo } from "react";
import type { Course } from "@/types";

export function useCoursesSearch(courses: Course[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.class.toLowerCase().includes(query) ||
        c.faculty?.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCourses,
  };
}
