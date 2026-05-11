package com.logicpath.backend.model;

import java.util.List;

public class Lesson {

    private String id;
    private String title;
    private List<Slide> slides;

    public static class Slide {
        private String title;
        private String body;

        public Slide() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getBody() { return body; }
        public void setBody(String body) { this.body = body; }
    }

    public Lesson() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<Slide> getSlides() { return slides; }
    public void setSlides(List<Slide> slides) { this.slides = slides; }
}