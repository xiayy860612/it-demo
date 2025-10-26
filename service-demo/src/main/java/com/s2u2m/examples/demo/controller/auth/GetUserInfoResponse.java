package com.s2u2m.examples.demo.controller.auth;

import com.s2u2m.examples.demo.domain.user.UserInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetUserInfoResponse {
  private UserInfo user;
}
