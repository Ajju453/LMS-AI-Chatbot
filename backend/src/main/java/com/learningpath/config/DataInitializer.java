package com.learningpath.config;

import com.learningpath.models.*;
import com.learningpath.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private StudentSubjectRepository studentSubjectRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            System.out.println("📚 Initializing University Database...");
            
            // Create Teachers
            List<Teacher> teachers = createTeachers();
            System.out.println("✓ " + teachers.size() + " Teachers created");
            
            // Create Subjects
            List<Subject> subjects = createSubjects(teachers);
            System.out.println("✓ " + subjects.size() + " Subjects created");
            
            // Create Topics
            createTopics(subjects);
            System.out.println("✓ Topics created for all subjects");
            
            // Create Students
            List<Student> students = createStudents();
            System.out.println("✓ " + students.size() + " Students created");
            
            // Assign Students to Subjects
            assignStudentsToSubjects(students, subjects);
            System.out.println("✓ Students assigned to subjects");
            
            // Create Attendance Records
            createAttendanceRecords(students);
            System.out.println("✓ Attendance records created");
            
            System.out.println("✅ Database initialization complete!");
        }
    }
    
    private List<Teacher> createTeachers() {
        List<Teacher> teachers = new ArrayList<>();
        Teacher[] teacherData = {
            new Teacher("Dr. Rajesh Kumar", "rajesh.kumar@university.edu", "+91-98765-43210", "Computer Science", "Ph.D. in CS", 12),
            new Teacher("Prof. Priya Sharma", "priya.sharma@university.edu", "+91-98765-43211", "Mathematics", "M.Tech in Mathematics", 8),
            new Teacher("Dr. Arjun Gupta", "arjun.gupta@university.edu", "+91-98765-43212", "Data Science", "Ph.D. in Data Science", 10),
            new Teacher("Prof. Neha Patel", "neha.patel@university.edu", "+91-98765-43213", "Web Development", "B.Tech in IT", 6),
            new Teacher("Dr. Vikram Singh", "vikram.singh@university.edu", "+91-98765-43214", "Database Systems", "Ph.D. in CS", 14),
            new Teacher("Prof. Snehal Patil", "snehal.patil@university.edu", "+91-98765-43215", "Operating Systems", "M.Tech in CS", 9)
        };
        
        for (Teacher teacher : teacherData) {
            teachers.add(teacherRepository.save(teacher));
        }
        return teachers;
    }
    
    private List<Subject> createSubjects(List<Teacher> teachers) {
        List<Subject> subjects = new ArrayList<>();
        
        Subject[] subjectsData = {
            new Subject("Object Oriented Programming", "CS101", "1", 4),
            new Subject("Data Structures", "CS102", "1", 4),
            new Subject("Database Management", "CS103", "1", 3),
            new Subject("Web Development", "CS104", "2", 4),
            new Subject("Advanced Java", "CS201", "2", 4),
            new Subject("Operating System", "CS105", "2", 4)
        };
        
        // Each teacher teaches exactly one different subject based on their specialization
        subjectsData[0].setDescription("Learn OOP concepts including classes, inheritance, polymorphism, and design patterns.");
        subjectsData[0].setTeacher(teachers.get(0)); // Dr. Rajesh Kumar - Computer Science
        subjects.add(subjectRepository.save(subjectsData[0]));
        
        subjectsData[1].setDescription("Master fundamental data structures and algorithms for efficient problem solving.");
        subjectsData[1].setTeacher(teachers.get(1)); // Prof. Priya Sharma - Mathematics
        subjects.add(subjectRepository.save(subjectsData[1]));
        
        subjectsData[2].setDescription("Design and manage relational databases with SQL and normalization concepts.");
        subjectsData[2].setTeacher(teachers.get(4)); // Dr. Vikram Singh - Database Systems
        subjects.add(subjectRepository.save(subjectsData[2]));
        
        subjectsData[3].setDescription("Build responsive and interactive web applications using HTML, CSS, and JavaScript.");
        subjectsData[3].setTeacher(teachers.get(3)); // Prof. Neha Patel - Web Development
        subjects.add(subjectRepository.save(subjectsData[3]));
        
        subjectsData[4].setDescription("Deep dive into Java for enterprise applications with Spring Framework.");
        subjectsData[4].setTeacher(teachers.get(2)); // Dr. Arjun Gupta - Data Science
        subjects.add(subjectRepository.save(subjectsData[4]));
        
        subjectsData[5].setDescription("Understand core operating system concepts including process management, memory management, and file systems.");
        subjectsData[5].setTeacher(teachers.get(5)); // Prof. Snehal Patil - Operating Systems
        subjects.add(subjectRepository.save(subjectsData[5]));
        
        return subjects;
    }
    
    private void createTopics(List<Subject> subjects) {
        // OOP Topics
        Subject oopSubject = subjects.get(0);
        createTopic("Classes and Objects", "Introduction to OOP fundamentals", 4.0, "EASY", oopSubject, 1);
        createTopic("Inheritance and Polymorphism", "Extend classes and override methods", 6.0, "MEDIUM", oopSubject, 2);
        createTopic("Encapsulation and Abstraction", "Hide implementation details", 5.0, "MEDIUM", oopSubject, 3);
        createTopic("Design Patterns", "Singleton, Factory, Observer patterns", 8.0, "HARD", oopSubject, 4);
        
        // Data Structures Topics
        Subject dsSubject = subjects.get(1);
        createTopic("Arrays and Lists", "Linear data structures", 4.0, "EASY", dsSubject, 1);
        createTopic("Stacks and Queues", "LIFO and FIFO structures", 5.0, "EASY", dsSubject, 2);
        createTopic("Trees and Graphs", "Hierarchical and network structures", 8.0, "HARD", dsSubject, 3);
        createTopic("Sorting and Searching", "Algorithm analysis and optimization", 7.0, "MEDIUM", dsSubject, 4);
        
        // Database Topics
        Subject dbSubject = subjects.get(2);
        createTopic("SQL Basics", "SELECT, INSERT, UPDATE, DELETE operations", 5.0, "EASY", dbSubject, 1);
        createTopic("Database Normalization", "1NF, 2NF, 3NF concepts", 6.0, "MEDIUM", dbSubject, 2);
        createTopic("Joins and Relationships", "Understanding foreign keys and joins", 5.0, "MEDIUM", dbSubject, 3);
        createTopic("Indexing and Optimization", "Performance tuning techniques", 6.0, "HARD", dbSubject, 4);
        
        // Web Dev Topics
        Subject webSubject = subjects.get(3);
        createTopic("HTML Fundamentals", "Markup syntax and semantic HTML", 3.0, "EASY", webSubject, 1);
        createTopic("CSS Styling", "Layouts, flexbox, and responsive design", 5.0, "EASY", webSubject, 2);
        createTopic("JavaScript ES6", "Modern JavaScript features and DOM manipulation", 7.0, "MEDIUM", webSubject, 3);
        createTopic("Frontend Frameworks", "React, Vue, or Angular basics", 8.0, "HARD", webSubject, 4);
        
        // Advanced Java Topics
        Subject javaSubject = subjects.get(4);
        createTopic("Spring Framework Basics", "Dependency injection and IoC", 6.0, "MEDIUM", javaSubject, 1);
        createTopic("Spring Boot", "Quick development with auto-configuration", 5.0, "MEDIUM", javaSubject, 2);
        createTopic("REST APIs", "Building RESTful web services", 7.0, "MEDIUM", javaSubject, 3);
        createTopic("Microservices Architecture", "Building scalable systems", 9.0, "HARD", javaSubject, 4);
        
        // Operating System Topics
        Subject osSubject = subjects.get(5);
        createTopic("Process Management", "Process creation, scheduling, and synchronization", 7.0, "MEDIUM", osSubject, 1);
        createTopic("Memory Management", "Virtual memory, paging, and segmentation", 8.0, "HARD", osSubject, 2);
        createTopic("File Systems", "File organization and disk management", 6.0, "MEDIUM", osSubject, 3);
        createTopic("Deadlock and IPC", "Inter-process communication and deadlock handling", 8.0, "HARD", osSubject, 4);
    }
    
    private void createTopic(String name, String description, Double hours, String difficulty, Subject subject, Integer order) {
        Topic topic = new Topic();
        topic.setName(name);
        topic.setDescription(description);
        topic.setEstimatedHours(hours);
        topic.setDifficultyLevel(difficulty);
        topic.setSubject(subject);
        topic.setSequenceOrder(order);
        topic.setLearningObjectives("Master " + name + " concepts and applications");
        topic.setResources("Textbooks, online tutorials, and coding exercises");
        topicRepository.save(topic);
    }
    
    private List<Student> createStudents() {
        List<Student> students = new ArrayList<>();
        
        String[] firstNames = {
            "Aisha", "Rohan", "Priyanka", "Arjun", "Divya", "Vikram", "Neha", "Raj", "Pooja", "Kunal",
            "Shreya", "Arun", "Anjali", "Deepak", "Kavya", "Sanjay", "Ritu", "Rahul", "Sneha", "Nitin",
            "Aditi", "Abhishek", "Bhavna", "Chirag", "Diya", "Esha", "Farhan", "Geeta", "Hari", "Isha",
            "Jatin", "Karan", "Laila", "Manish", "Nisha", "Omkar", "Piyush", "Qadir", "Riya", "Suresh",
            "Tanvi", "Uday", "Vani", "Waqar", "Xenia", "Yash", "Zara", "Amar", "Bhavesh", "Chanda",
            "Darsh", "Ekta", "Farida", "Gaurav", "Harjeet", "Ishan", "Jasmine", "Kailash", "Lakshmi", "Mahesh",
            "Naveen", "Oshawott", "Palak", "Quentin", "Rajan", "Sakshi", "Tarun", "Usha", "Varun", "Wajid",
            "Yana", "Zainab", "Ashok", "Bhawna", "Chandrika", "Devendra", "Eva", "Firdaus", "Gajendra", "Heena"
        };
        
        String[] lastNames = {
            "Sharma", "Patel", "Kumar", "Singh", "Desai", "Nair", "Iyer", "Rao", "Gupta", "Mishra",
            "Verma", "Joshi", "Kapoor", "Khan", "Chopra", "Banerjee", "Das", "Chatterjee", "Sinha", "Roy",
            "Reddy", "Yadav", "Pandey", "Bhat", "Hegde", "Kulkarni", "Mahajan", "Saxena", "Trivedi", "Agarwal"
        };
        
        int rollNumber = 2223810;
        for (int i = 0; i < 80; i++) {
            String firstName = firstNames[i % firstNames.length];
            String lastName = lastNames[i % lastNames.length];
            String fullName = firstName + " " + lastName;
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@student.university.edu";
            String phone = String.format("9876%06d", 543210 + i);
            String semester = ((i % 4) + 1) + "";
            double gpa = 3.0 + Math.random() * 1.0; // 3.0 to 4.0
            
            Student student = new Student();
            student.setStudentId(String.valueOf(rollNumber));
            student.setName(fullName);
            student.setEmail(email);
            student.setPhone(phone);
            student.setSemester(semester);
            student.setGpa(Math.round(gpa * 100.0) / 100.0);
            student.setAttendancePercentage(70.0 + Math.random() * 30); // 70-100%
            student.setCreatedAt(LocalDateTime.now());
            student.setUpdatedAt(LocalDateTime.now());
            
            students.add(studentRepository.save(student));
            rollNumber++;
        }
        return students;
    }
    
    private void assignStudentsToSubjects(List<Student> students, List<Subject> subjects) {
        for (Student student : students) {
            // Assign each student to 3-4 random subjects
            int subjectCount = 3 + (int)(Math.random() * 2);
            for (int i = 0; i < subjectCount; i++) {
                Subject subject = subjects.get((int)(Math.random() * subjects.size()));
                
                // Check if already assigned
                if (studentSubjectRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId()).isEmpty()) {
                    StudentSubject ss = new StudentSubject();
                    ss.setStudent(student);
                    ss.setSubject(subject);
                    ss.setCurrentScore(60.0 + Math.random() * 40); // 60-100
                    ss.setHasBacklog(Math.random() < 0.2); // 20% chance of backlog
                    ss.setTopicProgress((int)(Math.random() * 100)); // 0-100%
                    if (ss.getHasBacklog()) {
                        ss.setBacklogCount((int)(1 + Math.random() * 3)); // 1-3 backlogs
                    }
                    studentSubjectRepository.save(ss);
                }
            }
        }
    }
    
    private void createAttendanceRecords(List<Student> students) {
        for (Student student : students) {
            // Create 4 months of attendance (Dec 2025 to March 2026 - ~120 days)
            LocalDate startDate = LocalDate.of(2025, 12, 1);
            LocalDate endDate = LocalDate.of(2026, 3, 31);
            
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                Attendance attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setDate(date);
                attendance.setPresent(Math.random() < 0.75); // 75% attendance rate
                attendance.setCreatedAt(LocalDateTime.now());
                attendanceRepository.save(attendance);
            }
        }
    }
}

