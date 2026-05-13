const API_BASE_URL = "http://localhost:8080/api/progress";

// Get user progress
export async function getProgress(userId) {
  const res = await fetch(`${API_BASE_URL}/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch user progress");
  }

  return res.json();
}

// Mark stage complete
export async function markStageComplete(userId, moduleId, stageId, stageType) {
  const res = await fetch(`${API_BASE_URL}/stage-complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      moduleId,
      stageId,
      stageType,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to mark stage complete");
  }

  return res.json();
}

// Check stage access
// Check stage access
export async function canAccessStage(userId, moduleId, stageId) {
  const params = new URLSearchParams({
    userId,
    moduleId,
    stageId,
  });

  const url = `${API_BASE_URL}/can-access?${params.toString()}`;

  console.log("Checking stage access URL:", url);
  console.log("Checking stage access values:", {
    userId,
    moduleId,
    stageId,
  });

  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();

    console.error("Stage access request failed:", {
      status: res.status,
      statusText: res.statusText,
      body: errorText,
      url,
    });

    throw new Error("Failed to check stage access");
  }

  const data = await res.json();
  console.log("Stage access response:", data);

  return data;
}