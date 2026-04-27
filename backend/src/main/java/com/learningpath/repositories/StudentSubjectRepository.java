package com.learningpath.repositories;

import com.learningpath.models.StudentSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSubjectRepository extends JpaRepository<StudentSubject, Long> {
    List<StudentSubject> findByStudentId(Long studentId);
    List<StudentSubject> findBySubjectId(Long subjectId);
    Optional<StudentSubject> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    List<StudentSubject> findByHasBacklogTrue();
    List<StudentSubject> findByStudentIdAndHasBacklogTrue(Long studentId);
}
