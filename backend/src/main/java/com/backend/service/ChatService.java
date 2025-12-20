package com.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.model.Message;
import com.backend.model.User;
import com.backend.payload.ChatPayloads.*;
import com.backend.repository.MessageRepository;
import com.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatService {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    UserRepository userRepository;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ChatResponse sendMessage(String email, String prompt) {
        System.out.println("DEBUG: sendMessage called with prompt: " + prompt);

        // Call Groq API
        String aiResponse = callGroqApi(prompt);
        System.out.println("DEBUG: AI Response: " + aiResponse);

        // Create Message Node
        Message message = new Message(prompt, aiResponse);
        message = messageRepository.save(message);

        // Link to User
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.getMessages().add(message);
        userRepository.save(user);

        return new ChatResponse(message.getId(), message.getPrompt(), message.getResponse(), message.getTimestamp());
    }

    @Transactional(readOnly = true)
    public HistoryResponse getHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatResponse> history = user.getMessages().stream()
                .map(msg -> new ChatResponse(msg.getId(), msg.getPrompt(), msg.getResponse(), msg.getTimestamp()))
                .collect(Collectors.toList());

        return new HistoryResponse(history);
    }

    @Transactional
    public void clearHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // FIX: Create a copy of the messages list BEFORE clearing
        // The original code had a bug: it stored a reference to user.getMessages(),
        // then cleared the same list, making the stored variable empty before deletion
        List<Message> messagesToDelete = new ArrayList<>(user.getMessages());

        // Clear the relationship from user
        user.getMessages().clear();
        userRepository.save(user);

        // Delete each message node from Neo4j
        for (Message message : messagesToDelete) {
            messageRepository.delete(message);
        }
    }

    private String callGroqApi(String prompt) {
        try {
            // Create JSON request body
            Map<String, Object> requestBody = Map.of(
                    "model", groqModel,
                    "messages", List.of(Map.of("role", "user", "content", prompt)));
            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // Build Request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(groqApiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + groqApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            // Send Request
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Parse Response
                JsonNode rootNode = objectMapper.readTree(response.body());
                return rootNode.path("choices").get(0).path("message").path("content").asText();
            } else {
                return "Error from AI: " + response.statusCode() + " - " + response.body();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am having trouble connecting to the AI right now. (" + e.getMessage() + ")";
        }
    }
}
