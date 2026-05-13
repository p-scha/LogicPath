import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { canAccessStage } from "../services/ProgressService";

export function useStageAccess(
  userId,
  moduleId,
  stageId,
  redirectPath = "/module_one"
) {
  const navigate = useNavigate();

  const [accessChecked, setAccessChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        if (!userId) {
          alert("You must be logged in to access this lesson.");
          navigate("/login");
          return;
        }

        const result = await canAccessStage(userId, moduleId, stageId);

        if (!result.canAccess) {
          alert("You must complete the previous lesson first.");
          navigate(redirectPath);
          return;
        }

        setAllowed(true);
      } catch (error) {
        console.error("Error checking lesson access:", error);
        alert("Could not verify lesson access.");
        navigate(redirectPath);
      } finally {
        setAccessChecked(true);
      }
    }

    checkAccess();
  }, [userId, moduleId, stageId, redirectPath, navigate]);

  return {
    accessChecked,
    allowed,
  };
}