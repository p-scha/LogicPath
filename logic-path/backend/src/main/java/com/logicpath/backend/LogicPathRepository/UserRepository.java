package com.logicpath.backend.LogicPathRepository;

import com.logicpath.backend.LogicPathModel.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
