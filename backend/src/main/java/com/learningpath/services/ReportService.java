package com.learningpath.services;

import com.learningpath.models.StudentReport;
import com.learningpath.models.StudentSubject;
import com.learningpath.repositories.StudentReportRepository;
import com.learningpath.repositories.StudentSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.YearMonth;
import java.util.List;

@Service
public class ReportService {
    
    @Autowired
    private StudentReportRepository reportRepository;
    
    @Autowired
    private StudentSubjectRepository studentSubjectRepository;
    
    @Autowired
    private AttendanceService attendanceService;
    
    public StudentReport generateMonthlyReport(Long studentId) {
        YearMonth currentMonth = YearMonth.now();
        
        StudentReport report = new StudentReport();
        report.setReportMonth(currentMonth);
        
        // Get attendance summary
        String attendanceSummary = attendanceService.getAttendanceSummary(studentId, currentMonth);
        report.setAttendanceSummary(attendanceSummary);
        
        // Get subject scores
        List<StudentSubject> subjects = studentSubjectRepository.findByStudentId(studentId);
        StringBuilder scoresSummary = new StringBuilder();
        double totalScore = 0;
        for (StudentSubject ss : subjects) {
            scoresSummary.append(ss.getSubject().getName()).append(": ")
                .append(String.format("%.2f", ss.getCurrentScore())).append(" | ");
            totalScore += ss.getCurrentScore();
        }
        report.setSubjectScores(scoresSummary.toString());
        report.setAverageGpa(subjects.isEmpty() ? 0.0 : totalScore / subjects.size());
        
        // Get backlog subjects
        List<StudentSubject> backlogs = studentSubjectRepository.findByStudentIdAndHasBacklogTrue(studentId);
        StringBuilder backlogSummary = new StringBuilder();
        for (StudentSubject ss : backlogs) {
            backlogSummary.append(ss.getSubject().getName()).append(", ");
        }
        report.setBacklogSubjects(backlogSummary.toString());
        
        // Generate recommendations
        String recommendations = generateRecommendations(subjects, backlogs);
        report.setRecommendations(recommendations);
        
        // Overall performance
        report.setOverallPerformance(determinePerformanceLevel(report.getAverageGpa()));
        
        return reportRepository.save(report);
    }
    
    private String generateRecommendations(List<StudentSubject> subjects, List<StudentSubject> backlogs) {
        StringBuilder recommendations = new StringBuilder();
        
        if (backlogs.isEmpty()) {
            recommendations.append("Great job! No backlogs. Keep maintaining your performance. ");
        } else {
            recommendations.append("Focus on clearing backlog subjects: ");
            for (StudentSubject ss : backlogs) {
                recommendations.append(ss.getSubject().getName()).append(", ");
            }
        }
        
        double avgScore = subjects.stream()
            .mapToDouble(ss -> ss.getCurrentScore())
            .average()
            .orElse(0.0);
            
        if (avgScore < 40) {
            recommendations.append("Urgent: Your overall performance is below average. Seek additional help. ");
        } else if (avgScore < 70) {
            recommendations.append("Increase study time and focus on difficult topics. ");
        }
        
        recommendations.append("Maintain consistent attendance and engage with learning resources.");
        return recommendations.toString();
    }
    
    private String determinePerformanceLevel(Double gpa) {
        if (gpa >= 8.0) return "EXCELLENT";
        if (gpa >= 7.0) return "VERY GOOD";
        if (gpa >= 6.0) return "GOOD";
        if (gpa >= 5.0) return "AVERAGE";
        return "NEEDS IMPROVEMENT";
    }
    
    public StudentReport getMonthlyReport(Long studentId, YearMonth month) {
        return reportRepository.findByStudentIdAndReportMonth(studentId, month).orElse(null);
    }
    
    public List<StudentReport> getStudentReports(Long studentId) {
        return reportRepository.findByStudentId(studentId);
    }
}
