package com.unisales.piemanager.bootstrap.service;

import com.unisales.piemanager.bootstrap.dto.BootstrapResponse;
import com.unisales.piemanager.user.dto.UserCreateRequest;
import com.unisales.piemanager.user.dto.UserResponse;
import com.unisales.piemanager.user.model.Profile;
import com.unisales.piemanager.user.repository.UserRepository;
import com.unisales.piemanager.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BootstrapService {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_EMAIL = "admin@unisales.br";
    private static final String ADMIN_PASSWORD = "admin@123";

    private final UserRepository userRepository;
    private final UserService userService;

    public BootstrapService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public BootstrapResponse initialize() {
        return userRepository.findByEmail(ADMIN_EMAIL)
                .map(existing -> new BootstrapResponse(false, userService.toResponse(existing)))
                .orElseGet(() -> {
                    UserCreateRequest request = new UserCreateRequest();
                    request.setUsername(ADMIN_USERNAME);
                    request.setEmail(ADMIN_EMAIL);
                    request.setPassword(ADMIN_PASSWORD);
                    request.setProfile(Profile.ADMIN);

                    UserResponse created = userService.create(request, "bootstrap");
                    return new BootstrapResponse(true, created);
                });
    }
}
