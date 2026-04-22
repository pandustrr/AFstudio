<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$booking = \App\Models\Booking::latest()->first();
if (!$booking) {
    echo "No booking found";
    exit;
}

echo "Booking: " . $booking->booking_code . "\n";
echo "Name: " . $booking->name . "\n";
echo "Items count: " . $booking->items->count() . "\n";

foreach ($booking->items as $index => $item) {
    echo "\nItem " . ($index + 1) . ":\n";
    echo "  Package: " . ($item->package->name ?? 'N/A') . "\n";
    echo "  Date: " . ($item->scheduled_date ? $item->scheduled_date->toDateString() : 'N/A') . "\n";
    echo "  Time: " . $item->start_time . " - " . $item->end_time . "\n";
    echo "  Photographer ID: " . $item->photographer_id . "\n";
    echo "  Room ID: " . $item->room_id . "\n";
    echo "  Selected Times: " . json_encode($item->selected_times) . "\n";
    
    $sessions = $item->photographerSessions->sortBy('start_time');
    echo "  Linked Sessions (" . $sessions->count() . "):\n";
    foreach ($sessions as $s) {
        echo "    ID: {$s->id} | Time: {$s->start_time} | Adj Start: {$s->adjusted_start_time} | Status: {$s->status}\n";
    }
}
