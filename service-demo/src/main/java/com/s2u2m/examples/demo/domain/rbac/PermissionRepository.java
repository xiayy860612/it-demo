package com.s2u2m.examples.demo.domain.rbac;

import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

import com.s2u2m.examples.demo.domain.user.InnerUser;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
  Set<Permission> findByUid(Long uid);
  Boolean existsByUidAndResourceAndActionAndResourceId(Long uid, Resource resource, String action, String resourceId);
}
