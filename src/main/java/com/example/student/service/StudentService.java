package com.example.student.service;

import com.example.student.model.Student;
import com.example.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer that encapsulates business logic for Student operations.
 */
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Create a new student.
     */
    public String createStudent(Student student) {
        int result = studentRepository.save(student);
        if (result > 0) {
            return "Student created successfully.";
        }
        return "Failed to create student.";
    }

    /**
     * Retrieve all students.
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Retrieve a student by ID.
     */
    public Optional<Student> getStudentById(int id) {
        return studentRepository.findById(id);
    }

    /**
     * Update an existing student's details.
     */
    public String updateStudent(int id, Student student) {
        Optional<Student> existing = studentRepository.findById(id);
        if (existing.isPresent()) {
            studentRepository.update(id, student);
            return "Student updated successfully.";
        }
        return "Student with ID " + id + " not found.";
    }

    /**
     * Delete a student by ID.
     */
    public String deleteStudent(int id) {
        Optional<Student> existing = studentRepository.findById(id);
        if (existing.isPresent()) {
            studentRepository.deleteById(id);
            return "Student deleted successfully.";
        }
        return "Student with ID " + id + " not found.";
    }
}
