package com.wolftalk.assessment.service;

import com.wolftalk.assessment.config.FileStorageConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private final FileStorageConfig fileStorageConfig;

    /**
     * Lưu file upload
     * @param file - MultipartFile
     * @param attemptId - ID của bài làm
     * @param questionId - ID của câu hỏi
     * @param fileType - "video" hoặc "audio"
     * @return Đường dẫn file đã lưu
     */
    public String storeFile(MultipartFile file, Long attemptId, Long questionId, String fileType) {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Get original filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        // Validate filename
        if (originalFilename.contains("..")) {
            throw new RuntimeException("Invalid filename: " + originalFilename);
        }

        // Get file extension
        String extension = "";
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot > 0) {
            extension = originalFilename.substring(lastDot);
        }

        // Validate file type
        validateFileType(extension, fileType);

        // Generate unique filename
        String filename = String.format("attempt_%d_question_%d_%s%s", 
                attemptId, questionId, UUID.randomUUID().toString(), extension);

        try {
            // Create directory structure: uploads/assessments/{attemptId}/{fileType}/
            Path uploadPath = Paths.get(fileStorageConfig.getUploadDir())
                    .resolve(String.valueOf(attemptId))
                    .resolve(fileType);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Copy file to target location
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path
            String relativePath = String.format("/uploads/assessments/%d/%s/%s", 
                    attemptId, fileType, filename);
            
            log.info("Stored file: {}", relativePath);
            return relativePath;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + filename, e);
        }
    }

    /**
     * Validate file type
     */
    private void validateFileType(String extension, String fileType) {
        extension = extension.toLowerCase();
        
        if ("video".equals(fileType)) {
            if (!extension.matches("\\.(mp4|webm|mov|avi)")) {
                throw new RuntimeException("Invalid video file type. Allowed: mp4, webm, mov, avi");
            }
        } else if ("audio".equals(fileType)) {
            if (!extension.matches("\\.(mp3|wav|m4a|ogg)")) {
                throw new RuntimeException("Invalid audio file type. Allowed: mp3, wav, m4a, ogg");
            }
        } else {
            throw new RuntimeException("Invalid file type: " + fileType);
        }
    }

    /**
     * Xóa file
     */
    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(fileStorageConfig.getUploadDir()).resolve(filePath);
            Files.deleteIfExists(path);
            log.info("Deleted file: {}", filePath);
        } catch (IOException e) {
            log.error("Could not delete file: {}", filePath, e);
        }
    }
}
