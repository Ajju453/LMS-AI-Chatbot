package com.learningpath.services;

import com.learningpath.models.StudentReport;
import com.learningpath.models.StudentSubject;
import com.learningpath.models.Subject;
import com.learningpath.repositories.StudentReportRepository;
import com.learningpath.repositories.StudentSubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.YearMonth;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private StudentReportRepository reportRepository;

    @Mock
    private StudentSubjectRepository studentSubjectRepository;

    @Mock
    private AttendanceService attendanceService;

    @InjectMocks
    private ReportService reportService;

    private StudentSubject highScoreSubject;
    private StudentSubject lowScoreSubject;

    @BeforeEach
    void setUp() {
        Subject subjectA = new Subject("Maths", "M101", "Semester 1", 4);
        subjectA.setId(1L);

        Subject subjectB = new Subject("Science", "S101", "Semester 1", 3);
        subjectB.setId(2L);

        highScoreSubject = new StudentSubject();
        highScoreSubject.setSubject(subjectA);
        highScoreSubject.setCurrentScore(85.0);
        highScoreSubject.setHasBacklog(false);

        lowScoreSubject = new StudentSubject();
        lowScoreSubject.setSubject(subjectB);
        lowScoreSubject.setCurrentScore(30.0);
        lowScoreSubject.setHasBacklog(true);
    }

    @Test
    void generateMonthlyReport_noSubjects_shouldReturnNeedsImprovementWithZeroGpa() {
        // Arrange
        when(attendanceService.getAttendanceSummary(any(), any()))
            .thenReturn("Attendance Summary: 0/0 days present (0.0%)");
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(Collections.emptyList());
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L)).thenReturn(Collections.emptyList());
        when(reportRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        StudentReport report = reportService.generateMonthlyReport(1L);

        // Assert
        assertThat(report.getAverageGpa()).isEqualTo(0.0);
        assertThat(report.getOverallPerformance()).isEqualTo("NEEDS IMPROVEMENT");
        assertThat(report.getRecommendations()).contains("Great job");
    }

    @Test
    void generateMonthlyReport_highScore_shouldReturnExcellentPerformance() {
        // Arrange
        when(attendanceService.getAttendanceSummary(any(), any()))
            .thenReturn("Attendance Summary: 10/10 days present (100.0%)");
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(List.of(highScoreSubject));
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L)).thenReturn(Collections.emptyList());
        when(reportRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        StudentReport report = reportService.generateMonthlyReport(1L);

        // Assert – 85.0 >= 8.0 threshold → EXCELLENT
        assertThat(report.getAverageGpa()).isEqualTo(85.0);
        assertThat(report.getOverallPerformance()).isEqualTo("EXCELLENT");
        assertThat(report.getRecommendations()).contains("Great job");
    }

    @Test
    void generateMonthlyReport_withBacklogs_shouldIncludeBacklogSubjectName() {
        // Arrange
        when(attendanceService.getAttendanceSummary(any(), any()))
            .thenReturn("Attendance Summary: 5/10 days present (50.0%)");
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(List.of(lowScoreSubject));
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L)).thenReturn(List.of(lowScoreSubject));
        when(reportRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        StudentReport report = reportService.generateMonthlyReport(1L);

        // Assert
        assertThat(report.getBacklogSubjects()).contains("Science");
        assertThat(report.getRecommendations()).contains("Science");
    }

    @Test
    void generateMonthlyReport_avgScoreBelow40_shouldIncludeUrgentRecommendation() {
        // Arrange – score 35 < 40 triggers urgent message
        when(attendanceService.getAttendanceSummary(any(), any()))
            .thenReturn("Attendance Summary: 3/10 days present (30.0%)");
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(List.of(lowScoreSubject));
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L)).thenReturn(List.of(lowScoreSubject));
        when(reportRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        StudentReport report = reportService.generateMonthlyReport(1L);

        // Assert
        assertThat(report.getRecommendations()).contains("Urgent");
    }

    @Test
    void generateMonthlyReport_shouldPersistViaRepository() {
        // Arrange
        when(attendanceService.getAttendanceSummary(any(), any())).thenReturn("summary");
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(Collections.emptyList());
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L)).thenReturn(Collections.emptyList());
        when(reportRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        reportService.generateMonthlyReport(1L);

        // Assert
        verify(reportRepository).save(any(StudentReport.class));
    }

    @Test
    void getMonthlyReport_found_shouldReturnReport() {
        // Arrange
        YearMonth month = YearMonth.of(2026, 3);
        StudentReport report = new StudentReport();
        when(reportRepository.findByStudentIdAndReportMonth(1L, month)).thenReturn(Optional.of(report));

        // Act
        StudentReport result = reportService.getMonthlyReport(1L, month);

        // Assert
        assertThat(result).isEqualTo(report);
    }

    @Test
    void getMonthlyReport_notFound_shouldReturnNull() {
        // Arrange
        YearMonth month = YearMonth.of(2026, 3);
        when(reportRepository.findByStudentIdAndReportMonth(1L, month)).thenReturn(Optional.empty());

        // Act
        StudentReport result = reportService.getMonthlyReport(1L, month);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    void getStudentReports_shouldReturnAllReportsForStudent() {
        // Arrange
        StudentReport report = new StudentReport();
        when(reportRepository.findByStudentId(1L)).thenReturn(List.of(report));

        // Act
        List<StudentReport> results = reportService.getStudentReports(1L);

        // Assert
        assertThat(results).hasSize(1).contains(report);
    }
}
