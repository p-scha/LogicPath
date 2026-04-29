export async function fetchLesson(module, lesson) {
  const res = await fetch(`/api/lessons/${module}/${lesson}`);

  if (!res.ok) {
    throw new Error("Failed to fetch lesson");
  }

  return res.json();
}