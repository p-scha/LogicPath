package com.logicpath.backend.LogicPathController;

import com.logicpath.backend.LogicPathDTO.StageCompleteRequest;
import com.logicpath.backend.LogicPathService.ProgressService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getProgress(@PathVariable Long userId) {
        return progressService.getProgress(userId);
    }

    @GetMapping("/can-access")
    public Map<String, Boolean> canAccessStage(
            @RequestParam Long userId,
            @RequestParam String moduleId,
            @RequestParam String stageId
    ) {
        boolean canAccess = progressService.canAccessStage(userId, moduleId, stageId);
        return Map.of("canAccess", canAccess);
    }

    @PostMapping("/stage-complete")
    public Map<String, Object> markStageComplete(@RequestBody StageCompleteRequest request) {
        return progressService.markStageComplete(request);
    }
}