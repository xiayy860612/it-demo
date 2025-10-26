package com.s2u2m.examples.service_example_h2.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.s2u2m.examples.demo.repository.DemoEntity;
import com.s2u2m.examples.demo.repository.DemoEntityRepository;
import com.s2u2m.examples.demo.service.DemoService;
import com.s2u2m.examples.service_example_h2.BaseServiceTest;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

class DemoServiceTest extends BaseServiceTest {
  @InjectMocks
  private DemoService demoService;

  @Mock
  private DemoEntityRepository demoEntityRepository;

  @Test
  void shouldReturnDemo_WhenCreateSuccess() {
    String name = "test";

    DemoEntity entity = new DemoEntity();
    entity.setId(1L);
    entity.setName(name);
    when(demoEntityRepository.save(any())).thenReturn(entity);

    DemoEntity result = demoService.createDemo(name);
    assertEquals(name, result.getName());
  }

}
