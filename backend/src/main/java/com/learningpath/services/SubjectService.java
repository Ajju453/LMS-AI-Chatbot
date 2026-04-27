package com.learningpath.services;

import com.learningpath.models.Subject;
import com.learningpath.models.Topic;
import com.learningpath.repositories.SubjectRepository;
import com.learningpath.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
    
    public Optional<Subject> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }
    
    public Optional<Subject> getSubjectByCode(String code) {
        return subjectRepository.findByCode(code);
    }
    
    public List<Subject> getSubjectsBySemester(String semester) {
        return subjectRepository.findBySemester(semester);
    }
    
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
    
    public Subject updateSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
    
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
    
    // Topic methods
    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }
    
    public List<Topic> getTopicsBySubjectId(Long subjectId) {
        return topicRepository.findBySubjectIdOrderBySequenceOrderAsc(subjectId);
    }
    
    public Optional<Topic> getTopicById(Long id) {
        return topicRepository.findById(id);
    }
    
    public Topic updateTopic(Topic topic) {
        return topicRepository.save(topic);
    }
    
    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }
    
    public String getCurriculumPlan(Long subjectId) {
        Optional<Subject> subject = subjectRepository.findById(subjectId);
        if (subject.isPresent()) {
            List<Topic> topics = getTopicsBySubjectId(subjectId);
            StringBuilder plan = new StringBuilder();
            plan.append("Curriculum Plan for ").append(subject.get().getName()).append("\n");
            plan.append("Total Topics: ").append(topics.size()).append("\n");
            double totalHours = 0;
            for (Topic topic : topics) {
                plan.append("\n- ").append(topic.getSequenceOrder()).append(". ").append(topic.getName())
                    .append(" (").append(topic.getEstimatedHours()).append(" hours, ")
                    .append(topic.getDifficultyLevel()).append(")");
                totalHours += topic.getEstimatedHours();
            }
            plan.append("\n\nTotal Estimated Hours: ").append(totalHours);
            return plan.toString();
        }
        return "Subject not found";
    }
}
