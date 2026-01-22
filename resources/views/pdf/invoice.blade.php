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
                    <span style="font-size: 10pt; font-style: italic;">{{ $item->package->subCategory->name }}</span>
                </td>
                <td>
                    {{ \Carbon\Carbon::parse($item->scheduled_date)->format('d/m/Y') }}<br>
                    {{ substr($item->start_time, 0, 5) }} - {{ substr($item->end_time, 0, 5) }} WIB
                </td>
                <td class="qty-col">{{ $item->quantity }}</td>
                <td class="price-col">{{ number_format($item->price, 0, ',', '.') }}</td>
                <td class="price-col">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-row">
            <div class="totals-label">Subtotal</div>
            <div class="totals-value">{{ number_format($booking->total_price, 0, ',', '.') }}</div>
        </div>
        <div class="totals-row">
            <div class="totals-label">Uang Muka (DP 25%)</div>
            <div class="totals-value">- {{ number_format($booking->down_payment, 0, ',', '.') }}</div>
        </div>
        <div class="totals-row grand-total">
            <div class="totals-label">Sisa Tagihan (Pelunasan H-Day)</div>
            <div class="totals-value">{{ number_format($booking->total_price - $booking->down_payment, 0, ',', '.') }}</div>
        </div>
    </div>

    <div style="margin-top: 30px;">
        <div class="payment-status-box">
            STATUS: {{ strtoupper($booking->status) }}
        </div>
    </div>

    @if($booking->notes)
    <div style="margin-top: 30px; border-top: 1px dotted #000; padding-top: 10px;">
        <strong>Catatan Tambahan:</strong><br>
        {{ $booking->notes }}
    </div>
    @endif

    <div class="footer">
        Terima kasih atas kepercayaan Anda menggunakan jasa AF STUDIO.<br>
        Simpan dokumen ini sebagai bukti transaksi yang sah.
    </div>

</body>

</html>