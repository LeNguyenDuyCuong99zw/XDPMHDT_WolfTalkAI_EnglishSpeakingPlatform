package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.LeaderboardEntry;
import com.wolftalk.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {

    /**
     * Tìm entry của user cho một tuần cụ thể
     */
    Optional<LeaderboardEntry> findByUserAndYearAndWeekNumber(User user, Integer year, Integer weekNumber);

    /**
     * Lấy top entries của tuần hiện tại, sắp xếp theo XP giảm dần
     */
    @Query(value = "SELECT * FROM leaderboard_entries " +
            "WHERE year = :year AND week_number = :weekNumber " +
            "ORDER BY weekly_xp DESC, rank ASC " +
            "LIMIT :limit", nativeQuery = true)
    List<LeaderboardEntry> findWeeklyTop(@Param("year") Integer year, 
                                          @Param("weekNumber") Integer weekNumber, 
                                          @Param("limit") int limit);

    /**
     * Lấy tất cả entries của một tuần
     */
    List<LeaderboardEntry> findByYearAndWeekNumberOrderByWeeklyXpDesc(Integer year, Integer weekNumber);

    /**
     * Tìm xếp hạng của user trong tuần cụ thể
     */
    @Query(value = "SELECT le.* FROM leaderboard_entries le " +
            "WHERE le.year = :year AND le.week_number = :weekNumber " +
            "AND le.user_id = :userId", nativeQuery = true)
    Optional<LeaderboardEntry> findUserWeeklyEntry(@Param("userId") Long userId,
                                                     @Param("year") Integer year,
                                                     @Param("weekNumber") Integer weekNumber);

    /**
     * Lấy tất cả entries của user để xem lịch sử
     */
    List<LeaderboardEntry> findByUserOrderByYearDescWeekNumberDesc(User user);

}
