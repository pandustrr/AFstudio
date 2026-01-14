<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricelistCategory;
use App\Models\PricelistSubCategory;
use App\Models\PricelistPackage;

class PricelistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wedding = PricelistCategory::create(['name' => 'Wedding']);

        // Sub Category: L M R
        $lmr = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'L M R'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $lmr->id,
            'name' => 'Basic',
            'price_display' => '475',
            'features' => [
                'Unlimited File',
                '2 FG - softfile 500-1000',
                'request sortir file',
                'consept discuss',
                '1 book moodboard consept',
                'Outdoor session cetak 2 x 14Rs',
                '2 frame 14Rs',
                'Edit 80 edits',
                'unlimited a day',
                'file with FLASHDISK'
            ]
        ]);

        PricelistPackage::create([
            'sub_category_id' => $lmr->id,
            'name' => 'Standard',
            'price_display' => '750'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $lmr->id,
            'name' => 'Exclusive',
            'price_display' => '800'
        ]);

        // Sub Category: PRE POST WEDD
        $prepost = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'PRE POST WEDD'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Basic',
            'price_display' => '475k'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Standard',
            'price_display' => '775k'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Exclusive',
            'price_display' => '825k'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $prepost->id,
            'name' => 'Royal Exclusive',
            'price_display' => '1500k'
        ]);

        // Sub Category: AK ONLY
        $akonly = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'AK ONLY'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Basic',
            'price_display' => '475k'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Standard',
            'price_display' => '750k'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Exclusive',
            'price_display' => '850k'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $akonly->id,
            'name' => 'Royal Exclusive',
            'price_display' => '1300k'
        ]);

        // Sub Category: R O
        $ro = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'R O'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ro->id,
            'name' => 'Basic',
            'price_display' => '600k'
        ]);

        // Sub Category: A R
        $ar = PricelistSubCategory::create([
            'category_id' => $wedding->id,
            'name' => 'A R'
        ]);

        PricelistPackage::create([
            'sub_category_id' => $ar->id,
            'name' => 'Basic',
            'price_display' => '750k'
        ]);
    }
}
