package com.logicpath.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.logicpath.backend.model.Lesson;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class LessonService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String basePath = "module_data/"; // path inside src/main/resources

    /**
     * Loads a lesson JSON file from resources/module_data.
     * @param module Module name, e.g., "module_1"
     * @param lesson Lesson number, e.g., "1"
     * @return Lesson object containing the questions
     */
    public Lesson getLesson(String module, String lesson) {
        String fileName = module + "-" + lesson + ".json"; // e.g., module_1-1.json
        String path = basePath + fileName;

        try (InputStream is = getClass().getClassLoader().getResourceAsStream(path)) {

            if (is == null) {
                throw new RuntimeException("Lesson file not found: " + path);
            }

            // Deserialize JSON into Lesson object
            return objectMapper.readValue(is, Lesson.class);

        } catch (IOException e) {
            throw new RuntimeException("Failed to load lesson: " + path, e);
        }
    }
}