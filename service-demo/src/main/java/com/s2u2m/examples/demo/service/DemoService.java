package com.s2u2m.examples.demo.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.s2u2m.examples.demo.repository.DemoEntity;
import com.s2u2m.examples.demo.repository.DemoEntityRepository;

@Service
@AllArgsConstructor
@Transactional(rollbackFor = {Exception.class})
public class DemoService {
  private DemoEntityRepository demoEntityRepository;

  public DemoEntity createDemo(String name) {
    DemoEntity entity = new DemoEntity();
    entity.setName(name);
    return demoEntityRepository.save(entity);
  }

  public DemoEntity update(Long id, String name) {
    DemoEntity entity = demoEntityRepository.getReferenceById(id);
    entity.setName(name);
    return demoEntityRepository.save(entity);
  }
}
