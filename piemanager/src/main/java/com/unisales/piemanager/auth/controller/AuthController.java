package com.unisales.piemanager.auth.controller;

import com.unisales.piemanager.auth.dto.LoginRequest;
import com.unisales.piemanager.auth.dto.LoginResponse;
import com.unisales.piemanager.auth.dto.RegisterRequest;
import com.unisales.piemanager.common.api.ApiResponse;
import com.unisales.piemanager.user.UserService;
import com.unisales.piemanager.user.dto.UserCreateRequest;
import com.unisales.piemanager.user.dto.UserResponse;
import com.unisales.piemanager.user.model.Profile;
import com.unisales.piemanager.user.model.User;
import com.unisales.piemanager.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword()));

        User user = userService.findEntityByEmail(request.getEmail());
        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();
        response.setTokenType("Bearer");
        response.setAccessToken(token);
        response.setExpiresIn(jwtService.getExpirationSeconds());
        response.setUser(userService.toResponse(user));

        return ApiResponse.success("Login successful", response);
    }

    @PostMapping("/register")
    public ApiResponse<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Cadastro público: qualquer pessoa pode criar sua própria conta,
        // mas sempre com perfil ALUNO. Para outros perfis (PROFESSOR,
        // COORDENADOR, ADMIN, AVALIADOR_EXTERNO), um ADMIN deve alterar o
        // perfil posteriormente pelo CRUD de Usuários.
        UserCreateRequest createRequest = new UserCreateRequest();
        createRequest.setUsername(request.getUsername());
        createRequest.setEmail(request.getEmail());
        createRequest.setPassword(request.getPassword());
        createRequest.setProfile(Profile.ALUNO);
        createRequest.setMatricula(request.getMatricula());

        userService.create(createRequest, "self-register");

        User user = userService.findEntityByEmail(request.getEmail());
        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();
        response.setTokenType("Bearer");
        response.setAccessToken(token);
        response.setExpiresIn(jwtService.getExpirationSeconds());
        response.setUser(userService.toResponse(user));

        return ApiResponse.success("Registration successful", response);
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(Authentication authentication) {
        // Usado pelo frontend para validar se o token salvo localmente
        // ainda é válido antes de considerar o usuário "logado".
        User user = userService.findEntityByEmail(authentication.getName());
        return ApiResponse.success("OK", userService.toResponse(user));
    }
}

