package com.logicpath.backend.LogicPathModel;

import jakarta.persistence.*;

@Entity
public class StageProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String moduleId;

    private String stageId;

    @Enumerated(EnumType.STRING)
    private StageType stageType;

    private boolean completed;

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getModuleId() {
        return moduleId;
    }

    public String getStageId() {
        return stageId;
    }

    public StageType getStageType() {
        return stageType;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public void setStageId(String stageId) {
        this.stageId = stageId;
    }

    public void setStageType(StageType stageType) {
        this.stageType = stageType;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}