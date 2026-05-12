package com.logicpath.backend.LogicPathDTO;

import com.logicpath.backend.LogicPathModel.StageType;

public class StageCompleteRequest {
    public Long userId;
    public String moduleId;
    public String stageId;
    public StageType stageType;
}