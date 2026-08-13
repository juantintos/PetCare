import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';

describe('loginSchema', () => {
  it('acepta credenciales válidas', () => {
    const result = loginSchema.safeParse({ email: 'juan@correo.com', password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('rechaza un correo inválido', () => {
    const result = loginSchema.safeParse({ email: 'no-es-un-correo', password: '12345678' });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña vacía', () => {
    const result = loginSchema.safeParse({ email: 'juan@correo.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validPayload = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@correo.com',
    password: 'Abcd1234',
    confirmPassword: 'Abcd1234',
  };

  it('acepta un registro completo y válido', () => {
    expect(registerSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rechaza cuando las contraseñas no coinciden', () => {
    const result = registerSchema.safeParse({ ...validPayload, confirmPassword: 'Otra1234' });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña sin mayúscula', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: 'abcd1234',
      confirmPassword: 'abcd1234',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña sin número', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: 'Abcdefgh',
      confirmPassword: 'Abcdefgh',
    });
    expect(result.success).toBe(false);
  });
});
