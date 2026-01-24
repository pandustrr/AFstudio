<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $booking->booking_code }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 25px;
            color: #000;
            line-height: 1.3;
            font-size: 10pt;
        }

        .header {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }

        .company-name {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
        }

        .company-details {
            font-size: 9pt;
        }

        .invoice-title-box {
            text-align: right;
            margin-bottom: 8px;
        }

        .invoice-header {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            display: inline-block;
            margin-bottom: 3px;
        }

        .ref-number {
            font-size: 10pt;
            font-weight: bold;
        }

        .meta-table {
            width: 100%;
            margin-bottom: 12px;
            border-collapse: collapse;
            font-size: 9pt;
        }

        .meta-table td {
            vertical-align: top;
            padding-bottom: 3px;
        }

        .meta-label {
            width: 75px;
            font-weight: bold;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        .data-table th {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            text-align: left;
            padding: 5px 6px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9pt;
        }

        .data-table td {
            border-bottom: 0.5px solid #ccc;
            padding: 5px 6px;
            font-size: 9pt;
        }

        .data-table .price-col {
            text-align: right;
            width: 100px;
        }

        .data-table .qty-col {
            text-align: center;
            width: 60px;
        }

        .totals-section {
            width: 100%;
            display: table;
        }

        .totals-row {
            display: table-row;
        }

        .totals-label {
            display: table-cell;
            text-align: right;
            padding: 3px 12px 3px 0;
            font-weight: bold;
            font-size: 9pt;
        }

        .totals-value {
            display: table-cell;
            text-align: right;
            width: 110px;
            padding: 3px 6px;
            border-bottom: 0.5px solid #eee;
            font-size: 9pt;
        }

        .grand-total .totals-value {
            border-bottom: 2px double #000;
            font-weight: bold;
        }

        .payment-status-box {
            border: 1px solid #000;
            padding: 7px 14px;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
            margin-top: 6px;
            font-size: 9pt;
        }

        .footer {
            margin-top: 6px;
            text-align: center;
            font-size: 8pt;
            border-top: 0.5px solid #ccc;
            padding-top: 4px;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="company-name">AF STUDIO</div>
        <div class="company-details">
            Jasa Fotografi Profesional & Kreatif<br>
            Jember, Jawa Timur, Indonesia
        </div>
    </div>

    <div class="invoice-title-box">
        <div class="invoice-header">INVOICE</div>
        <div class="ref-number">NO. REF #{{ $booking->booking_code }}</div>
    </div>

    <table class="meta-table">
        <tr>
            <td style="width: 50%;">
                <strong>DITAGIHKAN KEPADA:</strong><br>
                {{ $booking->name }}<br>
                {{ $booking->phone }}<br>
                {{ $booking->university ?? '' }}
            </td>
            <td style="width: 50%;">
                <table style="width: 100%;">
                    <tr>
                        <td class="meta-label">Tanggal:</td>
                        <td>{{ \Carbon\Carbon::parse($booking->booking_date)->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Lokasi:</td>
                        <td>{{ $booking->location }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">UID:</td>
                        <td style="font-weight: bold; font-family: monospace;">{{ $booking->guest_uid ?? $booking->booking_code }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th>Deskripsi Paket</th>
                <th>Jadwal Sesi</th>
                <th class="qty-col">Jml</th>
                <th class="price-col">Harga (IDR)</th>
                <th class="price-col">Total (IDR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($booking->items as $item)
            <tr>
                <td>
                    <strong>{{ $item->package->name }}</strong><br>
                    <span style="font-size: 9pt; font-style: italic; color: #666;">{{ $item->package->subCategory->name }}</span>
                </td>
                <td style="font-size: 10pt;">
                    <strong>{{ \Carbon\Carbon::parse($item->scheduled_date)->format('d/m/Y') }}</strong><br>
                    <span style="font-size: 9pt;">{{ substr($item->start_time, 0, 5) }} - {{ substr($item->end_time, 0, 5) }} WIB</span>
                </td>
                <td class="qty-col" style="font-weight: bold;">{{ $item->quantity }}</td>
                <td class="price-col">{{ number_format($item->price, 0, ',', '.') }}</td>
                <td class="price-col"><strong>{{ number_format($item->subtotal, 0, ',', '.') }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-row">
            <div class="totals-label">Subtotal</div>
            <div class="totals-value">{{ number_format($booking->total_price, 0, ',', '.') }}</div>
        </div>

        @if($booking->discount_amount > 0)
        <div class="totals-row" style="background-color: #f0f8ff; padding: 5px 0;">
            <div class="totals-label">
                Diskon
                @if($booking->referral_code)
                (Kode: {{ $booking->referral_code->code }})
                @endif
            </div>
            <div class="totals-value" style="background-color: #f0f8ff;">- {{ number_format($booking->discount_amount, 0, ',', '.') }}</div>
        </div>

        <div class="totals-row" style="border-top: 2px solid #000;">
            <div class="totals-label" style="font-weight: bold; font-size: 12pt;">Total Akhir (Setelah Diskon)</div>
            <div class="totals-value" style="border-bottom: 2px solid #000; font-weight: bold; font-size: 12pt;">{{ number_format($booking->total_price - $booking->discount_amount, 0, ',', '.') }}</div>
        </div>
        @endif

        <div class="totals-row">
            <div class="totals-label">Uang Muka (DP 25%)</div>
            <div class="totals-value">- {{ number_format($booking->down_payment, 0, ',', '.') }}</div>
        </div>
        <div class="totals-row grand-total">
            <div class="totals-label">Sisa Tagihan (Pelunasan H-Day)</div>
            <div class="totals-value">{{ number_format(($booking->total_price - $booking->discount_amount) - $booking->down_payment, 0, ',', '.') }}</div>
        </div>
    </div>

    <div style="margin-top: 5px;">
        <div class="payment-status-box">
            STATUS BOOKING: {{ strtoupper($booking->status) }}
        </div>
    </div>

    @if($booking->notes)
    <div style="margin-top: 5px; border-top: 0.5px dotted #000; padding-top: 3px; font-size: 7pt;">
        <strong>Catatan:</strong> {{ substr($booking->notes, 0, 100) }}
    </div>
    @endif

    @if($booking->paymentProof && $booking->paymentProof->count() > 0)
    <div style="margin-top: 6px; border: 1px solid #000; padding: 8px; background-color: #f5f5f5;">
        <div style="border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px;">
            <strong style="font-size: 9pt;">BUKTI PEMBAYARAN</strong>
        </div>

        <table style="width: 100%; margin-bottom: 5px; font-size: 8pt;">
            <tr style="border-bottom: 0.5px solid #ccc;">
                <td style="padding: 2px 0; font-weight: bold; width: 35%;">Status:</td>
                <td style="padding: 2px 0; text-transform: uppercase; font-weight: bold; font-size: 8pt;">
                    @if($booking->paymentProof->first()->status === 'verified')
                        ✓ VERIF
                    @elseif($booking->paymentProof->first()->status === 'rejected')
                        ✗ DITOLAK
                    @else
                        MENUNGGU
                    @endif
                </td>
            </tr>
            <tr>
                <td style="padding: 2px 0; font-weight: bold;">File:</td>
                <td style="padding: 2px 0; font-size: 8pt;">{{ substr($booking->paymentProof->first()->file_name, 0, 30) }}</td>
            </tr>
        </table>

        @if($booking->paymentProof->first()->file_type && str_contains($booking->paymentProof->first()->file_type, 'image'))
        <div style="border-top: 1px solid #000; padding-top: 3px; text-align: center;">
            <p style="margin: 2px 0 3px 0; font-weight: bold; font-size: 8pt;">PREVIEW:</p>
            @php
                $filePath = $booking->paymentProof->first()->file_path;
                $storagePath = storage_path('app/public/' . $filePath);
                $publicPath = public_path('storage/' . $filePath);

                $imageFile = null;
                if (file_exists($storagePath)) {
                    $imageFile = $storagePath;
                } elseif (file_exists($publicPath)) {
                    $imageFile = $publicPath;
                }
            @endphp
            @if($imageFile)
            @php
                $imageData = file_get_contents($imageFile);
                $base64 = base64_encode($imageData);
                $mimeType = $booking->paymentProof->first()->file_type;
                $dataUrl = 'data:' . $mimeType . ';base64,' . $base64;
            @endphp
            <img src="{{ $dataUrl }}"
                 alt="Bukti"
                 style="max-width: 100%; max-height: 140px; border: 0.5px solid #333; margin-top: 2px; padding: 2px; background-color: #fff;">
            @else
            <div style="padding: 4px; background-color: #fffacd; border: 0.5px solid #999; margin-top: 2px; font-size: 7pt;">
                ℹ️ Gambar tidak dapat ditampilkan
            </div>
            @endif
        </div>
        @endif
    </div>
    @else
    <div style="margin-top: 6px; border: 0.5px dashed #999; padding: 4px; background-color: #fffacd; text-align: center; font-size: 8pt;">
        ⚠️ BUKTI PEMBAYARAN: BELUM DIUNGGAH
    </div>
    @endif

    <div class="footer">
        Terima kasih atas kepercayaan Anda menggunakan jasa AF STUDIO<br>
        <span style="font-size: 7pt; margin-top: 2px; display: block;">
            <strong>Akses Selector Foto:</strong> Gunakan UID <strong>{{ $booking->guest_uid ?? $booking->booking_code }}</strong>
            di halaman /selector-photo untuk memilih dan mengedit foto Anda
        </span>
    </div>

</body>

</html>
