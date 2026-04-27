package com.learningpath.controllers;

import com.learningpath.services.ReportService;
import com.learningpath.models.StudentReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @PostMapping("/generate/{studentId}")
    public ResponseEntity<Map<String, Object>> generateMonthlyReport(@PathVariable Long studentId) {
        try {
            StudentReport report = reportService.generateMonthlyReport(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", report);
            response.put("message", "Monthly report generated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error generating report: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
    
    @GetMapping("/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentReports(@PathVariable Long studentId) {
        var reports = reportService.getStudentReports(studentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", reports);
        response.put("count", reports.size());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{studentId}/month/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlyReport(
        @PathVariable Long studentId,
        @PathVariable int year,
        @PathVariable int month) {
        
        YearMonth yearMonth = YearMonth.of(year, month);
        StudentReport report = reportService.getMonthlyReport(studentId, yearMonth);
        
        Map<String, Object> response = new HashMap<>();
        if (report != null) {
            response.put("success", true);
            response.put("data", report);
        } else {
            response.put("success", false);
            response.put("message", "Report not found for this month");
        }
        
        return ResponseEntity.ok(response);
    }
}
