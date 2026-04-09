package com.logicpath.backend.model;

import java.util.List;

public class Lesson {
    private List<Question> questions;

    public List<Question> getQuestions() {
        return questions;
    }
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}