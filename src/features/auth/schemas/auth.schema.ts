import { z } from 'zod';

/**
 * Qué es: schemas de Zod para los formularios de auth.
 * Por qué lo usamos: un solo schema define validación en runtime Y el tipo
 * TypeScript del formulario (con z.infer), evitando mantener dos fuentes de
 * verdad (una interface + validaciones manuales sueltas).
 * Qué problema resuelve: mensajes de error consistentes y centralizados, en
 * vez de validaciones ad-hoc dispersas por los componentes de formulario.
 */

export const loginSchema = z.object({
  email: z.string().min(1, 'Ingresa tu correo').email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Ingresa tu nombre').max(50),
    lastName: z.string().min(1, 'Ingresa tu apellido').max(50),
    email: z.string().min(1, 'Ingresa tu correo').email('Ingresa un correo válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
      .regex(/[0-9]/, 'Debe incluir al menos un número'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Ingresa tu correo').email('Ingresa un correo válido'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
