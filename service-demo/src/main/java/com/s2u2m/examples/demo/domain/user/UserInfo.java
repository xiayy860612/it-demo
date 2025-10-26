package com.s2u2m.examples.demo.domain.user;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Immutable;

@Immutable
@Getter
@Builder
public class UserInfo {
  private String name;
  private String avatar;
}
