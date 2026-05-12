package com.logicpath.backend.LogicPathRepository;

import com.logicpath.backend.LogicPathModel.StageProgress;
import com.logicpath.backend.LogicPathModel.StageType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StageProgressRepository extends JpaRepository<StageProgress, Long> {

    List<StageProgress> findByUserId(Long userId);

    Optional<StageProgress> findByUserIdAndModuleIdAndStageIdAndStageType(
            Long userId,
            String moduleId,
            String stageId,
            StageType stageType
    );

    boolean existsByUserIdAndModuleIdAndStageTypeAndCompleted(
            Long userId,
            String moduleId,
            StageType stageType,
            boolean completed
    );
}