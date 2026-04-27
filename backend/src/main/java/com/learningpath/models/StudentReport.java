package com.learningpath.models;

import jakarta.persistence.*;
import java.time.YearMonth;

@Entity
@Table(name = "student_reports")
public class StudentReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(nullable = false)
    private YearMonth reportMonth;
    
    @Column(name = "overall_performance", columnDefinition = "TEXT")
    private String overallPerformance;
    
    @Column(name = "attendance_summary", columnDefinition = "TEXT")
    private String attendanceSummary;
    
    @Column(name = "subject_scores", columnDefinition = "TEXT")
    private String subjectScores;
    
    @Column(name = "backlog_subjects", columnDefinition = "TEXT")
    private String backlogSubjects;
    
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;
    
    @Column(name = "average_gpa")
    private Double averageGpa;

    // Constructors
    public StudentReport() {}

    public StudentReport(Student student, YearMonth reportMonth) {
        this.student = student;
        this.reportMonth = reportMonth;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public YearMonth getReportMonth() { return reportMonth; }
    public void setReportMonth(YearMonth reportMonth) { this.reportMonth = reportMonth; }

    public String getOverallPerformance() { return overallPerformance; }
    public void setOverallPerformance(String overallPerformance) { this.overallPerformance = overallPerformance; }

    public String getAttendanceSummary() { return attendanceSummary; }
    public void setAttendanceSummary(String attendanceSummary) { this.attendanceSummary = attendanceSummary; }

    public String getSubjectScores() { return subjectScores; }
    public void setSubjectScores(String subjectScores) { this.subjectScores = subjectScores; }

    public String getBacklogSubjects() { return backlogSubjects; }
    public void setBacklogSubjects(String backlogSubjects) { this.backlogSubjects = backlogSubjects; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public Double getAverageGpa() { return averageGpa; }
    public void setAverageGpa(Double averageGpa) { this.averageGpa = averageGpa; }
}
