import { describe, it, expect } from 'vitest';
import { PasswordService } from '../password-service.js';

describe('PasswordService', () => {
  it('should hash a password', async () => {
    const hash = await PasswordService.hash('testpassword123');
    expect(hash).toBeTruthy();
    expect(hash).not.toBe('testpassword123');
    expect(hash.startsWith('$argon2')).toBe(true);
  });

  it('should verify a correct password', async () => {
    const password = 'secure-password-456';
    const hash = await PasswordService.hash(password);
    const isValid = await PasswordService.verify(hash, password);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hash = await PasswordService.hash('correct-password');
    const isValid = await PasswordService.verify(hash, 'wrong-password');
    expect(isValid).toBe(false);
  });

  it('should produce different hashes for same password (salt)', async () => {
    const password = 'same-password';
    const hash1 = await PasswordService.hash(password);
    const hash2 = await PasswordService.hash(password);
    expect(hash1).not.toBe(hash2);
  });
});
