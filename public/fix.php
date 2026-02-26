<?php
// Masuk ke folder root aplikasi
chdir('../');

echo "<h3>System Diagnostics:</h3>";

// 1. Jalankan storage:link
try {
    echo "Creating storage link... ";
    $output = "";
    exec('php artisan storage:link 2>&1', $output);
    echo "<pre>" . implode("\n", $output) . "</pre>";
} catch (Exception $e) {
    echo "Error storage:link: " . $e->getMessage() . "<br>";
}

// 2. Jalankan route:clear
try {
    echo "Clearing route cache... ";
    $output = "";
    exec('php artisan route:clear 2>&1', $output);
    echo "<pre>" . implode("\n", $output) . "</pre>";
} catch (Exception $e) {
    echo "Error route:clear: " . $e->getMessage() . "<br>";
}

// 3. Cek apakah folder public/storage sudah ada & benar
$link = 'public/storage';
if (is_link($link)) {
    echo "Link 'public/storage' is a valid symbolic link.<br>";
} elseif (is_dir($link)) {
    echo "Link 'public/storage' IS A REAL DIRECTORY (Wrong). You should delete it via File Manager first then run this script again.<br>";
} else {
    echo "Link 'public/storage' does not exist.<br>";
}

echo "<br>Done. Coba cek kembali gambar di Admin.";
