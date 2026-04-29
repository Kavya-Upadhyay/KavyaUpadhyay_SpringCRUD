package com.example.student.controller;

import com.example.student.model.Student;
import com.example.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller that exposes CRUD endpoints for Student resources.
 */
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * POST /students → Create a new student.
     */
    @PostMapping
    public ResponseEntity<String> createStudent(@RequestBody Student student) {
        String message = studentService.createStudent(student);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    /**
     * GET /students → Retrieve all students.
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    /**
     * GET /students/{id} → Retrieve a student by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable int id) {
        Optional<Student> student = studentService.getStudentById(id);
        if (student.isPresent()) {
            return new ResponseEntity<>(student.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Student with ID " + id + " not found.", HttpStatus.NOT_FOUND);
    }

    /**
     * PUT /students/{id} → Update an existing student.
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateStudent(@PathVariable int id, @RequestBody Student student) {
        String message = studentService.updateStudent(id, student);
        if (message.contains("not found")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    /**
     * DELETE /students/{id} → Delete a student by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable int id) {
        String message = studentService.deleteStudent(id);
        if (message.contains("not found")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
