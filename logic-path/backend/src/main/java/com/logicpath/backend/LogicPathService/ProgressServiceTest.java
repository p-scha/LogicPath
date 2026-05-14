package com.logicpath.backend.LogicPathService;

import com.logicpath.backend.LogicPathDTO.StageCompleteRequest;
import com.logicpath.backend.LogicPathModel.StageProgress;
import com.logicpath.backend.LogicPathModel.StageType;
import com.logicpath.backend.LogicPathRepository.StageProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.same;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for ProgressService.
 *
 * mock StageProgressRepository so these run with no Spring context
 * and no database. Each test exercises one branch of canAccessStage(),
 * getUnlockedModules(), or markStageComplete().
 *
 * Module stage order (both module_1 and module_2):
 *   lesson_1 -> encounter_1 -> lesson_2 -> encounter_2 -> lesson_3 -> boss_1
 */
class ProgressServiceTest {

    private StageProgressRepository repo;
    private ProgressService service;

    @BeforeEach
    void setUp() {
        repo = mock(StageProgressRepository.class);
        service = new ProgressService(repo);
    }

    // --- helpers ---------------------------------------------------------

    private StageProgress completed(Long userId, String moduleId, String stageId, StageType type) {
        StageProgress s = new StageProgress();
        s.setUserId(userId);
        s.setModuleId(moduleId);
        s.setStageId(stageId);
        s.setStageType(type);
        s.setCompleted(true);
        return s;
    }

    /** Mark module 1's boss as complete in the repo mock. */
    private void module1BossComplete(Long userId) {
        when(repo.existsByUserIdAndModuleIdAndStageTypeAndCompleted(
                eq(userId), eq("module_1"), eq(StageType.BOSS), eq(true)))
                .thenReturn(true);
    }

    // --- canAccessStage: null-input defenses -----------------------------

    @Test
    void canAccessStage_deniesNullUserId() {
        assertThat(service.canAccessStage(null, "module_1", "lesson_1")).isFalse();
    }

    @Test
    void canAccessStage_deniesNullModuleId() {
        assertThat(service.canAccessStage(1L, null, "lesson_1")).isFalse();
    }

    @Test
    void canAccessStage_deniesNullStageId() {
        assertThat(service.canAccessStage(1L, "module_1", null)).isFalse();
    }

    // --- canAccessStage: unknown module / stage --------------------------

    @Test
    void canAccessStage_deniesUnknownModule() {
        assertThat(service.canAccessStage(1L, "module_99", "lesson_1")).isFalse();
    }

    @Test
    void canAccessStage_deniesStageNotInModuleOrder() {
        // module_1 exists, but "phantom_stage" isn't in its stage order
        assertThat(service.canAccessStage(1L, "module_1", "phantom_stage")).isFalse();
    }

    //canAccessStage: progression within module_1

    @Test
    void canAccessStage_allowsFirstStageOfUnlockedModule() {
        // module_1 is always unlocked; lesson_1 is its first stage
        assertThat(service.canAccessStage(1L, "module_1", "lesson_1")).isTrue();
    }

    @Test
    void canAccessStage_deniesSecondStage_whenFirstNotCompleted() {
        when(repo.findByUserId(1L)).thenReturn(Collections.emptyList());
        assertThat(service.canAccessStage(1L, "module_1", "encounter_1")).isFalse();
    }

    @Test
    void canAccessStage_allowsSecondStage_whenFirstCompleted() {
        when(repo.findByUserId(1L)).thenReturn(List.of(
                completed(1L, "module_1", "lesson_1", StageType.LESSON)
        ));
        assertThat(service.canAccessStage(1L, "module_1", "encounter_1")).isTrue();
    }

    @Test
    void canAccessStage_deniesBoss_whenPrecedingLessonNotCompleted() {
        // boss_1 requires lesson_3; user has done everything *except* lesson_3
        when(repo.findByUserId(1L)).thenReturn(List.of(
                completed(1L, "module_1", "lesson_1",   StageType.LESSON),
                completed(1L, "module_1", "encounter_1", StageType.ENCOUNTER),
                completed(1L, "module_1", "lesson_2",   StageType.LESSON),
                completed(1L, "module_1", "encounter_2", StageType.ENCOUNTER)
                // lesson_3 deliberately missing
        ));
        assertThat(service.canAccessStage(1L, "module_1", "boss_1")).isFalse();
    }

    // --- canAccessStage: cross-module gating -----------------------------

    @Test
    void canAccessStage_deniesAllModule2Stages_whenModule1BossNotComplete() {
        // No bosses completed anywhere
        assertThat(service.canAccessStage(1L, "module_2", "lesson_1")).isFalse();
        assertThat(service.canAccessStage(1L, "module_2", "boss_1")).isFalse();
    }

    @Test
    void canAccessStage_allowsModule2FirstStage_whenModule1BossComplete() {
        module1BossComplete(1L);
        assertThat(service.canAccessStage(1L, "module_2", "lesson_1")).isTrue();
    }

    // --- getUnlockedModules ---------------------------------------------

    @Test
    void getUnlockedModules_newUser_onlyModule1Unlocked() {
        Map<String, Boolean> unlocked = service.getUnlockedModules(1L);

        assertThat(unlocked.get("module_1")).isTrue();
        assertThat(unlocked.get("module_2")).isFalse();
        assertThat(unlocked.get("module_3")).isFalse();
    }

    @Test
    void getUnlockedModules_module2Unlocked_afterModule1Boss() {
        module1BossComplete(1L);

        Map<String, Boolean> unlocked = service.getUnlockedModules(1L);

        assertThat(unlocked.get("module_1")).isTrue();
        assertThat(unlocked.get("module_2")).isTrue();
        assertThat(unlocked.get("module_3")).isFalse();
    }

    @Test
    void getUnlockedModules_module3Unlocked_afterModule2Boss() {
        module1BossComplete(1L);
        when(repo.existsByUserIdAndModuleIdAndStageTypeAndCompleted(
                eq(1L), eq("module_2"), eq(StageType.BOSS), eq(true)))
                .thenReturn(true);

        Map<String, Boolean> unlocked = service.getUnlockedModules(1L);

        assertThat(unlocked.get("module_3")).isTrue();
    }

    // --- markStageComplete ----------------------------------------------

    @Test
    void markStageComplete_createsRow_whenStageNotPreviouslyTracked() {
        StageCompleteRequest req = new StageCompleteRequest();
        req.userId    = 1L;
        req.moduleId  = "module_1";
        req.stageId   = "lesson_1";
        req.stageType = StageType.LESSON;

        when(repo.findByUserIdAndModuleIdAndStageIdAndStageType(
                1L, "module_1", "lesson_1", StageType.LESSON))
                .thenReturn(Optional.empty());

        service.markStageComplete(req);

        verify(repo).save(argThat(s ->
                s.getUserId().equals(1L)
                && s.getModuleId().equals("module_1")
                && s.getStageId().equals("lesson_1")
                && s.getStageType() == StageType.LESSON
                && s.isCompleted()
        ));
    }

    @Test
    void markStageComplete_isIdempotent_reusesExistingRow() {
        StageCompleteRequest req = new StageCompleteRequest();
        req.userId    = 1L;
        req.moduleId  = "module_1";
        req.stageId   = "lesson_1";
        req.stageType = StageType.LESSON;

        StageProgress existing = completed(1L, "module_1", "lesson_1", StageType.LESSON);

        when(repo.findByUserIdAndModuleIdAndStageIdAndStageType(
                1L, "module_1", "lesson_1", StageType.LESSON))
                .thenReturn(Optional.of(existing));
        when(repo.findByUserId(1L)).thenReturn(List.of(existing));

        service.markStageComplete(req);

        // The same object must be reused — no new StageProgress is constructed
        verify(repo).save(same(existing));
        assertThat(existing.isCompleted()).isTrue();
    }

    @Test
    void markStageComplete_bossCompletion_unlocksNextModule() {
        StageCompleteRequest req = new StageCompleteRequest();
        req.userId    = 1L;
        req.moduleId  = "module_1";
        req.stageId   = "boss_1";
        req.stageType = StageType.BOSS;

        when(repo.findByUserIdAndModuleIdAndStageIdAndStageType(
                1L, "module_1", "boss_1", StageType.BOSS))
                .thenReturn(Optional.empty());

        // Simulate the DB state *after* the save by having the existsBy... mock
        // return true for module_1 boss completion when getProgress() is called
        // at the end of markStageComplete.
        module1BossComplete(1L);

        Map<String, Object> result = service.markStageComplete(req);

        @SuppressWarnings("unchecked")
        Map<String, Boolean> unlocked = (Map<String, Boolean>) result.get("unlockedModules");

        assertThat(unlocked.get("module_2")).isTrue();
    }
}