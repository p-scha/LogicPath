package com.logicpath.backend.model;

import java.util.List;
import java.util.Map;

public class Quiz {

    private String id;
    private String title;

    private Map<String, List<Question>> questions;

    public Quiz() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Map<String, List<Question>> getQuestions() {
        return questions;
    }

    public void setQuestions(Map<String, List<Question>> questions) {
        this.questions = questions;
    }
}