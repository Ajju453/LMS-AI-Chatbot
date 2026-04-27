package com.learningpath.services;

import com.learningpath.models.Attendance;
import com.learningpath.models.Student;
import com.learningpath.repositories.AttendanceRepository;
import com.learningpath.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    public Attendance recordAttendance(Attendance attendance) {
        Student student = attendance.getStudent();
        if (student != null) {
            updateStudentAttendancePercentage(student.getId());
        }
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
    
    public List<Attendance> getStudentAttendanceByMonth(Long studentId, YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        return attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate);
    }
    
    public double calculateAttendancePercentage(Long studentId) {
        List<Attendance> records = getStudentAttendance(studentId);
        if (records.isEmpty()) return 0.0;
        
        long presentCount = records.stream().filter(Attendance::getIsPresent).count();
        return (presentCount * 100.0) / records.size();
    }
    
    public void updateStudentAttendancePercentage(Long studentId) {
        double percentage = calculateAttendancePercentage(studentId);
        studentRepository.findById(studentId).ifPresent(student -> {
            student.setAttendancePercentage(percentage);
            studentRepository.save(student);
        });
    }
    
    public String getAttendanceSummary(Long studentId, YearMonth month) {
        List<Attendance> records = getStudentAttendanceByMonth(studentId, month);
        long presentCount = records.stream().filter(Attendance::getIsPresent).count();
        double percentage = records.isEmpty() ? 0.0 : (presentCount * 100.0) / records.size();
        
        return String.format("Attendance Summary for %s: %d/%d days present (%.1f%%)", 
            month, presentCount, records.size(), percentage);
    }
}
