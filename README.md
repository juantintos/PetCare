# PetCare 🐾

> "La cartilla de vacunación de tu mascota, siempre contigo."

Proyecto educativo de React Native + Expo para digitalizar la cartilla de vacunación de mascotas.

## Estado actual: Fase 1 — Fundaciones

Esta fase **no implementa funcionalidad de negocio todavía**. Su objetivo es dejar una base
sólida sobre la cual construir el resto de la app sin fricción.

### Qué se hizo y por qué

| Decisión | Por qué |
|---|---|
| **Expo + Expo Router** | Enrutamiento basado en archivos (como Next.js), navegación tipada, y evita configurar React Navigation a mano. Ideal para aprender convenciones modernas de RN. |
| **TypeScript estricto** (`strict`, `noUncheckedIndexedAccess`) | Atrapa errores en tiempo de compilación en vez de en producción. `noUncheckedIndexedAccess` obliga a manejar `undefined` al acceder arrays/objetos por índice. |
| **NativeWind v4** en vez de StyleSheet puro | Combina la velocidad de Tailwind (utility classes) con estilos nativos reales (no CSS-in-JS lento). Se mantiene un `theme/` en TypeScript como fuente de verdad para valores que también se necesitan fuera de className (íconos, SVGs, estilos dinámicos). |
| **TanStack Query** | Separa "estado del servidor" de "estado de UI". Da cache, invalidación y estados de loading/error gratis, evitando reinventar esa lógica con `useState` + `useEffect`. |
| **Zustand** (aún no usado en Fase 1) | Se reserva para estado *global de cliente* real (ej. sesión del usuario, preferencias de UI) — nunca para cachear datos del servidor, eso es trabajo de TanStack Query. |
| **React Hook Form + Zod** (aún no usado en Fase 1) | RHF minimiza renders en formularios grandes; Zod da validación declarativa y tipos inferidos automáticamente (un solo schema = validación + tipo TypeScript). |
| **Arquitectura por capas** (`app/` → `features/` → `services/`) | Las pantallas (`app/`) solo orquestan; la lógica de negocio vive en `features/`; el acceso a datos vive en `services/`. Esto permite cambiar el backend (mock → REST → Supabase) sin tocar una sola pantalla. |

### Estructura creada

```text
petcare/
├── src/
│   ├── app/                  # Rutas (Expo Router) — Fase 2+
│   ├── components/
│   │   ├── ui/                # Button, Text, Card, Badge, Avatar, ScreenContainer ✅
│   │   ├── common/             # EmptyState, LoadingState, ErrorState ✅
│   │   ├── forms/ pets/ vaccines/  # se llenan en fases 3-4
│   ├── features/              # lógica de negocio por dominio — vacía, Fase 2+
│   ├── theme/                 # colors, typography, spacing, radius, shadows ✅
│   ├── types/                 # User, Pet, Vaccine, ApiResponse ✅
│   ├── constants/              # STORAGE_KEYS, QUERY_KEYS, env.ts ✅
│   ├── services/ stores/ schemas/ hooks/ utils/  # vacías, se llenan por fase
├── package.json / tsconfig.json / babel.config.js / metro.config.js
├── .eslintrc.js / .prettierrc.js
├── jest.config.js
└── .env.example
```

### Sistema de diseño

Paleta pensada para transmitir **confianza + cuidado + tecnología + mascotas**, evitando la
estética "IA genérica" (crema + terracota, o negro + acento neón):

- **Primario** `#3F7D6E` — verde salvia: salud, calma.
- **Acento** `#F2A65A` — ámbar cálido: cercanía, mascotas.
- **Estados**: éxito `#4C9A6B`, próximo `#F2A65A`, vencido `#E4572E` — cada uno siempre
  acompañado de texto (Badge), nunca solo color, por accesibilidad.
- **Tipografía**: Sora (display, con carácter) + Inter (body, muy legible en pantallas chicas).

Todo vive en `src/theme/*.ts`, con espejo en `tailwind.config.js` (duplicación intencional
y documentada — ver comentario en ese archivo).

### Cómo correrlo

```bash
npm install
cp .env.example .env
npm run start
```

## Fase 2 — Autenticación ✅

### Qué se implementó

- **Login, Registro, Logout** completos con React Hook Form + Zod (`features/auth/schemas`).
- **`services/auth.service.ts`**: mock que simula latencia de red y persiste usuarios
  registrados en `AsyncStorage` (como una "base de datos" falsa), con el mismo contrato de
  funciones que tendría un servicio real — migrar a un backend real implica reescribir solo
  este archivo.
- **`stores/auth.store.ts`** (Zustand): única fuente de verdad de la sesión (`user`, `token`,
  `status`). El token se persiste en `expo-secure-store`; los datos de perfil, junto al token,
  para hidratar la sesión al reabrir la app.
- **`features/auth/hooks/`**: `useLogin`, `useRegister`, `useLogout`, `useSession` — mutaciones
  de TanStack Query que conectan el servicio con el store, para que las pantallas nunca llamen
  directamente a `authService` ni sepan que existe Zustand.
- **Guard de navegación real** en 3 capas:
  1. `src/app/index.tsx` decide `(tabs)` vs `(auth)/login` según la sesión.
  2. `(auth)/_layout.tsx` redirige a `(tabs)` si ya hay sesión (evita volver a login con Back).
  3. `(tabs)/_layout.tsx` redirige a `(auth)/login` si la sesión se pierde (defensa en profundidad).
- **Manejo de errores centralizado** (`utils/errors.ts`): toda la capa de servicios lanza
  `AppError` con mensajes ya traducidos a lenguaje humano — ninguna pantalla ve un error técnico.
- **Componentes de formulario reutilizables**: `FormInput` y `PasswordInput` (con toggle de
  visibilidad), integrados con `Controller` de React Hook Form, mostrando errores debajo de
  cada campo.

### Cómo probarlo

1. `npm install && npm start`.
2. Regístrate con cualquier correo — el "usuario" queda guardado en el dispositivo.
3. Cierra la app por completo y vuelve a abrirla: deberías caer directo en `(tabs)`, sin pasar
   por login (persistencia de sesión funcionando).
4. Desde Perfil, cierra sesión: deberías volver a login y ya no poder navegar con Back a `(tabs)`.

## Fase 3 — Dashboard, Perfil y CRUD de mascotas ✅

- **`services/pets.service.ts`**: mismo patrón mock que auth, con datos persistidos en
  AsyncStorage y siempre filtrados por `ownerId` (simula lo que haría Row Level Security en
  un backend real).
- **`features/pets/hooks/`**: `usePets`, `usePet`, `useCreatePet`, `useUpdatePet`,
  `useDeletePet` — queries y mutations de TanStack Query con invalidación de cache correcta.
- **`components/pets/PetForm.tsx`**: formulario compartido entre crear/editar (DRY) usando
  `ChipSelect` (nuevo componente) para especie y sexo.
- **Dashboard real** (`(tabs)/index.tsx`): saludo, resumen (mascotas/vacunas/próximas/vencidas)
  y cards de mascotas con su próxima vacuna.
- **Perfil editable**: cambiar nombre/apellido y contraseña, con validación real contra el
  mock (`features/profile/`). Se detectó y corrigió una duplicación entre `auth.service.ts` y
  `profile.service.ts` extrayendo `services/_mockUsersRepository.ts` (DRY).

## Fase 4 — Detalle de mascota y CRUD de vacunas ✅

- **`services/vaccines.service.ts`**: CRUD completo + `removeByPetId` (limpieza en cascada al
  eliminar una mascota, evita datos huérfanos en el mock).
- **`features/vaccines/hooks/`**: mismo patrón que pets — queries, mutations, invalidación.
- **`components/vaccines/VaccineCard.tsx` + `VaccineForm.tsx`**: la card muestra el estado
  (Aplicada/Próxima/Vencida) siempre con color **y** texto (accesibilidad).
- **`app/pets/[id].tsx`**: detalle completo con info de la mascota + cartilla de vacunación,
  con su propio `ConfirmDialog` antes de eliminar.
- **Layouts de Stack** (`pets/_layout.tsx`, `vaccines/_layout.tsx`) con header nativo y botón
  "atrás", separados del Stack raíz sin header.

## Fase 5 — Estados avanzados ✅

- **`components/common/Skeleton.tsx`**: shimmer animado (Reanimated) para listas cargando, en
  vez de un spinner genérico — comunica mejor "esto ya casi está" y evita saltos de layout.
- **`hooks/useNetworkStatus.ts` + `OfflineBanner.tsx`**: detecta pérdida de conexión
  (`@react-native-community/netinfo`) y muestra un banner persistente sobre los tabs.
- Todas las pantallas de listas (`pets.tsx`, `[id].tsx`) manejan explícitamente
  loading/error/empty — nunca una lista vacía "pelada".

## Fase 6 — Animaciones, microinteracciones y accesibilidad ✅

- **`utils/date.ts`**: toda la lógica de fechas (edad, estado de vacuna, formato) centralizada
  aquí — usada por Dashboard, detalle de mascota y las cards.
- **Sistema de Toast** (`components/common/Toast.tsx`): feedback flotante tras crear/editar/
  eliminar (mascota agregada, vacuna eliminada, etc.), con animación de entrada/salida.
- **Animaciones de entrada** (`react-native-reanimated`): `PetCard` y `VaccineCard` aparecen
  con un fade+slide escalonado por índice; el Toast anima entrada/salida.
- **Microinteracciones**: `Button` ya tenía estado "pressed" (Fase 1); se extendió el mismo
  criterio a `PetCard`/`VaccineCard` (opacidad al presionar).
- **Accesibilidad**: `accessibilityRole`/`accessibilityLabel` en botones, inputs, cards y
  badges; los estados de vacuna nunca dependen solo del color.

## Fase 7 — Testing y preparación para producción ✅

- **Tests agregados**: `utils/date.test.ts` (edad, vencimiento, próximas — la lógica más
  crítica del dominio), `pet.schema.test.ts`, `vaccine.schema.test.ts`,
  `pets.service.test.ts` (crear/listar/actualizar/eliminar), además de los tests de auth de
  la Fase 2. Corre todo con `npm test`.
- **`eas.json`**: perfiles de build `development`/`preview`/`production`, cada uno con sus
  propias variables de entorno — nunca se usa el mock (`EXPO_PUBLIC_USE_MOCK_API`) en producción.
- **Separación dev/prod**: `constants/env.ts` sigue siendo el único punto de acceso a variables
  de entorno; cambiar de mock a backend real es una variable de entorno, no un cambio de código.

### Checklist de estado del proyecto

| Área | Estado |
|---|---|
| Auth (login/registro/logout/sesión) | ✅ Completo, funcional contra mock |
| CRUD de mascotas | ✅ Completo |
| CRUD de vacunas + cartilla | ✅ Completo |
| Dashboard con resumen | ✅ Completo |
| Perfil editable | ✅ Completo |
| Estados loading/error/empty/offline | ✅ Completo |
| Animaciones y microinteracciones | ✅ Completo (nivel base) |
| Accesibilidad | ✅ Nivel base cubierto |
| Testing | ✅ Cobertura de la lógica crítica (fechas, schemas, servicios) |
| Backend real | ⏳ Pendiente — la capa de servicios ya está lista para recibirlo |

### Limitaciones conocidas (a propósito, fuera del alcance de este proyecto educativo)

- **No hay backend real**: todo vive en `AsyncStorage` del dispositivo. Migrar implica
  reescribir el contenido de `services/*.service.ts` — ninguna pantalla ni hook cambia.
- **Recuperar contraseña** solo valida el formulario; el envío real de correo requiere backend.
- **Sin notificaciones push** ni recordatorios automáticos de vacunas (quedó listado como
  funcionalidad futura en el brief original, punto 24).
- **Sin sincronización offline real** (mutaciones en cola): el `OfflineBanner` informa, pero
  no reintenta automáticamente — razonable para un mock local, necesario de diseñar con
  cuidado cuando exista backend real.
- **Fotos de mascota**: el campo `photo` existe en el modelo pero no hay selector de imagen
  todavía (requeriría `expo-image-picker` + almacenamiento de archivos, fuera del alcance
  actual).

### Cómo correr todo el proyecto

```bash
npm install
cp .env.example .env
npm run typecheck   # TypeScript estricto
npm run lint        # ESLint
npm test            # Jest + Testing Library
npm run start        # Levanta Expo
```
