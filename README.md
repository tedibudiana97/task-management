# ✅ Task Management - Aplikasi Manajemen Tugas

> Aplikasi manajemen tugas modern berbasis **Ionic React** dengan fitur lengkap untuk mengelola pekerjaan sehari-hari. Dibangun menggunakan **Capacitor** untuk deployment ke mobile (Android/iOS) dan **Vite** sebagai build tool.

---

## 📱 **Tentang Aplikasi**

**Task Management** adalah aplikasi yang dirancang untuk membantu Anda mengorganisir pekerjaan, meningkatkan produktivitas, dan mencapai target harian. Dengan antarmuka yang intuitif dan fitur yang lengkap, aplikasi ini menjadi solusi terbaik untuk mengelola tugas pribadi maupun tim.

---

## ✨ **Fitur Utama**

### 📋 **Manajemen Tugas**
- ✅ Tambah tugas dengan judul, deskripsi, deadline, dan prioritas
- ✅ Edit tugas yang sudah dibuat
- ✅ Hapus tugas
- ✅ Tandai tugas sebagai selesai / belum selesai
- ✅ Kategori tugas (Pribadi, Pekerjaan, Belajar, Lainnya)
- ✅ Prioritas tugas (Rendah, Sedang, Tinggi)

### 📊 **Dashboard & Analisis**
- 📈 Statistik tugas (total, selesai, tertunda, overdue)
- 📊 Grafik progres tugas per kategori (Chart.js)
- 🎯 Target harian / mingguan
- 🔥 Streak produktivitas

### 🔍 **Filter & Pencarian**
- 🔎 Cari tugas berdasarkan judul
- 🏷️ Filter berdasarkan kategori
- 📅 Filter berdasarkan deadline
- ⚡ Filter berdasarkan status (selesai / belum)

### 🌙 **UI/UX**
- 🌗 Dark Mode dengan Tailwind CSS
- 📱 Responsive design (Mobile First)
- ✨ Animasi transisi
- 🎨 Custom theme

---

## 🛠️ **Teknologi yang Digunakan**

| Teknologi | Fungsi |
|-----------|--------|
| **Ionic React** | Framework utama (hybrid mobile app) |
| **Capacitor** | Deploy ke Android & iOS |
| **React** | Library UI |
| **TypeScript** | Bahasa pemrograman |
| **Vite** | Build tool & development server |
| **Tailwind CSS** | Styling & UI |
| **Chart.js** | Grafik & chart interaktif |
| **React Router** | Navigasi |
| **Axios** | HTTP request ke API |
| **LocalStorage** | Penyimpanan data lokal |

---

## 📁 **Struktur Proyek**
task-management/
├── public/ # Asset statis
├── src/
│ ├── components/ # Komponen reusable
│ │ ├── TaskCard.tsx
│ │ ├── CustomButton.tsx
│ │ ├── CustomInput.tsx
│ │ └── FilterChip.tsx
│ ├── pages/ # Halaman utama
│ │ ├── Dashboard.tsx
│ │ ├── Tasks.tsx
│ │ ├── AddTask.tsx
│ │ ├── TaskDetail.tsx
│ │ ├── Statistics.tsx
│ │ └── Profile.tsx
│ ├── services/ # Service API
│ │ ├── taskService.ts
│ │ ├── authService.ts
│ │ └── storageService.ts
│ ├── types/ # TypeScript interfaces
│ │ └── task.types.ts
│ ├── utils/ # Utility functions
│ │ ├── constants.ts
│ │ ├── helpers.ts
│ │ └── validators.ts
│ ├── theme/ # Theme & styling
│ ├── App.tsx # Root aplikasi
│ └── main.tsx # Entry point
├── capacitor.config.ts # Konfigurasi Capacitor
├── cypress.config.ts # Konfigurasi E2E testing
├── eslint.config.js # Konfigurasi ESLint
├── ionic.config.json # Konfigurasi Ionic
├── package.json # Dependencies
├── tsconfig.json # Konfigurasi TypeScript
├── vite.config.ts # Konfigurasi Vite
└── index.html # HTML entry point

## 🚀 **Cara Menjalankan Aplikasi**

### Prasyarat
- Node.js 18+
- npm / yarn
- Ionic CLI

### Langkah-langkah

# 1. Clone repository
git clone https://github.com/tedibudiana97/task-management.git
cd task-management

# 2. Install dependencies
npm install

# 3. Jalankan di browser (development)
npm run dev
# atau
ionic serve

# 4. Build untuk production
npm run build

# 5. Build untuk mobile (Android)
ionic build
npx cap add android
npx cap sync
npx cap open android

# 6. Build untuk mobile (iOS)
ionic build
npx cap add ios
npx cap sync
npx cap open ios
