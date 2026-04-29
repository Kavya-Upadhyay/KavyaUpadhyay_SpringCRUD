package com.example.student.repository;

import com.example.student.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Repository class that performs CRUD operations on the 'students' table
 * using Spring's JdbcTemplate (no ORM).
 */
@Repository
public class StudentRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public StudentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * RowMapper to map each row of the ResultSet to a Student object.
     */
    private final RowMapper<Student> studentRowMapper = new RowMapper<>() {
        @Override
        public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
            Student student = new Student();
            student.setId(rs.getInt("id"));
            student.setName(rs.getString("name"));
            student.setEmail(rs.getString("email"));
            student.setCourse(rs.getString("course"));
            return student;
        }
    };

    /**
     * Insert a new student record into the database.
     *
     * @param student the student to insert
     * @return the number of rows affected
     */
    public int save(Student student) {
        String sql = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getCourse());
    }

    /**
     * Fetch all student records from the database.
     *
     * @return list of all students
     */
    public List<Student> findAll() {
        String sql = "SELECT * FROM students";
        return jdbcTemplate.query(sql, studentRowMapper);
    }

    /**
     * Fetch a student by their ID.
     *
     * @param id the student's ID
     * @return an Optional containing the student if found
     */
    public Optional<Student> findById(int id) {
        String sql = "SELECT * FROM students WHERE id = ?";
        List<Student> students = jdbcTemplate.query(sql, studentRowMapper, id);
        return students.stream().findFirst();
    }

    /**
     * Update an existing student's details.
     *
     * @param id      the ID of the student to update
     * @param student the updated student data
     * @return the number of rows affected
     */
    public int update(int id, Student student) {
        String sql = "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?";
        return jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getCourse(), id);
    }

    /**
     * Delete a student record by ID.
     *
     * @param id the ID of the student to delete
     * @return the number of rows affected
     */
    public int deleteById(int id) {
        String sql = "DELETE FROM students WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
