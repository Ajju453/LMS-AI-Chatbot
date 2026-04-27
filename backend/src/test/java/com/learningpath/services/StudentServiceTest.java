package com.learningpath.services;

import com.learningpath.models.Student;
import com.learningpath.models.StudentSubject;
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
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentSubjectRepository studentSubjectRepository;

    @InjectMocks
    private StudentService studentService;

    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student("S001", "Alice", "alice@example.com", "1234567890", "Semester 1");
        student.setId(1L);
    }

    @Test
    void createStudent_shouldSaveAndReturnStudent() {
        // Arrange
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Student result = studentService.createStudent(student);

        // Assert
        assertThat(result).isEqualTo(student);
        verify(studentRepository).save(student);
    }

    @Test
    void getStudentById_existingId_shouldReturnStudent() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        // Act
        Optional<Student> result = studentService.getStudentById(1L);

        // Assert
        assertThat(result).isPresent().contains(student);
    }

    @Test
    void getStudentById_unknownId_shouldReturnEmpty() {
        // Arrange
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        Optional<Student> result = studentService.getStudentById(99L);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    void getStudentByStudentId_existingCode_shouldReturnStudent() {
        // Arrange
        when(studentRepository.findByStudentId("S001")).thenReturn(Optional.of(student));

        // Act
        Optional<Student> result = studentService.getStudentByStudentId("S001");

        // Assert
        assertThat(result).isPresent().contains(student);
    }

    @Test
    void getAllStudents_shouldReturnList() {
        // Arrange
        when(studentRepository.findAll()).thenReturn(List.of(student));

        // Act
        List<Student> result = studentService.getAllStudents();

        // Assert
        assertThat(result).hasSize(1).contains(student);
    }

    @Test
    void updateStudent_shouldSaveAndReturnUpdated() {
        // Arrange
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Student result = studentService.updateStudent(student);

        // Assert
        assertThat(result).isEqualTo(student);
        verify(studentRepository).save(student);
    }

    @Test
    void deleteStudent_shouldInvokeRepositoryDeleteById() {
        // Act
        studentService.deleteStudent(1L);

        // Assert
        verify(studentRepository).deleteById(1L);
    }

    @Test
    void getStudentBacklogs_shouldDelegateToRepository() {
        // Arrange
        StudentSubject ss = new StudentSubject();
        when(studentSubjectRepository.findByStudentIdAndHasBacklogTrue(1L)).thenReturn(List.of(ss));

        // Act
        List<StudentSubject> result = studentService.getStudentBacklogs(1L);

        // Assert
        assertThat(result).hasSize(1);
        verify(studentSubjectRepository).findByStudentIdAndHasBacklogTrue(1L);
    }

    @Test
    void calculateAttendancePercentage_studentNotFound_shouldReturnZero() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        double result = studentService.calculateAttendancePercentage(1L);

        // Assert
        assertThat(result).isEqualTo(0.0);
    }

    @Test
    void calculateAttendancePercentage_noSubjects_shouldReturnZero() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(Collections.emptyList());

        // Act
        double result = studentService.calculateAttendancePercentage(1L);

        // Assert
        assertThat(result).isEqualTo(0.0);
    }

    @Test
    void calculateAttendancePercentage_withSubjects_shouldReturnAverageTopicProgress() {
        // Arrange
        StudentSubject ss1 = new StudentSubject();
        ss1.setTopicProgress(60);
        StudentSubject ss2 = new StudentSubject();
        ss2.setTopicProgress(80);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentSubjectRepository.findByStudentId(1L)).thenReturn(List.of(ss1, ss2));

        // Act
        double result = studentService.calculateAttendancePercentage(1L);

        // Assert
        assertThat(result).isEqualTo(70.0);
    }
}
