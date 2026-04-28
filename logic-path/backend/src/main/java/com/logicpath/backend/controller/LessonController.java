package com.logicpath.backend.controller;

import com.logicpath.backend.model.Lesson;
import com.logicpath.backend.service.LessonService;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    /**
     * GET /api/lessons/{module}/{lesson}
     * Example: /api/lessons/module_1/1
     * @param module module name, e.g., "module_1"
     * @param lesson lesson number, e.g., "1"
     * @return Lesson object containing questions
     */
    @GetMapping("/{module}/{lesson}")
    public Lesson getLesson(@PathVariable String module,
                            @PathVariable String lesson) {
        return lessonService.getLesson(module, lesson);
    }

    /**
     * Optional: list all lessons in a module
     * GET /api/lessons/{module}
     * Example: /api/lessons/module_1
     */
    @GetMapping("/{module}")
    public List<String> listLessons(@PathVariable String module) {
        try {
            URL url = getClass().getClassLoader().getResource("module_data");
            if (url == null) return Collections.emptyList();

            File[] files = new File(url.getFile()).listFiles((dir, name) -> name.startsWith(module + "-"));
            if (files == null) return Collections.emptyList();

            List<String> lessons = new ArrayList<>();
            for (File file : files) {
                // Extract "1" from module_1-1.json
                String lessonName = file.getName().replace(".json", "").split("-")[1];
                lessons.add(lessonName);
            }
            return lessons;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}