package com.learningpath.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_subjects")
public class StudentSubject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @Column(name = "current_score")
    private Double currentScore;
    
    @Column(name = "has_backlog")
    private Boolean hasBacklog = false;
    
    @Column(name = "backlog_count")
    private Integer backlogCount = 0;
    
    @Column(name = "last_reminder_sent")
    private LocalDateTime lastReminderSent;
    
    @Column(name = "topic_progress")
    private Integer topicProgress = 0; // percentage

    // Constructors
    public StudentSubject() {}

    public StudentSubject(Student student, Subject subject) {
        this.student = student;
        this.subject = subject;
        this.currentScore = 0.0;
        this.hasBacklog = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public Double getCurrentScore() { return currentScore; }
    public void setCurrentScore(Double currentScore) { this.currentScore = currentScore; }

    public Boolean getHasBacklog() { return hasBacklog; }
    public void setHasBacklog(Boolean hasBacklog) { this.hasBacklog = hasBacklog; }

    public Integer getBacklogCount() { return backlogCount; }
    public void setBacklogCount(Integer backlogCount) { this.backlogCount = backlogCount; }

    public LocalDateTime getLastReminderSent() { return lastReminderSent; }
    public void setLastReminderSent(LocalDateTime lastReminderSent) { this.lastReminderSent = lastReminderSent; }

    public Integer getTopicProgress() { return topicProgress; }
    public void setTopicProgress(Integer topicProgress) { this.topicProgress = topicProgress; }
}
