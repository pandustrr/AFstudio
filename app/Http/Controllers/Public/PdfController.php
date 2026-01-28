<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class PdfController extends Controller
{
    public function bookingInvoice($bookingCode)
    {
        $booking = Booking::where('booking_code', $bookingCode)
            ->with(['items.package.subCategory.category', 'paymentProof', 'referralCode'])
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.invoice', ['booking' => $booking]);

        return $pdf->stream("Invoice_" . $bookingCode . ".pdf");
    }
}
