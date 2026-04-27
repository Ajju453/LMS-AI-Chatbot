package com.learningpath.services;

import com.learningpath.models.Student;
import com.learningpath.models.StudentSubject;
import com.learningpath.repositories.StudentRepository;
import com.learningpath.repositories.StudentSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StudentSubjectRepository studentSubjectRepository;
    
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }
    
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }
    
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    
    public List<StudentSubject> getStudentBacklogs(Long studentId) {
        return studentSubjectRepository.findByStudentIdAndHasBacklogTrue(studentId);
    }
    
    public double calculateAttendancePercentage(Long studentId) {
        Optional<Student> student = studentRepository.findById(studentId);
        if (student.isPresent()) {
            List<StudentSubject> subjects = studentSubjectRepository.findByStudentId(studentId);
            if (!subjects.isEmpty()) {
                double totalPercentage = 0;
                for (StudentSubject ss : subjects) {
                    totalPercentage += ss.getTopicProgress();
                }
                return totalPercentage / subjects.size();
            }
        }
        return 0.0;
    }
}
