package com.s2u2m.examples.demo.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;

import com.s2u2m.examples.demo.domain.rbac.DemoPermissionEvaluator;

@Configuration
@RequiredArgsConstructor
public class GlobalAuthorizationConfig {
  private final DemoPermissionEvaluator permissionEvaluator;

  @Bean
  public MethodSecurityExpressionHandler expressionHandler() {
    var handler = new DefaultMethodSecurityExpressionHandler();
    handler.setPermissionEvaluator(permissionEvaluator);
    return handler;
  }
}
