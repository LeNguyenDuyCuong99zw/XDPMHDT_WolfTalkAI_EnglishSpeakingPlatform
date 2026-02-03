package com.wolftalk.authservice.repository;

import com.wolftalk.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchByName(@Param("searchTerm") String searchTerm);
    @Query("SELECT u FROM User u WHERE LOWER(u.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')) ORDER BY u.lastName, u.firstName")
    List<User> searchByLastName(@Param("lastName") String lastName);
    @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')) ORDER BY u.email")
    List<User> searchByEmail(@Param("email") String email);
    default Optional<User> findByEmail(String email) { return findByEmailIgnoreCase(email); }
    default boolean existsByEmail(String email) { return existsByEmailIgnoreCase(email); }
}
