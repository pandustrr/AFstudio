#!/bin/bash

# Pastikan script berhenti jika ada error
set -e

echo "------------------------------------------"
echo "🚀 MEMULAI UPDATE PRODUKSI AFSTUDIO"
echo "------------------------------------------"

# 1. Tarik kode terbaru
echo "🎬 Step 1: Tarik kode dari GitHub..."
git pull origin main

# 2. Update dependensi PHP
echo "🐘 Step 2: Install Composer dependencies..."
composer install --no-dev --optimize-autoloader

# 3. Migrasi Database (HANYA MENGISI YANG BARU)
echo "📂 Step 3: Menjalankan migrasi database..."
php artisan migrate --force

# 4. Optimasi Cache
echo "⚡ Step 4: Membersihkan cache..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "------------------------------------------"
echo "✅ UPDATE SELESAI DAN AMAN!"
echo "------------------------------------------"
