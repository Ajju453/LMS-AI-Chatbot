package com.learningpath.services;

import com.learningpath.models.Attendance;
import com.learningpath.models.Student;
import com.learningpath.repositories.AttendanceRepository;
import com.learningpath.repositories.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private Student student;
    private Attendance presentRecord;
    private Attendance absentRecord;

    @BeforeEach
    void setUp() {
        student = new Student("S001", "Alice", "alice@example.com", "1234567890", "Semester 1");
        student.setId(1L);
        student.setAttendancePercentage(0.0);

        presentRecord = new Attendance();
        presentRecord.setStudent(student);
        presentRecord.setIsPresent(true);
        presentRecord.setDate(LocalDate.of(2026, 3, 10));

        absentRecord = new Attendance();
        absentRecord.setStudent(student);
        absentRecord.setIsPresent(false);
        absentRecord.setDate(LocalDate.of(2026, 3, 11));
    }

    @Test
    void calculateAttendancePercentage_emptyRecords_shouldReturnZero() {
        // Arrange
        when(attendanceRepository.findByStudentId(1L)).thenReturn(Collections.emptyList());

        // Act
        double result = attendanceService.calculateAttendancePercentage(1L);

        // Assert
        assertThat(result).isEqualTo(0.0);
    }

    @Test
    void calculateAttendancePercentage_allPresent_shouldReturn100() {
        // Arrange
        when(attendanceRepository.findByStudentId(1L))
            .thenReturn(List.of(presentRecord, presentRecord));

        // Act
        double result = attendanceService.calculateAttendancePercentage(1L);

        // Assert
        assertThat(result).isEqualTo(100.0);
    }

    @Test
    void calculateAttendancePercentage_halfPresent_shouldReturn50() {
        // Arrange
        when(attendanceRepository.findByStudentId(1L))
            .thenReturn(List.of(presentRecord, absentRecord));

        // Act
        double result = attendanceService.calculateAttendancePercentage(1L);

        // Assert
        assertThat(result).isEqualTo(50.0);
    }

    @Test
    void getStudentAttendance_shouldReturnAllRecordsForStudent() {
        // Arrange
        when(attendanceRepository.findByStudentId(1L)).thenReturn(List.of(presentRecord));

        // Act
        List<Attendance> result = attendanceService.getStudentAttendance(1L);

        // Assert
        assertThat(result).hasSize(1).contains(presentRecord);
    }

    @Test
    void getStudentAttendanceByMonth_shouldFilterByDateRange() {
        // Arrange
        YearMonth month = YearMonth.of(2026, 3);
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        when(attendanceRepository.findByStudentIdAndDateBetween(1L, start, end))
            .thenReturn(List.of(presentRecord));

        // Act
        List<Attendance> result = attendanceService.getStudentAttendanceByMonth(1L, month);

        // Assert
        assertThat(result).hasSize(1).contains(presentRecord);
        verify(attendanceRepository).findByStudentIdAndDateBetween(1L, start, end);
    }

    @Test
    void getAttendanceSummary_noRecords_shouldShowZeroPercent() {
        // Arrange
        YearMonth month = YearMonth.of(2026, 3);
        when(attendanceRepository.findByStudentIdAndDateBetween(eq(1L), any(), any()))
            .thenReturn(Collections.emptyList());

        // Act
        String summary = attendanceService.getAttendanceSummary(1L, month);

        // Assert
        assertThat(summary).contains("0/0").contains("0.0%");
    }

    @Test
    void getAttendanceSummary_withRecords_shouldIncludeCorrectCounts() {
        // Arrange
        YearMonth month = YearMonth.of(2026, 3);
        // 2 present out of 3 total → 66.7%
        when(attendanceRepository.findByStudentIdAndDateBetween(eq(1L), any(), any()))
            .thenReturn(List.of(presentRecord, presentRecord, absentRecord));

        // Act
        String summary = attendanceService.getAttendanceSummary(1L, month);

        // Assert
        assertThat(summary).contains("2/3").contains("66.7%");
    }

    @Test
    void recordAttendance_withStudent_shouldSaveAndUpdateStudentPercentage() {
        // Arrange – first call from calculateAttendancePercentage inside updateStudentAttendancePercentage
        when(attendanceRepository.findByStudentId(1L)).thenReturn(List.of(presentRecord));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(attendanceRepository.save(presentRecord)).thenReturn(presentRecord);

        // Act
        Attendance result = attendanceService.recordAttendance(presentRecord);

        // Assert
        assertThat(result).isEqualTo(presentRecord);
        verify(studentRepository).save(student);
        assertThat(student.getAttendancePercentage()).isEqualTo(100.0);
    }
}
