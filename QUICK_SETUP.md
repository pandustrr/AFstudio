# Quick Setup - Google Drive Photo Gallery

## ⚡ Setup Cepat (5 Menit)

### 1️⃣ Dapatkan Google Drive API Key
```
1. Buka: https://console.cloud.google.com/
2. Buat/Pilih Project
3. Enable "Google Drive API"
4. Credentials > Create > API Key
5. Copy API Key
```

### 2️⃣ Tambahkan ke `.env`
```env
GOOGLE_DRIVE_API_KEY=AIzaSy_your_api_key_here
```

### 3️⃣ Set Folder ID di `SelectorPhoto.jsx`
```javascript
// Line 15-18
const driveFolders = {
    Mentahan: '19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI', // ✅ Already configured
    Result: 'YOUR_RESULT_FOLDER_ID_HERE'          // ⚠️ Update this!
};
```

### 4️⃣ Pastikan Folder Accessible
```
1. Buka folder di Google Drive
2. Right click > Share > Get link
3. Set: "Anyone with the link" + "Viewer"
4. Copy Folder ID dari URL
```

### 5️⃣ Test!
```bash
php artisan serve
# Buka: http://localhost:8000/selector-photo
```

---

## 📋 Checklist

- [ ] Google Drive API enabled
- [ ] API Key added to `.env`
- [ ] Folder ID configured in `SelectorPhoto.jsx`
- [ ] Folder permission set to "Anyone with link"
- [ ] Tested on browser

---

## 🔗 Link Folder Saat Ini

**Mentahan**: https://drive.google.com/drive/folders/19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI

**Result**: _Belum dikonfigurasi_

---

## 🚨 Troubleshooting Cepat

| Error | Solusi |
|-------|--------|
| "API key not configured" | Tambahkan `GOOGLE_DRIVE_API_KEY` di `.env` |
| "Failed to fetch photos" | Cek folder ID & permission folder |
| Foto tidak muncul | Pastikan file type adalah image (jpg/png) |
| Download tidak jalan | Allow popup di browser |

---

## 📚 Dokumentasi Lengkap

Lihat: `GOOGLE_DRIVE_SETUP.md` untuk penjelasan detail.
