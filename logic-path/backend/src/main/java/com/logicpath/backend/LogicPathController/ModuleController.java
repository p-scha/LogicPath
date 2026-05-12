package com.logicpath.backend.LogicPathController;

import com.logicpath.backend.LogicPathService.ProgressService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:5173")
public class ModuleController {

    private final ProgressService progressService;

    public ModuleController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/unlocked/{userId}")
    public Map<String, Boolean> getUnlockedModules(@PathVariable Long userId) {
        return progressService.getUnlockedModules(userId);
    }
}