package com.s2u2m.examples.demo.core.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.s2u2m.examples.demo.domain.user.InnerUser;
import com.s2u2m.examples.demo.domain.user.UserRepository;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final UserRepository userRepository;

  @GetMapping("/me")
  public GetUserInfoResponse getUserInfo(Authentication authentication) {
    Long uid = Long.valueOf(authentication.getName());
    InnerUser user = userRepository.getReferenceById(uid);
    return GetUserInfoResponse.builder().user(user.getUserInfo()).build();
  }
}
