package com.backend.repository;

import com.backend.model.Message;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface MessageRepository extends Neo4jRepository<Message, String> {
}
