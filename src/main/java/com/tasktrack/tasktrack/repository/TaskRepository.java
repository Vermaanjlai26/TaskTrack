package com.tasktrack.tasktrack.repository;
import com.tasktrack.tasktrack.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {

}
