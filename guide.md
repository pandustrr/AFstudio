# Panduan Setup QwertyWeb (Laravel 11 + Inertia + React)

Berikut adalah panduan langkah demi langkah untuk men-setup project baru dengan stack **Laravel 11, Inertia.js (React), Vite, dan Tailwind CSS**.

## 1. Instalasi Dasar (Terminal)

Jalankan perintah berikut secara berurutan di terminal (Powershell/CMD). Pastikan anda berada di dalam folder proyek yang diinginkan.

### A. Install Laravel 11

```bash
# Jika folder masih kosong
composer create-project laravel/laravel:^11.0 .

# ATAU jika ingin membuat folder baru
composer create-project laravel/laravel:^11.0 NamaProject
cd NamaProject
```

### B. Install Library Server-side (Inertia Adapter)

```bash
composer require inertiajs/inertia-laravel
```

### C. Setup Middleware Inertia

```bash
php artisan inertia:middleware
```

### D. Install Dependencies Frontend (React, Vite, Inertia Client)

```bash
npm install react react-dom @inertiajs/react @vitejs/plugin-react
```

### E. Install Tailwind CSS (Support Vite 6)

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## 2. Konfigurasi File Penting

Anda perlu mengedit beberapa file agar sistem berjalan lancar.

### A. Setup `vite.config.js`

File ini mengatur bagaimana aset frontend dikompilasi.

```javascript
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react({
            // Penting agar Hot Module Replacement (HMR) berjalan lancar
            include: "**/*.jsx",
        }),
        tailwindcss(),
    ],
});
```

### B. Setup Root Template (`resources/views/app.blade.php`)

**CRITICAL:** Pastikan menambahkan directive `@viteReactRefresh` agar tidak error saat development.

Buat file baru `resources/views/app.blade.php`:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />

        {{-- Penting: Harus urutannya seperti ini --}} @viteReactRefresh
        @vite('resources/js/app.jsx') @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
```

### C. Aktifkan Middleware (`bootstrap/app.php`)

Daftarkan middleware Inertia yang sudah digenerate tadi.

```php
use App\Http\Middleware\HandleInertiaRequests;

return Application::configure(basePath: dirname(__DIR__))
    // ...
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    // ...
```

---

## 3. Setup Frontend (React)

### A. Entry Point (`resources/js/app.jsx`)

Ganti isi file `app.js` (rename jadi `app.jsx`) dengan kode berikut:

```javascript
import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
```

### B. Setup CSS (`resources/css/app.css`)

Cukup import Tailwind versi baru:

```css
@import "tailwindcss";
```

### C. Halaman Pertama (`resources/js/Pages/Welcome.jsx`)

Buat folder `Pages` di dalam `resources/js`, lalu buat file `Welcome.jsx`:

```javascript
import React from "react";
import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Head title="Welcome" />
            <h1 className="text-4xl font-bold text-blue-600">
                Setup Berhasil! 🚀
            </h1>
        </div>
    );
}
```

---

## 4. Struktur Folder Yang Disarankan

Agar rapi, gunakan struktur berikut di dalam `resources/js`:

```text
resources/js/
├── Components/    # Tombol, Input, Card, dll.
├── Layouts/       # GuestLayout, AuthenticatedLayout
├── Pages/         # Halaman-halaman Website (Home, About, Dashboard)
│   ├── Auth/      # Login, Register
│   └── Profile/   # Edit Profile
├── app.jsx        # Pintu masuk utama React
└── bootstrap.js   # Config axios/laravel echo
```

---

## 5. Menjalankan Server

Anda butuh **DUA** terminal yang berjalan bersamaan:

**Terminal 1 (Laravel Server):**

```bash
php artisan serve
```

**Terminal 2 (Vite Development Server):**

```bash
npm run dev
```

Buka browser di: `http://localhost:8000` (atau port lain yang muncul di terminal).
