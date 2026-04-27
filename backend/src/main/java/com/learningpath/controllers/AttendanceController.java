package com.learningpath.controllers;

import com.learningpath.models.Attendance;
import com.learningpath.services.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> recordAttendance(@RequestBody Attendance attendance) {
        Attendance recorded = attendanceService.recordAttendance(attendance);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", recorded);
        response.put("message", "Attendance recorded successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentAttendance(@PathVariable Long studentId) {
        var attendance = attendanceService.getStudentAttendance(studentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", attendance);
        response.put("count", attendance.size());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/student/{studentId}/month/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlyAttendance(
        @PathVariable Long studentId,
        @PathVariable int year,
        @PathVariable int month) {
        
        YearMonth yearMonth = YearMonth.of(year, month);
        var attendance = attendanceService.getStudentAttendanceByMonth(studentId, yearMonth);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", attendance);
        response.put("count", attendance.size());
        response.put("summary", attendanceService.getAttendanceSummary(studentId, yearMonth));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/student/{studentId}/percentage")
    public ResponseEntity<Map<String, Object>> getAttendancePercentage(@PathVariable Long studentId) {
        double percentage = attendanceService.calculateAttendancePercentage(studentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("percentage", percentage);
        response.put("status", percentage >= 75 ? "GOOD" : "NEEDS IMPROVEMENT");
        
        return ResponseEntity.ok(response);
    }
}
