package com.wolftalk.backend.controller;

import org.apache.http.client.fluent.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.controller.GoogleLogin;

@RestController
public class GoogleCallbackController {

    @Autowired
    private UserRepository userRepository;

    // Đăng ký Google: điều hướng sang placement-test
    @GetMapping("/signup-google")
    public String handleGoogleSignup(@RequestParam("code") String code) throws Exception {
        GoogleLogin gg = new GoogleLogin();
        String accessToken = gg.getToken(code);

        // Lấy thông tin user từ Google
        String userInfoResponse = Request.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
                .execute().returnContent().asString();
        JsonObject userInfo = new Gson().fromJson(userInfoResponse, JsonObject.class);

        String email = userInfo.get("email").getAsString();
        String name = userInfo.get("name").getAsString();
        String picture = userInfo.get("picture").getAsString();

        // Tách firstName, lastName nếu muốn
        String firstName = name.split(" ")[0];
        String lastName = name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "";

        // Lưu vào database
        User user = userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPassword(""); // Google user không cần password
            u.setRoles("ROLE_USER");
            return u;
        });
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAvatar(picture);
        userRepository.save(user);

        // Sau khi đăng ký, điều hướng sang placement-test
        return "<script>window.location.href='/placement-test';</script>";
    }

    // Đăng nhập Google: điều hướng sang dashboard
    @GetMapping("/login-google")
    public String handleGoogleLogin(@RequestParam("code") String code) throws Exception {
        GoogleLogin gg = new GoogleLogin();
        String accessToken = gg.getToken(code);

        // Lấy thông tin user từ Google
        String userInfoResponse = Request.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
                .execute().returnContent().asString();
        JsonObject userInfo = new Gson().fromJson(userInfoResponse, JsonObject.class);

        String email = userInfo.get("email").getAsString();
        String name = userInfo.get("name").getAsString();
        String picture = userInfo.get("picture").getAsString();

        // Tách firstName, lastName nếu muốn
        String firstName = name.split(" ")[0];
        String lastName = name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "";

        // Lưu vào database
        User user = userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPassword(""); // Google user không cần password
            u.setRoles("ROLE_USER");
            return u;
        });
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAvatar(picture);
        userRepository.save(user);

        // Sau khi đăng nhập, điều hướng sang dashboard
        return "<script>window.location.href='/dashboard';</script>";
    }
}
