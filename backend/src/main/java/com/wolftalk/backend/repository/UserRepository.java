package com.wolftalk.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    // Tìm kiếm người dùng theo tên
    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchByName(@Param("searchTerm") String searchTerm);

    // Tìm kiếm người dùng theo last_name
    @Query("SELECT u FROM User u WHERE LOWER(u.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')) ORDER BY u.lastName, u.firstName")
    List<User> searchByLastName(@Param("lastName") String lastName);

    // Tìm kiếm người dùng theo email
    @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')) ORDER BY u.email")
    List<User> searchByEmail(@Param("email") String email);

    // Alias methods to fix compilation errors in services
    default Optional<User> findByEmail(String email) {
        return findByEmailIgnoreCase(email);
    }

    default boolean existsByEmail(String email) {
        return existsByEmailIgnoreCase(email);
    }
}
