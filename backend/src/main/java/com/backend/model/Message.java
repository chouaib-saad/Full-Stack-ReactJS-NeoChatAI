package com.backend.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Node("Message")
@Data
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    private String id;

    private String prompt;

    private String response;

    private LocalDateTime timestamp;

    public Message(String prompt, String response) {
        this.prompt = prompt;
        this.response = response;
        this.timestamp = LocalDateTime.now();
    }
}
