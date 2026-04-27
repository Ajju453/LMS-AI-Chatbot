package com.learningpath.services;

import com.learningpath.models.Student;
import com.learningpath.models.StudentSubject;
import com.learningpath.models.Subject;
import com.learningpath.repositories.ChatMessageRepository;
import com.learningpath.repositories.StudentRepository;
import com.learningpath.repositories.StudentSubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BacklogReminderServiceTest {

    @Mock
    private StudentSubjectRepository studentSubjectRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @InjectMocks
    private BacklogReminderService backlogReminderService;

    private Student student;
    private Subject subject;
    private StudentSubject studentSubject;

    @BeforeEach
    void setUp() {
        student = new Student("S001", "Bob", "bob@example.com", "9876543210", "Semester 2");
        student.setId(1L);

        subject = new Subject("Physics", "PHY101", "Semester 2", 3);
        subject.setId(10L);

        studentSubject = new StudentSubject(student, subject);
        studentSubject.setCurrentScore(35.0);
        studentSubject.setHasBacklog(true);
        studentSubject.setBacklogCount(1);
        studentSubject.setTopicProgress(40);
    }

    @Test
    void getAllBacklogs_shouldReturnAllBacklogEntries() {
        // Arrange
        when(studentSubjectRepository.findByHasBacklogTrue()).thenReturn(List.of(studentSubject));

        // Act
        List<StudentSubject> result = backlogReminderService.getAllBacklogs();

        // Assert
        assertThat(result).hasSize(1).contains(studentSubject);
        verify(studentSubjectRepository).findByHasBacklogTrue();
    }

    @Test
    void getStudentBacklogs_shouldReturnBacklogsForGivenStudent() {
        // Arrange
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L))
            .thenReturn(List.of(studentSubject));

        // Act
        List<StudentSubject> result = backlogReminderService.getStudentBacklogs(1L);

        // Assert
        assertThat(result).hasSize(1).contains(studentSubject);
    }

    @Test
    void generateBacklogReminder_noBacklogs_shouldReturnSuccessMessage() {
        // Arrange
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L))
            .thenReturn(Collections.emptyList());

        // Act
        String reminder = backlogReminderService.generateBacklogReminder(1L);

        // Assert
        assertThat(reminder).contains("no backlogs");
    }

    @Test
    void generateBacklogReminder_withBacklogs_shouldIncludeStudentNameAndSubjectDetails() {
        // Arrange
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L))
            .thenReturn(List.of(studentSubject));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        // Act
        String reminder = backlogReminderService.generateBacklogReminder(1L);

        // Assert
        assertThat(reminder)
            .contains("Bob")
            .contains("Physics")
            .contains("35.00")
            .contains("Action Items");
    }

    @Test
    void generateBacklogReminder_studentNotFound_shouldFallBackToDefaultName() {
        // Arrange
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L))
            .thenReturn(List.of(studentSubject));
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        String reminder = backlogReminderService.generateBacklogReminder(1L);

        // Assert – "Student" is used when student not found
        assertThat(reminder).contains("Student");
    }

    @Test
    void generateStudyPlan_matchingSubjectId_shouldIncludeSubjectAndSchedule() {
        // Arrange
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L))
            .thenReturn(List.of(studentSubject));

        // Act
        String plan = backlogReminderService.generateStudyPlan(1L, 10L);

        // Assert
        assertThat(plan)
            .contains("Physics")
            .contains("2 weeks intensive")
            .contains("Weekly Schedule");
    }

    @Test
    void generateStudyPlan_noMatchingSubjectId_shouldReturnHeaderOnly() {
        // Arrange
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L))
            .thenReturn(Collections.emptyList());

        // Act
        String plan = backlogReminderService.generateStudyPlan(1L, 99L);

        // Assert
        assertThat(plan).contains("Personalized Study Plan");
        assertThat(plan).doesNotContain("Subject:");
    }
}
