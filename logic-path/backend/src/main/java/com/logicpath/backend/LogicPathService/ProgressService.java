package com.logicpath.backend.LogicPathService;

import com.logicpath.backend.LogicPathDTO.StageCompleteRequest;
import com.logicpath.backend.LogicPathModel.StageProgress;
import com.logicpath.backend.LogicPathModel.StageType;
import com.logicpath.backend.LogicPathRepository.StageProgressRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProgressService {

    private final StageProgressRepository stageProgressRepository;

    // Each module can have its own stage order
    private static final Map<String, List<String>> MODULE_STAGE_ORDERS = Map.of(
            "module_1", List.of(
                    "lesson_1",
                    "encounter_1",
                    "lesson_2",
                    "encounter_2",
                    "lesson_3",
                    "boss_1"
            ),

            "module_2", List.of(
                    "lesson_1",
                    "encounter_1",
                    "lesson_2",
                    "encounter_2",
                    "lesson_3",
                    "boss_1"
            )
    );

    public ProgressService(StageProgressRepository stageProgressRepository) {
        this.stageProgressRepository = stageProgressRepository;
    }

    public Map<String, Object> getProgress(Long userId) {
        List<StageProgress> stages = stageProgressRepository.findByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("stages", stages);
        response.put("unlockedModules", getUnlockedModules(userId));

        return response;
    }

    public Map<String, Object> markStageComplete(StageCompleteRequest request) {
        StageProgress stage = stageProgressRepository
                .findByUserIdAndModuleIdAndStageIdAndStageType(
                        request.userId,
                        request.moduleId,
                        request.stageId,
                        request.stageType
                )
                .orElseGet(StageProgress::new);

        stage.setUserId(request.userId);
        stage.setModuleId(request.moduleId);
        stage.setStageId(request.stageId);
        stage.setStageType(request.stageType);
        stage.setCompleted(true);

        stageProgressRepository.save(stage);

        return getProgress(request.userId);
    }

    public Map<String, Boolean> getUnlockedModules(Long userId) {
        boolean module1Unlocked = true;

        boolean module1Complete = isModuleBossComplete(userId, "module_1");
        boolean module2Unlocked = module1Complete;

        boolean module2Complete = isModuleBossComplete(userId, "module_2");
        boolean module3Unlocked = module2Complete;

        Map<String, Boolean> modules = new LinkedHashMap<>();
        modules.put("module_1", module1Unlocked);
        modules.put("module_2", module2Unlocked);
        modules.put("module_3", module3Unlocked);

        return modules;
    }

    public boolean canAccessStage(Long userId, String moduleId, String stageId) {
        if (userId == null || moduleId == null || stageId == null) {
            return false;
        }

        List<String> stageOrder = MODULE_STAGE_ORDERS.get(moduleId);

        // If the module has no defined stage order, block access
        if (stageOrder == null) {
            return false;
        }

        // If the requested stage is not part of this module's order, block access
        if (!stageOrder.contains(stageId)) {
            return false;
        }

        // Prevent access to stages inside locked modules
        if (!isModuleUnlocked(userId, moduleId)) {
            return false;
        }

        // First stage of an unlocked module is always accessible
        if (stageId.equals(stageOrder.get(0))) {
            return true;
        }

        String requiredStageId = getRequiredPreviousStage(moduleId, stageId);

        if (requiredStageId == null) {
            return false;
        }

        return hasCompletedStage(userId, moduleId, requiredStageId);
    }

    private String getRequiredPreviousStage(String moduleId, String stageId) {
        List<String> stageOrder = MODULE_STAGE_ORDERS.get(moduleId);

        if (stageOrder == null) {
            return null;
        }

        int currentIndex = stageOrder.indexOf(stageId);

        if (currentIndex <= 0) {
            return null;
        }

        return stageOrder.get(currentIndex - 1);
    }

    private boolean hasCompletedStage(Long userId, String moduleId, String stageId) {
        return stageProgressRepository.findByUserId(userId).stream()
                .anyMatch(stage ->
                        stage.getModuleId().equals(moduleId)
                                && stage.getStageId().equals(stageId)
                                && stage.isCompleted()
                );
    }

    private boolean isModuleBossComplete(Long userId, String moduleId) {
        return stageProgressRepository
                .existsByUserIdAndModuleIdAndStageTypeAndCompleted(
                        userId,
                        moduleId,
                        StageType.BOSS,
                        true
                );
    }

    private boolean isModuleUnlocked(Long userId, String moduleId) {
        Map<String, Boolean> unlockedModules = getUnlockedModules(userId);

        return unlockedModules.getOrDefault(moduleId, false);
    }
}