package com.s2u2m.examples;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
public class Controller {
  @Value("${mysql.url}")
  private String mysqlUrl;

  @Value("${mysql.username}")
  private String mysqlUsername;

  @Value("${mysql.pwd}")
  private String mysqlPwd;

  @GetMapping("/{ping}")
  public String pingPong(@PathVariable String ping) {
    return String.join(": ", ping, mysqlUrl, mysqlUsername, mysqlPwd);
  }
}
