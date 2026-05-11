package com.logicpath.backend.controller;

import com.logicpath.backend.model.Lesson;
import com.logicpath.backend.service.LessonService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/{module}/{lesson}")
    public Lesson getLesson(@PathVariable String module,
                            @PathVariable String lesson) {
        return lessonService.getLesson(module, lesson);
    }

    @GetMapping("/{module}")
    public List<String> listLessons(@PathVariable String module) {
        try {
            var url = getClass().getClassLoader().getResource("module_data");
            if (url == null) return Collections.emptyList();

            var dir = new java.io.File(url.getFile());
            var files = dir.listFiles((d, name) ->
                    name.startsWith(module + "-") || name.startsWith("lesson_")
            );

            if (files == null) return Collections.emptyList();

            List<String> lessons = new java.util.ArrayList<>();

            for (java.io.File file : files) {
                String name = file.getName().replace(".json", "");

                // supports lesson_1.json OR module_1-1.json
                if (name.contains("-")) {
                    lessons.add(name.split("-")[1]);
                } else if (name.startsWith("lesson_")) {
                    lessons.add(name.replace("lesson_", ""));
                }
            }

            return lessons;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}