package com.wolftalk.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.LearningProfileDTO;
import com.wolftalk.backend.entity.LearningProfile;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.LearningProfileRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningProfileService {

    private final LearningProfileRepository learningProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public LearningProfileDTO createProfile(Long userId, LearningProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (learningProfileRepository.existsByUserId(userId)) {
            throw new RuntimeException("Learning profile already exists for user: " + userId);
        }

        LearningProfile profile = new LearningProfile();
        profile.setUser(user);
        updateProfileFromDTO(profile, dto);

        LearningProfile savedProfile = learningProfileRepository.save(profile);
        return convertToDTO(savedProfile);
    }

    @Transactional
    public LearningProfileDTO updateProfile(Long userId, LearningProfileDTO dto) {
        LearningProfile profile = learningProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Learning profile not found for user: " + userId));

        updateProfileFromDTO(profile, dto);
        LearningProfile updatedProfile = learningProfileRepository.save(profile);
        return convertToDTO(updatedProfile);
    }

    @Transactional(readOnly = true)
    public Optional<LearningProfileDTO> getProfileByUserId(Long userId) {
        return learningProfileRepository.findByUserId(userId)
                .map(this::convertToDTO);
    }

    @Transactional
    public void deleteProfile(Long userId) {
        LearningProfile profile = learningProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Learning profile not found for user: " + userId));
        learningProfileRepository.delete(profile);
    }

    private void updateProfileFromDTO(LearningProfile profile, LearningProfileDTO dto) {
        profile.setCurrentLevel(dto.getCurrentLevel());
        profile.setTargetLevel(dto.getTargetLevel());
        profile.setStudyHoursPerWeek(dto.getStudyHoursPerWeek());
        profile.setPreferredLearningStyle(dto.getPreferredLearningStyle());
        profile.setLearningPurpose(dto.getLearningPurpose());
        profile.setSpeakingConfidence(dto.getSpeakingConfidence());
        profile.setPronunciationScore(dto.getPronunciationScore());
        profile.setGrammarScore(dto.getGrammarScore());
        profile.setVocabularyScore(dto.getVocabularyScore());
        profile.setFluencyScore(dto.getFluencyScore());
        profile.setBio(dto.getBio());
        profile.setAvatarUrl(dto.getAvatarUrl());
    }

    private LearningProfileDTO convertToDTO(LearningProfile profile) {
        LearningProfileDTO dto = new LearningProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setCurrentLevel(profile.getCurrentLevel());
        dto.setTargetLevel(profile.getTargetLevel());
        dto.setStudyHoursPerWeek(profile.getStudyHoursPerWeek());
        dto.setPreferredLearningStyle(profile.getPreferredLearningStyle());
        dto.setLearningPurpose(profile.getLearningPurpose());
        dto.setSpeakingConfidence(profile.getSpeakingConfidence());
        dto.setPronunciationScore(profile.getPronunciationScore());
        dto.setGrammarScore(profile.getGrammarScore());
        dto.setVocabularyScore(profile.getVocabularyScore());
        dto.setFluencyScore(profile.getFluencyScore());
        dto.setBio(profile.getBio());
        dto.setAvatarUrl(profile.getAvatarUrl());
        return dto;
    }
}
