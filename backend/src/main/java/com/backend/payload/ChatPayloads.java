package com.backend.payload;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ChatPayloads {

    @Data
    public static class ChatRequest {
        private String prompt;
    }

    @Data
    @AllArgsConstructor
    public static class ChatResponse {
        private String id;
        private String prompt;
        private String response;
        private LocalDateTime timestamp;
    }

    @Data
    @AllArgsConstructor
    public static class HistoryResponse {
        private List<ChatResponse> messages;
    }
}
