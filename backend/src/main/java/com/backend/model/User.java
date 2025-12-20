package com.backend.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Node("User")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    private String id;

    private String email;

    private String password;

    private String refreshToken;

    @Relationship(type = "WROTE", direction = Relationship.Direction.OUTGOING)
    private List<Message> messages = new ArrayList<>();

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
