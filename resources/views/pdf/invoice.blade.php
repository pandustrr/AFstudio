<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $booking->booking_code }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 40px;
            color: #000;
            line-height: 1.4;
            font-size: 11pt;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .company-name {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5px;
            letter-spacing: 2px;
        }

        .company-details {
            font-size: 10pt;
        }

        .invoice-title-box {
            text-align: right;
            margin-bottom: 40px;
        }

        .invoice-header {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            display: inline-block;
            margin-bottom: 5px;
        }

        .ref-number {
            font-size: 12pt;
            font-weight: bold;
        }

        .meta-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }

        .meta-table td {
            vertical-align: top;
            padding-bottom: 10px;
        }

        .meta-label {
            width: 120px;
            font-weight: bold;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .data-table th {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            text-align: left;
            padding: 8px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10pt;
        }

        .data-table td {
            border-bottom: 1px solid #ccc;
            padding: 8px;
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
            padding: 5px 20px 5px 0;
            font-weight: bold;
        }

        .totals-value {
            display: table-cell;
            text-align: right;
            width: 120px;
            padding: 5px 8px;
            border-bottom: 1px solid #eee;
        }

        .grand-total .totals-value {
            border-bottom: 2px double #000;
            font-weight: bold;
        }

        .payment-status-box {
            border: 2px solid #000;
            padding: 10px 20px;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
            margin-top: 20px;
        }

        .footer {
            margin-top: 80px;
            text-align: center;
            font-size: 9pt;
            border-top: 1px solid #ccc;
            padding-top: 10px;
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

    <div style="margin-top: 30px;">
        <div class="payment-status-box">
            STATUS BOOKING: {{ strtoupper($booking->status) }}
        </div>
    </div>

    @if($booking->notes)
    <div style="margin-top: 30px; border-top: 1px dotted #000; padding-top: 10px;">
        <strong>Catatan Tambahan:</strong><br>
        {{ $booking->notes }}
    </div>
    @endif

    @if($booking->paymentProof && $booking->paymentProof->count() > 0)
    <div style="margin-top: 30px; border: 2px solid #000; padding: 20px; background-color: #f5f5f5;">
        <div style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
            <strong style="font-size: 12pt;">📸 BUKTI PEMBAYARAN YANG DIUNGGAH</strong>
        </div>

        <table style="width: 100%; margin-bottom: 15px; font-size: 10pt;">
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Status Verifikasi:</td>
                <td style="padding: 8px 0; text-transform: uppercase; font-weight: bold;">
                    @if($booking->paymentProof->first()->status === 'verified')
                        ✓ TERVERIFIKASI
                    @elseif($booking->paymentProof->first()->status === 'rejected')
                        ✗ DITOLAK
                    @else
                        ⏳ MENUNGGU VERIFIKASI
                    @endif
                </td>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px 0; font-weight: bold;">Nama File:</td>
                <td style="padding: 8px 0;">{{ $booking->paymentProof->first()->file_name }}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px 0; font-weight: bold;">Ukuran:</td>
                <td style="padding: 8px 0;">{{ number_format($booking->paymentProof->first()->file_size / 1024 / 1024, 2) }} MB</td>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px 0; font-weight: bold;">Waktu Upload:</td>
                <td style="padding: 8px 0;">{{ \Carbon\Carbon::parse($booking->paymentProof->first()->created_at)->format('d/m/Y H:i') }}</td>
            </tr>
            @if($booking->paymentProof->first()->verified_at)
            <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px 0; font-weight: bold;">Waktu Verifikasi:</td>
                <td style="padding: 8px 0;">{{ \Carbon\Carbon::parse($booking->paymentProof->first()->verified_at)->format('d/m/Y H:i') }}</td>
            </tr>
            @endif
            @if($booking->paymentProof->first()->admin_notes)
            <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Catatan Admin:</td>
                <td style="padding: 8px 0;">{{ $booking->paymentProof->first()->admin_notes }}</td>
            </tr>
            @endif
        </table>

        @if($booking->paymentProof->first()->file_type && str_contains($booking->paymentProof->first()->file_type, 'image'))
        <div style="border-top: 2px solid #000; padding-top: 15px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 10pt;">PREVIEW BUKTI PEMBAYARAN:</p>
            @php
                $filePath = $booking->paymentProof->first()->file_path;
                // Gunakan public path yang sudah di-symlink
                $imagePath = public_path('storage/' . $filePath);
                $fileExists = @file_exists($imagePath);
            @endphp
            @if($fileExists)
            <img src="{{ asset('storage/' . $filePath) }}"
                 alt="Bukti Pembayaran"
                 style="max-width: 100%; max-height: 400px; border: 2px solid #333; margin-top: 10px; padding: 5px; background-color: #fff;">
            @else
            <div style="padding: 20px; background-color: #fff3cd; border: 2px solid #ffc107; margin-top: 10px;">
                <span style="font-size: 9pt; color: #856404;">
                    ℹ️ File gambar tidak dapat ditampilkan dalam PDF ini<br>
                    Path: {{ $filePath }}<br>
                    Silakan periksa di portal online untuk preview lengkap
                </span>
            </div>
            @endif
        </div>
        @endif
    </div>
    @else
    <div style="margin-top: 30px; border: 2px dashed #ccc; padding: 15px; background-color: #fffacd; text-align: center;">
        <strong style="font-size: 11pt;">⚠️ BUKTI PEMBAYARAN: BELUM DIUNGGAH</strong><br>
        <span style="font-size: 9pt;">Pelanggan diminta untuk mengunggah bukti pembayaran melalui portal online.</span>
    </div>
    @endif

    <div class="footer">
        Terima kasih atas kepercayaan Anda menggunakan jasa AF STUDIO.<br>
        Simpan dokumen ini sebagai bukti transaksi yang sah.
    </div>

</body>

</html>
