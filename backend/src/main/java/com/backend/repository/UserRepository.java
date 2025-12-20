package com.backend.repository;

import com.backend.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import java.util.Optional;

public interface UserRepository extends Neo4jRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByRefreshToken(String refreshToken);
}
