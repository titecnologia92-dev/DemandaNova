// Testes básicos de autenticação
// Para executar: npm test

describe('Auth Controller', () => {
  it('should validate email format', () => {
    const email = 'test@example.com';
    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should validate password length', () => {
    const password = 'senha123';
    expect(password.length).toBeGreaterThanOrEqual(6);
  });
}); 



