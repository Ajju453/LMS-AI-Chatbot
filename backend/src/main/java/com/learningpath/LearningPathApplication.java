package com.learningpath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.learningpath"})
public class LearningPathApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearningPathApplication.class, args);
    }
}
