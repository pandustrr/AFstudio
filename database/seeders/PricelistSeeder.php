<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricelistCategory;
use App\Models\PricelistSubCategory;
use App\Models\PricelistPackage;
use Illuminate\Support\Facades\DB;

class PricelistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to avoid duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        PricelistPackage::truncate();
        PricelistSubCategory::truncate();
        PricelistCategory::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create All Categories first
        $ultah = PricelistCategory::create(['name' => 'ULTAH & MATERNITY', 'type' => 'photographer']);
        $wedding = PricelistCategory::create(['name' => 'WEDDING', 'type' => 'photographer']);
        $shotVideo = PricelistCategory::create(['name' => 'SHOT VIDEO', 'type' => 'photographer']);
        $wisuda = PricelistCategory::create(['name' => 'wisuda baru', 'type' => 'photographer']);
        $paketWedding = PricelistCategory::create(['name' => 'Paket Wedding', 'type' => 'photographer']);

        // Data for Category: wisuda baru
        // Sub Category: wcc
        $wcc_wisuda = PricelistSubCategory::create([
            'category_id' => $wisuda->id,
            'name' => 'wcc'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc_wisuda->id,
            'name' => 'Basic',
            'price_display' => '100k',
            'price_numeric' => 100000,
            'duration' => 30,
            'features' => [
                '1 WCC',
                'sesi shot selama 20-30 menit (tanpa File mentah)',
                '1 video Cinematic edit 30-40 detik (DL 4 hari)',
                '1 video story edit 10-15 detik (DL malam hari H)',
                'Shot by IP',
                'file on DRIVE'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc_wisuda->id,
            'name' => 'Standart',
            'price_display' => '200k',
            'price_numeric' => 200000,
            'duration' => 60,
            'features' => [
                '1 WCC',
                'shot selama 40-60 menit (tanpa File mentah)',
                '1 video Cinematic edit 1 menit (DL 4 hari)',
                '1 video story edit 10-15 detik (DL malam hari H)',
                'Shot by IP',
                'file on DRIVE'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc_wisuda->id,
            'name' => 'Exclusive',
            'price_display' => '250k',
            'price_numeric' => 250000,
            'duration' => 60,
            'is_popular' => true,
            'features' => [
                '1 WCC',
                'shot selama 60 menit (tanpa File mentah)',
                '1 video Cinematic edit 1 menit (DL 3 hari)',
                '1 video story edit 15-30 detik (DL malam hari H)',
                'Request Voice Over',
                'Request Text Narasi',
                'Shot by IP',
                'file on DRIVE'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc_wisuda->id,
            'name' => 'Royal',
            'price_display' => '300k',
            'price_numeric' => 300000,
            'duration' => 60,
            'features' => [
                '1 WCC',
                'shot selama 60 menit',
                '1 video Cinematic edit 1 menit (DL 3 hari)',
                '1 video story edit, 15-30 detik (DL malam hari H)',
                'Free foto bersama keluarga & teman',
                'File Mentah foto dan video diberikan',
                'request Consept video',
                'Request Voice Over',
                'Request Text Narasi',
                'Shot by IP',
                'file on DRIVE'
            ]
        ]);

        // Data for Category: SHOT VIDEO
        // Sub Category: SHOT
        $shot = PricelistSubCategory::create([
            'category_id' => $shotVideo->id,
            'name' => 'SHOT'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $shot->id,
            'name' => 'Basic (1)',
            'price_display' => '550k',
            'price_numeric' => 550000,
            'duration' => 240,
            'features' => ['1 kamera', '1 personil', '1 disk', 'Editing 15-30 menit', 'Maks 4 jam kerja', 'File On drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $shot->id,
            'name' => 'Standart (1:1)',
            'price_display' => '850k',
            'price_numeric' => 850000,
            'duration' => 240,
            'features' => ['1 kamera', '1 personil', '1 disk', 'Editing 15-30 menit', 'Maks 4 jam kerja', '1 proyeksi', 'Kabel hadmi untuk 1 proyeksi', 'File On drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $shot->id,
            'name' => 'Luxury (2)',
            'price_display' => '850k',
            'price_numeric' => 850000,
            'duration' => 360,
            'features' => ['1-2 kamera', '1-2 personil', '2 disk', 'Editing 30-60 menit', 'Maks 6 jam kerja', 'file on flasdisk']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $shot->id,
            'name' => 'Exclusive (2:4)',
            'price_display' => '1350k',
            'price_numeric' => 1350000,
            'duration' => 360,
            'is_popular' => true,
            'features' => ['2 kamera', '3 personil', 'System broadcasting', 'File jadi full acara', 'Maks 6 jam kerja', 'Proyeksi maks 4', 'HDMI untuk 4 proyeksi', 'file on flasdisk']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $shot->id,
            'name' => 'Royal (1:1 strm)',
            'price_display' => '1450k',
            'price_numeric' => 1450000,
            'duration' => 240,
            'features' => ['1 kamera', '2 personil', 'System broadcasting', 'File jadi full acara', 'Maks 4 jam kerja', 'Maks 1 proyeksi', 'HDMI untuk 1 proyeksi', 'Live stream - Wifi lokasi', 'Sett up channel with operator', 'file on flasdisk']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $shot->id,
            'name' => 'Royal exclusive (2:4 strm)',
            'price_display' => '1550k',
            'price_numeric' => 1550000,
            'duration' => 360,
            'features' => ['2 kamera', '3 personil', 'System broadcasting', 'File jadi full acara', 'Maks 6 jam kerja', 'Maks 4 proyeksi', 'HDMI untuk 4 proyeksi', 'Live stream - kuota dari operator', 'Sett up channel with operator', 'file on flasdisk']
        ]);

        // Data for Category: WEDDING
        // Sub Category: L M R
        $lmr = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'L M R'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $lmr->id,
            'name' => 'Basic',
            'price_display' => '475',
            'price_numeric' => 475000,
            'duration' => 180,
            'features' => ['unlimited files', 'maks 3 jam photo Session', 'oudoor session potrait', 'edits 20', 'File on gDrive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $lmr->id,
            'name' => 'Standard',
            'price_display' => '750',
            'price_numeric' => 750000,
            'duration' => 180,
            'features' => ['unlimited files', 'maks 3 jam photo Session', 'oudoor session potrait', 'edits 30', 'File on Flashdisk']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $lmr->id,
            'name' => 'Exclusive',
            'price_display' => '800',
            'price_numeric' => 800000,
            'duration' => 240,
            'is_popular' => true,
            'features' => ['unlimited files', 'maks 4 jam photo Session', 'oudoor session potrait', 'edits 40', 'cetak 20 foto polaroid', '1 album polaroid', 'File on Flashdisk']
        ]);

        // Sub Category: PRE POST WEDD
        $prepost = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'PRE POST WEDD'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Basic',
            'price_display' => '475k',
            'price_numeric' => 475000,
            'duration' => 180,
            'features' => ['Unlimited File', '1 Fg', 'softfile 100-300', 'Outdoor session', 'edit 20', 'durasi 3j', 'all file on google drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Standart',
            'price_display' => '775k',
            'price_numeric' => 775000,
            'duration' => 180,
            'features' => ['Unlimited File', '1 fg', 'softfile 100-300', 'request sortir file', 'consept discuss', '1 book moodboard consept', 'Outdoor session', 'edit 30', 'durasi 3j', 'all file on google drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Exclusive',
            'price_display' => '825k',
            'price_numeric' => 825000,
            'duration' => 240,
            'is_popular' => true,
            'features' => ['Unlimited File', '1 FG', 'softfile 300-700', 'request sortir file', 'Outdoor session', 'consept discuss', '1 book moodboard consept', 'cetak 1 x 12Rs', '1 frme 12Rs', 'edit 40', 'durasi 4j', 'all file on google drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Royal Exclusive',
            'price_display' => '1500k',
            'price_numeric' => 1500000,
            'duration' => 480,
            'features' => ['Unlimited File', '2 FG', 'softfile 500-1000', 'request sortir file', 'consept discuss', '1 book moodboard consept', 'Outdoor session', 'cetak 2 x 14Rs', '2 frame 14Rs', 'Edit 80 edits', 'unlimited a day', 'file with FLASHDISK']
        ]);

        // Sub Category: AK ONLY
        $akonly = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'AK ONLY'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Basic',
            'price_display' => '475k',
            'price_numeric' => 475000,
            'duration' => 180,
            'features' => ['Unlimited File', 'Maks 3 Jam pemotretan', '1 Fotografer', '20 edits foto', 'Pemotretan outdoor Request', 'All File On Drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Standart',
            'price_display' => '750k',
            'price_numeric' => 750000,
            'duration' => 180,
            'features' => ['Unlimited File', 'Maks 3 Jam pemotretan', '1 Fotografer', 'Pemotretan outdoor Request', '20 edits foto', 'Cetak 20 foto uk 2R Polaroid', '1 Album 2R Polaroid', 'All File On Drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Exclusive',
            'price_display' => '850k',
            'price_numeric' => 850000,
            'duration' => 240,
            'is_popular' => true,
            'features' => ['Unlimited File', 'Maks 4 Jam pemotretan', '2 Fotografer', 'Pemotretan outdoor Request', '40 edits foto', 'Cetak 40 foto uk 4R', '1 Album 4R', 'All File On Drive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Royal Exclusive',
            'price_display' => '1300k',
            'price_numeric' => 1300000,
            'duration' => 240,
            'features' => ['Unlimited File', 'Maks 4 Jam pemotretan', '2 Fotografer', 'Pemotretan outdoor Request', '85 edits foto', 'Cetak 85 foto uk 4R', '1 Album 4R Magnetic', 'All File On Drive']
        ]);

        // Sub Category: R O
        $ro = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'R O'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ro->id,
            'name' => 'Basic',
            'price_display' => '600k',
            'price_numeric' => 600000,
            'duration' => 360,
            'features' => ['unlimited files', 'maks 6jam photo Session', 'oudoor session potrait', 'edits 20', 'Softfile only', 'File on gDrive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ro->id,
            'name' => 'Standart',
            'price_display' => '850k',
            'price_numeric' => 850000,
            'duration' => 360,
            'features' => ['unlimited files', 'maks 6jam photo Session', 'pemotretan oudoor request', 'cetak 1 Roll/40 foto 4R', '1 album 4R', 'edits 40', 'File on gDrive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ro->id,
            'name' => 'Exclusive',
            'price_display' => '1.500k',
            'price_numeric' => 1500000,
            'duration' => 360,
            'is_popular' => true,
            'features' => ['unlimited files', 'maks 6jam photo Session', 'pemotretan oudoor request', 'Cetak 85 foto 4R', '1 album magnetic', 'Edits 85 foto', 'file on flashdisk']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ro->id,
            'name' => 'Royal exclusive',
            'price_display' => '2.500k',
            'price_numeric' => 2500000,
            'duration' => 360,
            'features' => ['unlimited files', 'maks 6jam photo Session', 'pemotretan oudoor request', 'Cetak 80 - 120 foto', '1 album magazine 16 hal', 'Edits 120 foto', 'file on flashdisk']
        ]);

        // Sub Category: A R
        $ar = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'A R'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ar->id,
            'name' => 'Basic',
            'price_display' => '750k',
            'price_numeric' => 750000,
            'duration' => 480,
            'features' => ['unlimited files', 'maks 8jam photo Session', 'pemotretan oudoor request', 'edits 25', 'Softfile only', 'File on gDrive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ar->id,
            'name' => 'Standart',
            'price_display' => '925k',
            'price_numeric' => 925000,
            'duration' => 480,
            'features' => ['unlimited files', 'maks 8jam photo Session', 'pemotretan oudoor request', 'cetak 1 Roll/40 foto 4R', '1 album 4R', 'edits 40', 'File on gDrive']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ar->id,
            'name' => 'Exclusive',
            'price_display' => '1700',
            'price_numeric' => 1700000,
            'duration' => 480,
            'is_popular' => true,
            'features' => ['unlimited files', 'maks 8jam photo Session', 'pemotretan oudoor request', 'Cetak 85 foto 4R', '1 album magnetic', 'Edits 85 foto', 'file on flashdisk']
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ar->id,
            'name' => 'royal Exclusive',
            'price_display' => '2900k',
            'price_numeric' => 2900000,
            'duration' => 600,
            'features' => ['unlimited files', 'maks 10jam photo Session', 'pemotretan oudoor request', 'Cetak 80-120 foto', '1 album magazine', '1 tas koper magazine', 'Edits 120 foto', 'file on flashdisk']
        ]);

        // Sub Category: ULT & MATT (for ULTAH & MATERNITY)
        $ultmatt = PricelistSubCategory::create([
            'category_id' => $ultah->id,
            'name' => 'ULT & MATT'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ultmatt->id,
            'name' => 'Basic',
            'price_display' => '300k',
            'price_numeric' => 300000,
            'duration' => 60,
            'features' => [
                'Unlimited File',
                'Maks 1jam pemotretan',
                'Request pemotretan outdoor',
                '20 edit foto',
                'All file On drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ultmatt->id,
            'name' => 'Standart',
            'price_display' => '550',
            'price_numeric' => 550000,
            'duration' => 120,
            'features' => [
                'Unlimited files',
                '2 jam maks pemotretan',
                'Request pemotretan outdoor',
                '20 Edits foto',
                'All file On drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ultmatt->id,
            'name' => 'Exclusive',
            'price_display' => '600',
            'price_numeric' => 600000,
            'duration' => 180,
            'is_popular' => true,
            'features' => [
                'Unlimited files',
                '3 jam maks pemotretan',
                'Request pemotretan outdoor',
                '40 Edits foto',
                'All file On drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ultmatt->id,
            'name' => 'Royal',
            'price_display' => '950k',
            'price_numeric' => 950000,
            'duration' => 240,
            'features' => [
                'Unlimited files',
                '4 jam maks pemotretan',
                'Request pemotretan outdoor',
                '40 Edits foto',
                '1 book request konsept moodboard',
                'Concept discuss with FG',
                'Mercendise pakage Birthday',
                'All file On Flashdisk'
            ]
        ]);
        // Sub Category: PAKET COMPLETE
        $complete = PricelistSubCategory::create([
            'category_id' => $paketWedding->id,
            'name' => 'PAKET COMPLETE'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $complete->id,
            'name' => 'Basic',
            'price_display' => '1.000K',
            'price_numeric' => 1000000,
            'duration' => 360,
            'features' => [
                'Prewedding (Unlimited files, 2 jam session, 1 lokasi, 20 edit, Softfile)',
                'Akad (Unlimited files, 4 jam pemotretan, 1 fotografer, 40 edit)',
                'Cetak 40 foto ukuran 4R',
                'All file on Google Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $complete->id,
            'name' => 'Standard',
            'price_display' => '1.300K',
            'price_numeric' => 1300000,
            'duration' => 480,
            'is_popular' => true,
            'features' => [
                'Prewedding (Unlimited files, 2 jam session, 1 lokasi, 20 edit, Softfile)',
                'Resepsi (Unlimited files, 6 jam session, 2 fotografer, 40 edit)',
                'Cetak 1 roll / 40 foto ukuran 4R',
                '1 album 4R',
                'File on Google Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $complete->id,
            'name' => 'Exclusive',
            'price_display' => '2.000K',
            'price_numeric' => 2000000,
            'duration' => 600,
            'features' => [
                'Prewedding (Unlimited files, 2 jam session, 1 lokasi, 20 edit, Softfile)',
                'Akad & Resepsi (Unlimited files, 8 jam session, 2 fotografer, 80 edit)',
                'Cetak 80 foto ukuran 4R',
                '1 album magnetic',
                'File on flashdisk'
            ]
        ]);

        // Sub Category: PAKET ALL SESSION
        $allSession = PricelistSubCategory::create([
            'category_id' => $paketWedding->id,
            'name' => 'PAKET ALL SESSION'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $allSession->id,
            'name' => 'Basic',
            'price_display' => '1.200K',
            'price_numeric' => 1200000,
            'duration' => 180,
            'features' => [
                'Unlimited files (Malsimal 3 jam pemotretan)',
                '2 fotografer + Shot video dokumentasi',
                '40 foto edit + Editing video (15–30 menit)',
                'Cetak 40 foto 4R + 1 album 4R',
                'All file on Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $allSession->id,
            'name' => 'Standard',
            'price_display' => '1.500K',
            'price_numeric' => 1500000,
            'duration' => 360,
            'features' => [
                'Unlimited files (Maksimal 6 jam pemotretan)',
                '2 fotografer + Shot video dokumentasi',
                '40 foto edit + Editing video (15–30 menit)',
                'Cetak 1 roll / 40 foto 4R + 1 album 4R',
                'File on Google Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $allSession->id,
            'name' => 'Exclusive',
            'price_display' => '1.700K',
            'price_numeric' => 1700000,
            'duration' => 480,
            'features' => [
                'Unlimited files (Maksimal 8 jam pemotretan)',
                '2 fotografer + Shot video dokumentasi',
                '40 foto edit + Editing video (30–40 menit)',
                'Cetak 1 roll / 40 foto 4R + 1 album 4R',
                'File on Google Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $allSession->id,
            'name' => 'Premium Exclusive',
            'price_display' => '2.300K',
            'price_numeric' => 2300000,
            'duration' => 480,
            'features' => [
                'Unlimited files (Maksimal 8 jam pemotretan)',
                '2 fotografer + Shot video dokumentasi',
                '80 foto edit + Editing video (15–30 menit)',
                'Cetak 80 foto 4R + 1 album magnetic',
                'File on Google Drive'
            ]
        ]);

        // Sub Category: WEDDING WCC
        $wcc = PricelistSubCategory::create([
            'category_id' => $paketWedding->id,
            'name' => 'WEDDING WCC'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc->id,
            'name' => 'Basic (3 Hours)',
            'price_display' => '650K',
            'price_numeric' => 650000,
            'duration' => 180,
            'features' => [
                'Unlimited files (Maksimal 3 jam kerja)',
                '20 foto edit + Pemotretan outdoor',
                '2 konten (by request, durasi 1–2 menit)',
                '3 video story',
                'All file on Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc->id,
            'name' => 'Standard (6 Hours)',
            'price_display' => '1.000K',
            'price_numeric' => 1000000,
            'duration' => 360,
            'features' => [
                'Unlimited files (Maksimal 6 jam kerja)',
                '40 foto edit + Cetak 40 foto 4R',
                '1 album 4R + Liputan WCC',
                '2 konten (1–2 menit) + 5 video story',
                'File on Google Drive'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $wcc->id,
            'name' => 'Exclusive (8 Hours)',
            'price_display' => '1.200K',
            'price_numeric' => 1200000,
            'duration' => 480,
            'features' => [
                'Unlimited files (Maksimal 8 jam session)',
                '40 foto edit + Cetak 1 roll / 40 foto 4R',
                '1 album 4R + Recap durasi 2 momen',
                '3 konten (by request) + 8 video story',
                'Music request + Drive'
            ]
        ]);
    }
}
