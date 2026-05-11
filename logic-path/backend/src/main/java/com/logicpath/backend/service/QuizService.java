package com.logicpath.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.logicpath.backend.model.Quiz;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class QuizService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Quiz getQuiz(String module, String lesson) {

        String fileName = module + "-" + lesson + ".json";
        String path = "module_data/" + module + "/quizzes/" + fileName;

        try {
            Resource resource = new ClassPathResource(path);

            // 🔍 DEBUG (keep this temporarily)
            System.out.println("Looking for: " + ((ClassPathResource) resource).getPath());
            System.out.println("Exists: " + resource.exists());

            if (!resource.exists()) {
                throw new RuntimeException("Lesson file not found: " + path);
            }

            try (InputStream is = resource.getInputStream()) {
                return objectMapper.readValue(is, Quiz.class);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to load lesson: " + path, e);
        }
    }
}