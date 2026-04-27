package com.learningpath.services;

import com.learningpath.models.Student;
import com.learningpath.models.StudentSubject;
import com.learningpath.repositories.ChatMessageRepository;
import com.learningpath.repositories.StudentRepository;
import com.learningpath.repositories.StudentSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BacklogReminderService {
    
    @Autowired
    private StudentSubjectRepository studentSubjectRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    public List<StudentSubject> getAllBacklogs() {
        return studentSubjectRepository.findByHasBacklogTrue();
    }
    
    public List<StudentSubject> getStudentBacklogs(Long studentId) {
        return studentSubjectRepository.findByStudentIdAndHasBacklogTrue(studentId);
    }
    
    public String generateBacklogReminder(Long studentId) {
        List<StudentSubject> backlogs = getStudentBacklogs(studentId);
        Optional<Student> student = studentRepository.findById(studentId);
        
        if (backlogs.isEmpty()) {
            return "Great news! You have no backlogs. Keep up the excellent work!";
        }
        
        StringBuilder reminder = new StringBuilder();
        reminder.append("Hi ").append(student.map(Student::getName).orElse("Student")).append("!\n\n");
        reminder.append("You have ").append(backlogs.size()).append(" subject(s) with backlog:\n\n");
        
        for (StudentSubject ss : backlogs) {
            reminder.append("📚 ").append(ss.getSubject().getName())
                .append("\n   Current Score: ").append(String.format("%.2f", ss.getCurrentScore()))
                .append("\n   Backlog Count: ").append(ss.getBacklogCount())
                .append("\n   Progress: ").append(ss.getTopicProgress()).append("%\n\n");
        }
        
        reminder.append("Action Items:\n");
        reminder.append("1. Focus on understanding core concepts\n");
        reminder.append("2. Complete pending assignments\n");
        reminder.append("3. Attend extra classes for clarification\n");
        reminder.append("4. Practice regularly and revise\n\n");
        reminder.append("Need help? Ask the ChatBot for topic-wise guidance!");
        
        return reminder.toString();
    }
    
    public String generateStudyPlan(Long studentId, Long subjectId) {
        List<StudentSubject> backlogs = getStudentBacklogs(studentId);
        
        StringBuilder plan = new StringBuilder();
        plan.append("Personalized Study Plan:\n\n");
        
        for (StudentSubject ss : backlogs) {
            if (ss.getSubject().getId().equals(subjectId)) {
                plan.append("Subject: ").append(ss.getSubject().getName()).append("\n");
                plan.append("Duration: 2 weeks intensive\n");
                plan.append("Daily Study Time: 3-4 hours\n\n");
                plan.append("Weekly Schedule:\n");
                plan.append("• Day 1-2: Concept Building (Fundamentals)\n");
                plan.append("• Day 3-4: Problem Solving\n");
                plan.append("• Day 5-6: Practice & Revision\n");
                plan.append("• Day 7: Mock Assessment\n\n");
                plan.append("Resources: Textbooks, Online tutorials, Practice problems\n");
                plan.append("Follow-up: Weekly assessments until backlog is cleared");
                break;
            }
        }
        
        return plan.toString();
    }
}
