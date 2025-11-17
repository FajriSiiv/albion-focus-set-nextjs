<!-- 347f61a3-7a75-4b58-8c51-918b3afa8986 cf5c7456-78d6-411e-9f08-322b08861671 -->
# Menambahkan NextAuth.js ke Project E-commerce

## Tujuan

Menambahkan sistem autentikasi sederhana menggunakan NextAuth.js v5 (Auth.js) untuk mempelajari konsep authentication, session management, dan protected routes.

## Pendekatan Pembelajaran

- Menggunakan **Credentials Provider** (email/password) - lebih mudah dipahami konsepnya
- **Hardcoded users** untuk sementara (tanpa database) - fokus belajar NextAuth dulu
- Nanti bisa di-upgrade ke database atau OAuth provider

## Struktur yang Akan Dibuat

### 1. Install Dependencies

- `next-auth` (NextAuth.js v5)
- `@auth/core` (core library)

### 2. Setup Auth Configuration

**File: `auth.ts`** (root project)

- Setup NextAuth configuration
- Credentials provider dengan hardcoded users
- Session strategy (JWT untuk simplicity)
- Callbacks untuk customize session

### 3. Auth API Route

**File: `app/api/auth/[...nextauth]/route.ts`**

- Handle semua auth routes (login, logout, callback, dll)
- NextAuth v5 menggunakan route handler

### 4. Session Provider

**Update: `app/layout.tsx`**

- Wrap aplikasi dengan SessionProvider
- Memungkinkan akses session di semua komponen

### 5. Login Page

**File: `app/login/page.tsx`**

- Form login (email & password)
- Client component untuk handle form submission
- Redirect setelah login berhasil

### 6. Protected Route Component

**File: `components/ProtectedRoute.tsx`**

- HOC/component untuk protect halaman
- Redirect ke login jika belum authenticated
- Loading state saat check session

### 7. User Menu Component

**File: `components/UserMenu.tsx`**

- Tampilkan user info jika logged in
- Logout button
- Link ke profile (optional)

### 8. Update Navigation

**Update: `app/layout.tsx` atau buat `components/Navbar.tsx`**

- Tampilkan login button jika belum login
- Tampilkan user menu jika sudah login
- Link ke cart dengan icon

### 9. Protect Checkout

**Update: `app/products/[id]/checkout-button.tsx`**

- Check session sebelum checkout
- Redirect ke login jika belum authenticated
- Tampilkan user info di checkout

### 10. Environment Variables

**File: `.env.local`**

- `AUTH_SECRET` - secret key untuk JWT (generate random)
- `NEXTAUTH_URL` - URL aplikasi (http://localhost:3000 untuk dev)

## Hardcoded Users (untuk pembelajaran)

```typescript
const users = [
  { id: "1", email: "user@example.com", password: "password123", name: "User Test" },
  { id: "2", email: "admin@example.com", password: "admin123", name: "Admin Test" }
]
```

## Fitur yang Akan Ditambahkan

1. ✅ Login dengan email/password
2. ✅ Logout
3. ✅ Session management
4. ✅ Protected routes (checkout harus login)
5. ✅ User info di UI
6. ✅ Redirect setelah login
7. ✅ Persistent session (JWT di cookie)

## Langkah Implementasi

1. Install NextAuth dependencies
2. Setup environment variables
3. Buat auth configuration file
4. Buat auth API route
5. Update layout dengan SessionProvider
6. Buat login page
7. Buat protected route component
8. Buat user menu component
9. Update checkout untuk require authentication
10. Tambahkan navigation dengan auth state

## File yang Akan Dibuat/Dimodifikasi

- **Baru**: `auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/login/page.tsx`, `components/ProtectedRoute.tsx`, `components/UserMenu.tsx`, `components/Navbar.tsx`
- **Modifikasi**: `app/layout.tsx`, `app/products/[id]/checkout-button.tsx`, `package.json`, `.env.local`

## Catatan Pembelajaran

- NextAuth menggunakan JWT untuk session (tidak perlu database untuk session storage)
- Credentials provider memvalidasi email/password secara manual
- Session bisa diakses via `useSession()` hook atau `getServerSession()` di server components
- Protected routes menggunakan middleware atau component wrapper
- Nanti bisa upgrade ke database (Prisma) untuk store real users
- Nanti bisa tambahkan OAuth providers (Google, GitHub) untuk login sosial

### To-dos

- [ ] Install NextAuth.js v5 dan dependencies yang diperlukan
- [ ] Setup environment variables (AUTH_SECRET, NEXTAUTH_URL)
- [ ] Buat auth.ts configuration file dengan Credentials provider dan hardcoded users
- [ ] Buat API route handler di app/api/auth/[...nextauth]/route.ts
- [ ] Update app/layout.tsx untuk wrap dengan SessionProvider
- [ ] Buat login page dengan form email/password di app/login/page.tsx
- [ ] Buat ProtectedRoute component untuk protect halaman yang memerlukan auth
- [ ] Buat UserMenu component untuk menampilkan user info dan logout button
- [ ] Buat Navbar component dengan login button atau user menu
- [ ] Update checkout button untuk require authentication sebelum checkout