package com.unisales.piemanager.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "username is required")
    @Size(max = 120, message = "username must have up to 120 chars")
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    @Size(max = 180, message = "email must have up to 180 chars")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 120, message = "password must be between 6 and 120 chars")
    private String password;

    // Opcional no cadastro público. Quando informado, deve ter exatamente 10 dígitos.
    @Pattern(regexp = "\\d{10}", message = "matricula must be exactly 10 digits")
    private String matricula;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }
}
