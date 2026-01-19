package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.UserPreferenceDTO;
import com.wolftalk.backend.entity.UserPreference;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.UserPreferenceRepository;
import com.wolftalk.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;
    private final UserRepository userRepository;

    @Transactional
    public UserPreferenceDTO createPreference(Long userId, UserPreferenceDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (userPreferenceRepository.existsByUserId(userId)) {
            throw new RuntimeException("User preference already exists for user: " + userId);
        }

        UserPreference preference = new UserPreference();
        preference.setUser(user);
        updatePreferenceFromDTO(preference, dto);

        UserPreference savedPreference = userPreferenceRepository.save(preference);
        return convertToDTO(savedPreference);
    }

    @Transactional
    public UserPreferenceDTO updatePreference(Long userId, UserPreferenceDTO dto) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User preference not found for user: " + userId));

        updatePreferenceFromDTO(preference, dto);
        UserPreference updatedPreference = userPreferenceRepository.save(preference);
        return convertToDTO(updatedPreference);
    }

    @Transactional(readOnly = true)
    public Optional<UserPreferenceDTO> getPreferenceByUserId(Long userId) {
        return userPreferenceRepository.findByUserId(userId)
                .map(this::convertToDTO);
    }

    @Transactional
    public void deletePreference(Long userId) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User preference not found for user: " + userId));
        userPreferenceRepository.delete(preference);
    }

    private void updatePreferenceFromDTO(UserPreference preference, UserPreferenceDTO dto) {
        preference.setInterestedTopics(dto.getInterestedTopics());
        preference.setPreferredScenarios(dto.getPreferredScenarios());
        preference.setPreferredAccent(dto.getPreferredAccent());
        preference.setDifficultyPreference(dto.getDifficultyPreference());
        preference.setDailyPracticeTime(dto.getDailyPracticeTime());
        preference.setReminderEnabled(dto.getReminderEnabled());
        preference.setReminderTime(dto.getReminderTime());
        preference.setEnableAiFeedback(dto.getEnableAiFeedback());
        preference.setEnablePronunciationCheck(dto.getEnablePronunciationCheck());
        preference.setEnableGrammarCheck(dto.getEnableGrammarCheck());
        preference.setFeedbackDetailLevel(dto.getFeedbackDetailLevel());
        preference.setPracticeWithMentor(dto.getPracticeWithMentor());
        preference.setShowSubtitles(dto.getShowSubtitles());
        preference.setBackgroundMusicEnabled(dto.getBackgroundMusicEnabled());
    }

    private UserPreferenceDTO convertToDTO(UserPreference preference) {
        UserPreferenceDTO dto = new UserPreferenceDTO();
        dto.setId(preference.getId());
        dto.setUserId(preference.getUser().getId());
        dto.setInterestedTopics(preference.getInterestedTopics());
        dto.setPreferredScenarios(preference.getPreferredScenarios());
        dto.setPreferredAccent(preference.getPreferredAccent());
        dto.setDifficultyPreference(preference.getDifficultyPreference());
        dto.setDailyPracticeTime(preference.getDailyPracticeTime());
        dto.setReminderEnabled(preference.getReminderEnabled());
        dto.setReminderTime(preference.getReminderTime());
        dto.setEnableAiFeedback(preference.getEnableAiFeedback());
        dto.setEnablePronunciationCheck(preference.getEnablePronunciationCheck());
        dto.setEnableGrammarCheck(preference.getEnableGrammarCheck());
        dto.setFeedbackDetailLevel(preference.getFeedbackDetailLevel());
        dto.setPracticeWithMentor(preference.getPracticeWithMentor());
        dto.setShowSubtitles(preference.getShowSubtitles());
        dto.setBackgroundMusicEnabled(preference.getBackgroundMusicEnabled());
        return dto;
    }
}
