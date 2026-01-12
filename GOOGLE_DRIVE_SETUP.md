# Google Drive Photo Gallery Integration Guide

## Ringkasan Sistem

Sistem ini memungkinkan user untuk melihat dan memilih foto dari folder Google Drive tanpa menyimpan file foto di server aplikasi. Semua foto ditampilkan secara dinamis dari Google Drive menggunakan Google Drive API.

## Cara Kerja Sistem

### 1. **Alur User**
   - User memasukkan UID
   - User memilih tipe Drive (Mentahan/Result)
   - Sistem mengambil daftar foto dari folder Google Drive yang telah dikonfigurasi
   - User dapat melihat galeri foto dengan thumbnail dari Google Drive
   - User dapat memilih foto yang diinginkan
   - User dapat mendownload foto terpilih atau semua foto

### 2. **Teknologi yang Digunakan**
   - **Backend**: Laravel 11 dengan PHP 8.2
   - **Frontend**: React dengan Inertia.js
   - **Google Drive API v3**: Untuk mengakses file di Google Drive
   - **HTTP Client**: Laravel Http facade untuk API calls

### 3. **Struktur File**

```
AFstudio/
├── app/
│   └── Http/
│       └── Controllers/
│           └── GoogleDrivePhotoController.php  # Controller untuk Google Drive API
├── resources/
│   └── js/
│       └── Pages/
│           └── SelectorPhoto.jsx  # Komponen React untuk galeri
└── routes/
    └── web.php  # API routes
```

## Setup & Konfigurasi

### 1. **Mendapatkan Google Drive API Key**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan **Google Drive API**:
   - Pergi ke "APIs & Services" > "Library"
   - Cari "Google Drive API"
   - Klik "Enable"
4. Buat API Key:
   - Pergi ke "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Copy API Key yang dihasilkan
5. (Opsional) Restrict API Key:
   - Klik API Key yang baru dibuat
   - Pilih "API restrictions"
   - Pilih "Restrict key"
   - Centang "Google Drive API"
   - Tambahkan "Application restrictions" sesuai kebutuhan

### 2. **Konfigurasi Folder Google Drive**

1. Buka folder Google Drive yang ingin digunakan
2. Klik kanan folder > "Get link" > "Anyone with the link"
3. Copy Folder ID dari URL. Contoh:
   ```
   https://drive.google.com/drive/folders/19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI
                                            ↑ Ini adalah Folder ID
   ```
4. Pastikan folder memiliki permission "Anyone with the link can view"

### 3. **Konfigurasi Aplikasi**

1. Tambahkan API Key ke file `.env`:
   ```env
   GOOGLE_DRIVE_API_KEY=AIzaSy...your-api-key-here
   ```

2. Update folder ID di `SelectorPhoto.jsx` (baris 15-18):
   ```javascript
   const driveFolders = {
       Mentahan: '19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI',  // Folder ID untuk Mentahan
       Result: 'your-result-folder-id-here'             // Folder ID untuk Result
   };
   ```

## API Endpoints

### 1. **GET /api/google-drive/photos**
Mengambil daftar foto dari folder Google Drive.

**Query Parameters:**
- `folderId` (required): ID folder Google Drive

**Response Success (200):**
```json
{
  "success": true,
  "count": 48,
  "photos": [
    {
      "id": "1ABC123xyz",
      "name": "IMG_0001.JPG",
      "mimeType": "image/jpeg",
      "thumbnail": "https://lh3.googleusercontent.com/...",
      "downloadLink": "https://drive.google.com/uc?export=download&id=1ABC123xyz",
      "viewLink": "https://drive.google.com/file/d/1ABC123xyz/view"
    }
  ]
}
```

**Response Error (400/500):**
```json
{
  "error": "Error message here",
  "details": {}
}
```

### 2. **GET /api/google-drive/file/{fileId}**
Mengambil informasi detail dari file tertentu.

**Response Success (200):**
```json
{
  "success": true,
  "file": {
    "id": "1ABC123xyz",
    "name": "IMG_0001.JPG",
    "thumbnail": "https://lh3.googleusercontent.com/...",
    "downloadLink": "https://drive.google.com/uc?export=download&id=1ABC123xyz",
    "viewLink": "https://drive.google.com/file/d/1ABC123xyz/view"
  }
}
```

## Fitur Utama

### 1. **Galeri Foto Dinamis**
- Foto dimuat secara real-time dari Google Drive
- Menggunakan thumbnail Google Drive untuk loading cepat
- Fallback image jika thumbnail gagal dimuat

### 2. **Pemilihan Foto**
- User dapat memilih satu atau beberapa foto
- Visual feedback dengan border merah untuk foto terpilih
- Counter jumlah foto terpilih

### 3. **Download Foto**
- Download foto terpilih: membuka link download untuk setiap foto
- Download semua foto: membuka folder Google Drive di tab baru

### 4. **Loading & Error States**
- Loading spinner saat mengambil data dari API
- Error message dengan tombol "Coba Lagi"
- Empty state jika folder tidak memiliki foto

## Catatan Penting

### Keamanan
1. **API Key**: Jangan commit API key ke repository. Selalu gunakan `.env`
2. **Folder Permissions**: Pastikan folder Google Drive hanya readable, tidak writable
3. **Rate Limiting**: Google Drive API memiliki quota. Monitor penggunaan di Google Cloud Console

### Limitasi Google Drive API
- **Quota**: 
  - 1,000 requests per 100 seconds per user
  - 10,000 requests per 100 seconds per project
- **File Size**: Maksimal file yang bisa didownload tergantung browser
- **Caching**: Thumbnail di-cache oleh Google, update mungkin memerlukan waktu

### Best Practices
1. Implementasikan caching di backend untuk mengurangi API calls
2. Gunakan pagination jika folder memiliki banyak foto (>100)
3. Compress images untuk upload ke Google Drive
4. Gunakan Service Account untuk production (lebih aman dari API Key)

## Troubleshooting

### Error: "Google Drive API key not configured"
**Solusi**: Tambahkan `GOOGLE_DRIVE_API_KEY` di file `.env`

### Error: "Failed to fetch photos from Google Drive"
**Kemungkinan Penyebab**:
1. Folder ID salah
2. Folder tidak memiliki permission yang benar
3. API Key tidak valid atau quota habis
4. Google Drive API belum diaktifkan

**Solusi**:
1. Verifikasi Folder ID di URL Google Drive
2. Set folder permission menjadi "Anyone with the link"
3. Cek API Key di Google Cloud Console
4. Periksa quota di Google Cloud Console

### Foto tidak muncul / Thumbnail error
**Solusi**:
- Pastikan file adalah image (JPG, PNG, JPEG)
- Periksa permission file individual di Google Drive
- Tunggu beberapa menit untuk thumbnail generation

### Download tidak berfungsi
**Solusi**:
- Periksa popup blocker di browser
- Pastikan file memiliki permission download
- Gunakan browser yang support multiple downloads

## Upgrade ke Service Account (Production)

Untuk production, disarankan menggunakan Service Account daripada API Key:

1. **Buat Service Account**:
   - Google Cloud Console > "IAM & Admin" > "Service Accounts"
   - Create service account
   - Download JSON key file

2. **Share Folder**:
   - Tambahkan service account email sebagai viewer di folder Google Drive

3. **Update Controller**:
   ```php
   use Google\Client;
   use Google\Service\Drive;
   
   $client = new Client();
   $client->setAuthConfig('path/to/service-account.json');
   $client->addScope(Drive::DRIVE_READONLY);
   
   $service = new Drive($client);
   $results = $service->files->listFiles([...]);
   ```

## Support

Untuk pertanyaan atau issue, hubungi tim developer AFstudio.

---

**Terakhir diupdate**: 12 Januari 2026
