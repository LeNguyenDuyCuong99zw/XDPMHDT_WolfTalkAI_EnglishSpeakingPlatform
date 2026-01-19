package com.wolftalk.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.LearningGoalDTO;
import com.wolftalk.backend.entity.LearningGoal;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.LearningGoalRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningGoalService {

    private final LearningGoalRepository learningGoalRepository;
    private final UserRepository userRepository;

    @Transactional
    public LearningGoalDTO createGoal(Long userId, LearningGoalDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        LearningGoal goal = new LearningGoal();
        goal.setUser(user);
        updateGoalFromDTO(goal, dto);

        LearningGoal savedGoal = learningGoalRepository.save(goal);
        return convertToDTO(savedGoal);
    }

    @Transactional
    public LearningGoalDTO updateGoal(Long goalId, LearningGoalDTO dto) {
        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Learning goal not found with id: " + goalId));

        updateGoalFromDTO(goal, dto);
        LearningGoal updatedGoal = learningGoalRepository.save(goal);
        return convertToDTO(updatedGoal);
    }

    @Transactional
    public LearningGoalDTO updateProgress(Long goalId, Integer progressValue) {
        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Learning goal not found with id: " + goalId));

        goal.setCurrentValue(progressValue);
        LearningGoal updatedGoal = learningGoalRepository.save(goal);
        return convertToDTO(updatedGoal);
    }

    @Transactional(readOnly = true)
    public List<LearningGoalDTO> getAllGoalsByUserId(Long userId) {
        return learningGoalRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LearningGoalDTO> getActiveGoalsByUserId(Long userId) {
        return learningGoalRepository.findActiveGoalsByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LearningGoalDTO getGoalById(Long goalId) {
        return learningGoalRepository.findById(goalId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Learning goal not found with id: " + goalId));
    }

    @Transactional
    public void deleteGoal(Long goalId) {
        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Learning goal not found with id: " + goalId));
        learningGoalRepository.delete(goal);
    }

    @Transactional(readOnly = true)
    public Long getCompletedGoalsCount(Long userId) {
        return learningGoalRepository.countCompletedGoalsByUserId(userId);
    }

    private void updateGoalFromDTO(LearningGoal goal, LearningGoalDTO dto) {
        goal.setGoalType(dto.getGoalType());
        goal.setGoalCategory(dto.getGoalCategory());
        goal.setTitle(dto.getTitle());
        goal.setDescription(dto.getDescription());
        goal.setTargetValue(dto.getTargetValue());
        if (dto.getCurrentValue() != null) {
            goal.setCurrentValue(dto.getCurrentValue());
        }
        goal.setUnit(dto.getUnit());
        goal.setStartDate(dto.getStartDate());
        goal.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) {
            goal.setStatus(dto.getStatus());
        }
        if (dto.getPriority() != null) {
            goal.setPriority(dto.getPriority());
        }
    }

    private LearningGoalDTO convertToDTO(LearningGoal goal) {
        LearningGoalDTO dto = new LearningGoalDTO();
        dto.setId(goal.getId());
        dto.setUserId(goal.getUser().getId());
        dto.setGoalType(goal.getGoalType());
        dto.setGoalCategory(goal.getGoalCategory());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setTargetValue(goal.getTargetValue());
        dto.setCurrentValue(goal.getCurrentValue());
        dto.setUnit(goal.getUnit());
        dto.setStartDate(goal.getStartDate());
        dto.setEndDate(goal.getEndDate());
        dto.setStatus(goal.getStatus());
        dto.setPriority(goal.getPriority());
        dto.setIsCompleted(goal.getIsCompleted());
        
        // Calculate progress percentage
        if (goal.getTargetValue() > 0) {
            int percentage = (int) ((goal.getCurrentValue() * 100.0) / goal.getTargetValue());
            dto.setProgressPercentage(Math.min(percentage, 100));
        } else {
            dto.setProgressPercentage(0);
        }
        
        return dto;
    }
}
