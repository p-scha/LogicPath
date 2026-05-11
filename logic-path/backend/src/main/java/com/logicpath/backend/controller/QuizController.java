package com.logicpath.backend.controller;

import com.logicpath.backend.model.Quiz;
import com.logicpath.backend.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{module}/{quiz}")
    public Quiz getQuiz(@PathVariable String module,
                        @PathVariable String quiz) {
        return quizService.getQuiz(module, quiz);
    }

    @GetMapping("/{module}")
    public List<String> listQuizzes(@PathVariable String module) {
        try {
            URL url = getClass().getClassLoader()
                    .getResource("module_data/" + module + "/quizzes");

            if (url == null) return Collections.emptyList();

            File folder = new File(url.toURI());

            File[] files = folder.listFiles((dir, name) ->
                    name.endsWith(".json")
            );

            if (files == null) return Collections.emptyList();

            List<String> quizzes = new ArrayList<>();

            for (File file : files) {
                String quizName = file.getName().replace(".json", "");
                quizzes.add(quizName);
            }

            return quizzes;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}