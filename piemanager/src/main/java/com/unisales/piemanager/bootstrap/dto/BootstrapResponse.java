package com.unisales.piemanager.bootstrap.dto;

import com.unisales.piemanager.user.dto.UserResponse;

public class BootstrapResponse {
    private boolean created;
    private UserResponse user;

    public BootstrapResponse(boolean created, UserResponse user) {
        this.created = created;
        this.user = user;
    }

    public boolean isCreated() {
        return created;
    }

    public UserResponse getUser() {
        return user;
    }
}
