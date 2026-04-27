package com.learningpath.chatbot;

import com.learningpath.models.ChatMessage;
import com.learningpath.models.Student;
import com.learningpath.models.StudentSubject;
import com.learningpath.repositories.ChatMessageRepository;
import com.learningpath.repositories.StudentRepository;
import com.learningpath.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChatbotService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private SubjectService subjectService;
    
    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private BacklogReminderService backlogReminderService;
    
    @Autowired
    private ReportService reportService;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${openai.api.key}")
    private String openaiApiKey;
    
    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;
    
    public String processChatMessage(Long studentId, String userMessage) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        
        if (studentOpt.isEmpty()) {
            return "Student not found. Please login again.";
        }
        
        Student student = studentOpt.get();
        String botResponse = generateBotResponse(student, userMessage);
        
        // Save chat message
        ChatMessage message = new ChatMessage(student, userMessage, botResponse);
        message.setMessageType(detectMessageType(userMessage));
        chatMessageRepository.save(message);
        
        return botResponse;
    }
    
    private String generateBotResponse(Student student, String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        
        // Intent Detection
        if (lowerMessage.contains("backlog") || lowerMessage.contains("fail") || lowerMessage.contains("retest")) {
            return backlogReminderService.generateBacklogReminder(student.getId());
        }
        
        if (lowerMessage.contains("attendance") || lowerMessage.contains("present")) {
            double attendance = attendanceService.calculateAttendancePercentage(student.getId());
            return String.format("Your current attendance percentage is %.1f%%\n\n" +
                "Attendance is crucial for your academic success. Try to maintain above 75%% attendance. " +
                "Any questions about your attendance records?", attendance);
        }
        
        if (lowerMessage.contains("report") || lowerMessage.contains("performance")) {
            try {
                var report = reportService.generateMonthlyReport(student.getId());
                return "Your monthly report:\n\n" +
                    "Performance: " + report.getOverallPerformance() + "\n" +
                    "GPA: " + String.format("%.2f", report.getAverageGpa()) + "\n" +
                    "Attendance: " + report.getAttendanceSummary() + "\n\n" +
                    "Recommendations: " + report.getRecommendations();
            } catch (Exception e) {
                return "Could not generate report. Please try again.";
            }
        }
        
        if (lowerMessage.contains("study plan") || lowerMessage.contains("curriculum")) {
            List<StudentSubject> backlogs = backlogReminderService.getStudentBacklogs(student.getId());
            if (!backlogs.isEmpty()) {
                return backlogReminderService.generateStudyPlan(student.getId(), backlogs.get(0).getSubject().getId());
            }
            return "No specific study plan needed right now. Keep excelling!";
        }
        
        if (lowerMessage.contains("help") || lowerMessage.contains("topic") || lowerMessage.contains("explain")) {
            return getSmartTutorResponse(student, userMessage);
        }
        
        // Default: Use OpenAI
        return getOpenAIResponse(student, userMessage);
    }
    
    private String getSmartTutorResponse(Student student, String userMessage) {
        StringBuilder context = new StringBuilder();
        context.append("Student Status:\n");
        context.append("- Name: ").append(student.getName()).append("\n");
        context.append("- Semester: ").append(student.getSemester()).append("\n");
        
        List<StudentSubject> subjects = studentService.getStudentBacklogs(student.getId());
        if (!subjects.isEmpty()) {
            context.append("- Areas needing help: ");
            for (StudentSubject ss : subjects) {
                context.append(ss.getSubject().getName()).append(", ");
            }
        }
        
        return "As your learning assistant, I can help you with:\n\n" +
            "1. Concept Explanation - Explain any topic from your curriculum\n" +
            "2. Problem Solving - Help you solve practice problems\n" +
            "3. Study Tips - Suggest effective study strategies\n" +
            "4. Doubt Clearing - Clarify any confusion you have\n" +
            "5. Time Management - Help organize your study schedule\n\n" +
            "Message Example: 'Explain Newton's First Law' or 'How to solve quadratic equations?'\n\n" +
            context.toString();
    }
    
    private String getOpenAIResponse(Student student, String userMessage) {
        try {
            // Build the prompt with context
            String systemPrompt = String.format(
                "You are an intelligent educational chatbot for a learning management system. " +
                "You're helping student %s (%s) with their academic journey. " +
                "Provide helpful, encouraging, and educational responses. " +
                "Keep responses concise and practical.",
                student.getName(), student.getStudentId()
            );
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
            ));
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.7);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Call OpenAI API
            Map<String, Object> response = restTemplate.postForObject(openaiApiUrl, request, Map.class);
            
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
            
        } catch (Exception e) {
            return "I encountered an error processing your request. Please try again or contact support.";
        }
    }
    
    private String detectMessageType(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("backlog") || lower.contains("fail")) return "BACKLOG_REMINDER";
        if (lower.contains("attendance")) return "ATTENDANCE_QUERY";
        if (lower.contains("report")) return "REPORT_REQUEST";
        if (lower.contains("help") || lower.contains("explain")) return "TUTOR_QUERY";
        return "GENERAL_QUERY";
    }
    
    public List<ChatMessage> getChatHistory(Long studentId) {
        return chatMessageRepository.findByStudentIdOrderByTimestampDesc(studentId);
    }
    
    public void clearChatHistory(Long studentId) {
        List<ChatMessage> messages = chatMessageRepository.findByStudentIdOrderByTimestampDesc(studentId);
        chatMessageRepository.deleteAll(messages);
    }
}
