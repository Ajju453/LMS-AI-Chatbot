package com.learningpath.controllers;

import com.learningpath.chatbot.ChatbotService;
import com.learningpath.models.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatbotController {
    
    @Autowired
    private ChatbotService chatbotService;
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
        @RequestParam Long studentId,
        @RequestBody Map<String, String> request) {
        
        try {
            String userMessage = request.get("message");
            if (userMessage == null || userMessage.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Message cannot be empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String botResponse = chatbotService.processChatMessage(studentId, userMessage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", botResponse);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/history/{studentId}")
    public ResponseEntity<Map<String, Object>> getChatHistory(
        @PathVariable Long studentId) {
        
        List<ChatMessage> history = chatbotService.getChatHistory(studentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("history", history);
        response.put("totalMessages", history.size());
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/history/{studentId}")
    public ResponseEntity<Map<String, String>> clearChatHistory(
        @PathVariable Long studentId) {
        
        chatbotService.clearChatHistory(studentId);
        
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "Chat history cleared successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "active");
        response.put("service", "Learning Chatbot");
        return ResponseEntity.ok(response);
    }
}
