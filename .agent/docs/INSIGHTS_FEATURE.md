# Insights Dashboard - Real-time Analytics

## Overview

Fitur Insights Dashboard memberikan admin kemampuan untuk melihat statistik website secara real-time, termasuk:

- **Page Views**: Tracking kunjungan halaman
- **User Interactions**: Tracking interaksi user (klik paket, kategori, contact, dll)
- **Real-time Updates**: Auto-refresh setiap 30 detik

## Struktur Database

### Table: `page_views`

Menyimpan data kunjungan halaman

- `page_name`: Nama halaman
- `url`: URL lengkap
- `device_hash`: Hash unik per device
- `viewed_date`: Tanggal kunjungan
- `viewed_at`: Timestamp kunjungan

### Table: `interactions`

Menyimpan semua jenis interaksi user

- `event_type`: Jenis event (package_click, category_view, contact_click, dll)
- `page_name`: Halaman tempat event terjadi
- `item_id`: ID item yang di-interact
- `item_name`: Nama item
- `payload`: Data tambahan (JSON)
- `device_hash`: Hash unik per device
- `session_id`: Session ID

## Frontend Implementation

### Analytics Utility (`resources/js/Utils/Analytics.js`)

```javascript
trackInteraction({
    event_type: "package_click",
    page_name: "Price List",
    item_id: pkg.id,
    item_name: pkg.name,
    payload: { mode: "cart", price: 1000000 },
});
```

### Tracking Events

1. **Pricelist.jsx**:
    - `category_view`: User klik kategori
    - `subcategory_view`: User klik sub-kategori
    - `package_click`: User klik paket

2. **About.jsx**:
    - `contact_click`: User klik email/WhatsApp

3. **Home.jsx**:
    - `form_submission`: User submit form kontak

## Admin Dashboard

### Route

- `/admin/insights` - Dashboard utama
- `/admin/insights/page/{pageName}` - Detail per halaman

### Features

1. **Key Stats Cards**:
    - Total Kunjungan
    - Pengunjung Unik
    - Rata-rata per Hari

2. **Kunjungan per Halaman**:
    - List halaman dengan jumlah views
    - Clickable untuk detail

3. **URL Terpopuler**:
    - Top 10 URL yang paling banyak dikunjungi

4. **Jenis Interaksi**:
    - Breakdown event types dengan count

5. **Interaksi Live** (Real-time):
    - List 15 interaksi terbaru
    - Auto-refresh setiap 30 detik
    - Animated entry

6. **Log Kunjungan**:
    - Table dengan waktu, halaman, user, IP

## API Endpoint

### POST `/api/track`

Endpoint untuk tracking dari frontend

```json
{
    "event_type": "package_click",
    "page_name": "Price List",
    "item_id": "123",
    "item_name": "Wedding Package",
    "payload": {
        "mode": "cart",
        "price": 1000000
    }
}
```

## Usage

### Menambahkan Tracking Baru

1. Import utility:

```javascript
import { trackInteraction } from "@/Utils/Analytics";
```

2. Call function saat event:

```javascript
onClick={() => {
    trackInteraction({
        event_type: 'button_click',
        page_name: 'Home',
        item_name: 'CTA Button',
        payload: { section: 'hero' }
    });
}}
```

## Notes

- Tracking berjalan di background, tidak mengganggu UX
- Device hash digunakan untuk unique visitor counting
- Auto-refresh dapat diatur di `Index.jsx` (default: 30 detik)
- CSRF token otomatis di-handle oleh utility
