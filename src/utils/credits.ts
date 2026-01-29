import type { Course, TimetableData } from "@/types";

export function calculateCredits(courses: Course[], timetable: TimetableData) {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const scheduledCourseIds = new Set(
    Object.values(timetable).flatMap((entries) => entries.map((e) => e.courseId)),
  );
  const scheduledCredits = courses
    .filter((course) => scheduledCourseIds.has(course.id))
    .reduce((sum, course) => sum + course.credits, 0);

  return {
    totalCredits,
    scheduledCredits,
  };
}
