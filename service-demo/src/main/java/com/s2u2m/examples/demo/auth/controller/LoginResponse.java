package com.s2u2m.examples.demo.auth.controller;

import com.s2u2m.examples.demo.domain.user.UserInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
  private String accessToken;
  private UserInfo user;
}
