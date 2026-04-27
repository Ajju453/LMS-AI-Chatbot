package com.learningpath.services;

import com.learningpath.models.Subject;
import com.learningpath.models.Topic;
import com.learningpath.repositories.SubjectRepository;
import com.learningpath.repositories.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubjectServiceTest {

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private TopicRepository topicRepository;

    @InjectMocks
    private SubjectService subjectService;

    private Subject subject;
    private Topic topic;

    @BeforeEach
    void setUp() {
        subject = new Subject("Mathematics", "MATH101", "Semester 1", 4);
        subject.setId(1L);

        topic = new Topic("Algebra", "Basic algebra concepts", 5.0, "MEDIUM", subject);
        topic.setId(1L);
        topic.setSequenceOrder(1);
    }

    @Test
    void createSubject_shouldSaveAndReturn() {
        // Arrange
        when(subjectRepository.save(subject)).thenReturn(subject);

        // Act
        Subject result = subjectService.createSubject(subject);

        // Assert
        assertThat(result).isEqualTo(subject);
        verify(subjectRepository).save(subject);
    }

    @Test
    void getSubjectById_existing_shouldReturnSubject() {
        // Arrange
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));

        // Act
        Optional<Subject> result = subjectService.getSubjectById(1L);

        // Assert
        assertThat(result).isPresent().contains(subject);
    }

    @Test
    void getSubjectById_missing_shouldReturnEmpty() {
        // Arrange
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        Optional<Subject> result = subjectService.getSubjectById(99L);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    void getSubjectByCode_shouldReturnMatchingSubject() {
        // Arrange
        when(subjectRepository.findByCode("MATH101")).thenReturn(Optional.of(subject));

        // Act
        Optional<Subject> result = subjectService.getSubjectByCode("MATH101");

        // Assert
        assertThat(result).isPresent().contains(subject);
    }

    @Test
    void getSubjectsBySemester_shouldReturnList() {
        // Arrange
        when(subjectRepository.findBySemester("Semester 1")).thenReturn(List.of(subject));

        // Act
        List<Subject> result = subjectService.getSubjectsBySemester("Semester 1");

        // Assert
        assertThat(result).hasSize(1).contains(subject);
    }

    @Test
    void getAllSubjects_shouldReturnAllSubjects() {
        // Arrange
        when(subjectRepository.findAll()).thenReturn(List.of(subject));

        // Act
        List<Subject> result = subjectService.getAllSubjects();

        // Assert
        assertThat(result).hasSize(1).contains(subject);
    }

    @Test
    void deleteSubject_shouldInvokeRepositoryDeleteById() {
        // Act
        subjectService.deleteSubject(1L);

        // Assert
        verify(subjectRepository).deleteById(1L);
    }

    @Test
    void createTopic_shouldSaveAndReturnTopic() {
        // Arrange
        when(topicRepository.save(topic)).thenReturn(topic);

        // Act
        Topic result = subjectService.createTopic(topic);

        // Assert
        assertThat(result).isEqualTo(topic);
        verify(topicRepository).save(topic);
    }

    @Test
    void getTopicsBySubjectId_shouldReturnOrderedList() {
        // Arrange
        when(topicRepository.findBySubjectIdOrderBySequenceOrderAsc(1L)).thenReturn(List.of(topic));

        // Act
        List<Topic> result = subjectService.getTopicsBySubjectId(1L);

        // Assert
        assertThat(result).hasSize(1).contains(topic);
        verify(topicRepository).findBySubjectIdOrderBySequenceOrderAsc(1L);
    }

    @Test
    void deleteTopic_shouldInvokeRepositoryDeleteById() {
        // Act
        subjectService.deleteTopic(1L);

        // Assert
        verify(topicRepository).deleteById(1L);
    }

    @Test
    void getCurriculumPlan_subjectNotFound_shouldReturnNotFoundMessage() {
        // Arrange
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        String result = subjectService.getCurriculumPlan(99L);

        // Assert
        assertThat(result).isEqualTo("Subject not found");
    }

    @Test
    void getCurriculumPlan_subjectFoundWithTopics_shouldContainSubjectAndTopicDetails() {
        // Arrange
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(topicRepository.findBySubjectIdOrderBySequenceOrderAsc(1L)).thenReturn(List.of(topic));

        // Act
        String result = subjectService.getCurriculumPlan(1L);

        // Assert
        assertThat(result)
            .contains("Mathematics")
            .contains("Algebra")
            .contains("5.0 hours")
            .contains("MEDIUM")
            .contains("Total Estimated Hours: 5.0");
    }

    @Test
    void getCurriculumPlan_noTopics_shouldShowZeroTotals() {
        // Arrange
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(topicRepository.findBySubjectIdOrderBySequenceOrderAsc(1L)).thenReturn(List.of());

        // Act
        String result = subjectService.getCurriculumPlan(1L);

        // Assert
        assertThat(result)
            .contains("Total Topics: 0")
            .contains("Total Estimated Hours: 0.0");
    }
}
