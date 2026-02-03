# Audio Recording Debug Guide

## Vấn đề: Kết quả 0% và không có text

Nguyên nhân: Audio format không tương thích với Vosk API.

## Giải pháp đã áp dụng

### 1. **WAV Conversion**
Frontend giờ tự động convert audio sang định dạng Vosk yêu cầu:
- **Format**: WAV PCM
- **Sample Rate**: 16kHz
- **Channels**: Mono (1 channel)
- **Bit Depth**: 16-bit

### 2. **Auto Download Debug**
Mỗi lần record, file WAV sẽ **tự động download** về máy với tên:
```
recording-{timestamp}.wav
```

## Cách kiểm tra

### Bước 1: Test Recording
1. Vào http://localhost:5173/pronunciation-practice
2. Click mic button
3. Nói câu tiếng Anh
4. Stop recording
5. File WAV sẽ tự động download

### Bước 2: Kiểm tra file WAV
Mở file WAV vừa download bằng:
- Windows Media Player
- VLC
- Audacity

**Kiểm tra:**
- ✅ Có nghe thấy giọng nói không?
- ✅ Âm lượng có đủ lớn không?
- ✅ Có nhiễu quá không?

### Bước 3: Xem kết quả backend
Mở DevTools Console (F12) để xem:
- Request gửi lên backend
- Response trả về
- Errors (nếu có)

## Troubleshooting

### Vấn đề: File WAV rỗng hoặc không có âm thanh
**Nguyên nhân**: Microphone không hoạt động
**Giải pháp**:
1. Check browser permissions (Allow microphone)
2. Thử microphone khác
3. Check Windows Sound Settings

### Vấn đề: Vẫn 0% sau khi có audio
**Nguyên nhân**: Backend không nhận dạng được
**Giải pháp**:
1. Check logs backend: `docker logs -f wolftalk-pronunciation-service`
2. Xem có error từ Vosk không
3. Verify Vosk model đã load: tìm dòng "Vosk model loaded successfully"

### Vấn đề: Audio quá nhỏ/nhiễu
**Nguyên nhân**: Microphone quality hoặc môi trường ồn
**Giải pháp**:
1. Nói to hơn, rõ ràng hơn
2. Đưa mic gần miệng hơn
3. Tắt tiếng ồn xung quanh
4. Enable noise suppression (đã bật mặc định)

## Technical Details

### MediaRecorder Settings
```javascript
{
  audio: {
    channelCount: 1,        // Mono
    sampleRate: 16000,      // 16kHz
    echoCancellation: true, // Giảm echo
    noiseSuppression: true  // Giảm nhiễu
  }
}
```

### WAV Encoding
- PCM format (uncompressed)
- Little-endian byte order
- 16-bit samples
- Standard WAV header (44 bytes)

## Next Steps

Nếu vẫn gặp vấn đề:
1. Share file WAV đã download
2. Share backend logs
3. Share browser console errors
