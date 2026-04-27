package com.learningpath.controllers;

import com.learningpath.models.Subject;
import com.learningpath.models.Topic;
import com.learningpath.services.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/subjects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SubjectController {
    
    @Autowired
    private SubjectService subjectService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSubject(@RequestBody Subject subject) {
        Subject created = subjectService.createSubject(subject);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", created);
        response.put("message", "Subject created successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSubject(@PathVariable Long id) {
        var subject = subjectService.getSubjectById(id);
        
        Map<String, Object> response = new HashMap<>();
        if (subject.isPresent()) {
            response.put("success", true);
            response.put("data", subject.get());
        } else {
            response.put("success", false);
            response.put("message", "Subject not found");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Map<String, Object>> getByCode(@PathVariable String code) {
        var subject = subjectService.getSubjectByCode(code);
        
        Map<String, Object> response = new HashMap<>();
        if (subject.isPresent()) {
            response.put("success", true);
            response.put("data", subject.get());
        } else {
            response.put("success", false);
            response.put("message", "Subject not found");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/semester/{semester}")
    public ResponseEntity<Map<String, Object>> getBySemester(@PathVariable String semester) {
        var subjects = subjectService.getSubjectsBySemester(semester);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", subjects);
        response.put("count", subjects.size());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/topics")
    public ResponseEntity<Map<String, Object>> createTopic(
        @PathVariable Long id,
        @RequestBody Topic topic) {
        
        var subject = subjectService.getSubjectById(id);
        if (subject.isPresent()) {
            topic.setSubject(subject.get());
            Topic created = subjectService.createTopic(topic);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", created);
            response.put("message", "Topic created successfully");
            
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Subject not found");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/topics")
    public ResponseEntity<Map<String, Object>> getTopics(@PathVariable Long id) {
        var topics = subjectService.getTopicsBySubjectId(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", topics);
        response.put("count", topics.size());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/curriculum-plan")
    public ResponseEntity<Map<String, Object>> getCurriculumPlan(@PathVariable Long id) {
        String plan = subjectService.getCurriculumPlan(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("plan", plan);
        
        return ResponseEntity.ok(response);
    }
}
