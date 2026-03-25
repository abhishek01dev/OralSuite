import { describe, it, expect } from 'vitest';
import {
  createUserDto,
  loginDto,
  createRoleDto,
  paginationSchema,
  createTenantDto,
} from '../dto/index.js';

describe('DTO Validation', () => {
  describe('createUserDto', () => {
    it('should validate a correct user', () => {
      const result = createUserDto.safeParse({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = createUserDto.safeParse({
        email: 'not-an-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = createUserDto.safeParse({
        email: 'test@example.com',
        password: '123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginDto', () => {
    it('should validate login credentials', () => {
      const result = loginDto.safeParse({ email: 'test@example.com', password: 'any' });
      expect(result.success).toBe(true);
    });
  });

  describe('createRoleDto', () => {
    it('should validate role with valid slug', () => {
      const result = createRoleDto.safeParse({ name: 'Editor', slug: 'editor' });
      expect(result.success).toBe(true);
    });

    it('should reject slug with spaces', () => {
      const result = createRoleDto.safeParse({ name: 'My Role', slug: 'my role' });
      expect(result.success).toBe(false);
    });
  });

  describe('createTenantDto', () => {
    it('should validate tenant', () => {
      const result = createTenantDto.safeParse({ name: 'Acme Corp', slug: 'acme-corp' });
      expect(result.success).toBe(true);
    });

    it('should reject slug with uppercase', () => {
      const result = createTenantDto.safeParse({ name: 'Test', slug: 'TestSlug' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationSchema', () => {
    it('should use defaults', () => {
      const result = paginationSchema.parse({});
      expect(result.limit).toBe(20);
      expect(result.sortOrder).toBe('desc');
    });

    it('should clamp limit', () => {
      const result = paginationSchema.safeParse({ limit: 500 });
      expect(result.success).toBe(false);
    });
  });
});
