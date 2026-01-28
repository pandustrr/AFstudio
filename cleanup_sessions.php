<?php

use App\Models\PhotographerSession;
use App\Models\Booking;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$sessions = PhotographerSession::where('status', 'booked')
    ->with('bookingItem.booking')
    ->get();

foreach ($sessions as $session) {
    if ($session->bookingItem && $session->bookingItem->booking->status === 'cancelled') {
        echo "Fixing session ID: " . $session->id . " for cancelled booking.\n";
        $session->update([
            'booking_item_id' => null,
            'status' => 'open',
            'cart_uid' => null
        ]);
    }
}

echo "Check complete.\n";
