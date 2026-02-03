package com.wolftalk.authservice.security;

import com.wolftalk.authservice.model.User;
import com.wolftalk.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getName();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture"); // Google
        if (picture == null) {
            // Facebook might differ, but 'picture' is standard OIDC.
            // For facebook sometimes it is deeper structure, simplified for now.
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmailIgnoreCase(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setFirstName(name); // Very basic name update
            user.setAvatar(picture);
            user.setProvider(provider);
            user.setProviderId(providerId);
            userRepository.save(user);
        } else {
            user = new User();
            user.setEmail(email);
            user.setFirstName(name);
            user.setAvatar(picture);
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setRoles("ROLE_USER");
            user.setIsEnabled(true);
            userRepository.save(user);
        }

        return oAuth2User;
    }
}
