package com.learningpath.repositories;

import com.learningpath.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByStudentIdOrderByTimestampDesc(Long studentId);
    List<ChatMessage> findByStudentIdAndTimestampBetweenOrderByTimestampDesc(Long studentId, LocalDateTime start, LocalDateTime end);
}
