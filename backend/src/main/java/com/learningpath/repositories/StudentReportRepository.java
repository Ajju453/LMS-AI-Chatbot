package com.learningpath.repositories;

import com.learningpath.models.StudentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentReportRepository extends JpaRepository<StudentReport, Long> {
    List<StudentReport> findByStudentId(Long studentId);
    Optional<StudentReport> findByStudentIdAndReportMonth(Long studentId, YearMonth reportMonth);
}
