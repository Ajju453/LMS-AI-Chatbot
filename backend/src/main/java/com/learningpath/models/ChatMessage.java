package com.learningpath.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    private Student student;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String userMessage;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String botResponse;
    
    @Column(name = "message_type")
    private String messageType; // QUERY, REMINDER, FEEDBACK, etc.
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Column(name = "subject_context")
    private String subjectContext;
    
    @Column(name = "topic_context")
    private String topicContext;

    // Constructors
    public ChatMessage() {}

    public ChatMessage(Student student, String userMessage, String botResponse) {
        this.student = student;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.timestamp = LocalDateTime.now();
        this.messageType = "QUERY";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }

    public String getBotResponse() { return botResponse; }
    public void setBotResponse(String botResponse) { this.botResponse = botResponse; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getSubjectContext() { return subjectContext; }
    public void setSubjectContext(String subjectContext) { this.subjectContext = subjectContext; }

    public String getTopicContext() { return topicContext; }
    public void setTopicContext(String topicContext) { this.topicContext = topicContext; }
}
