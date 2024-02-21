<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Crime;
use App\Models\SpecificCrime;

class CrimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->crimes as $key => $crm) {
            $crime = new Crime;
            $crime->name = $crm["name"];
            $crime->icon = $crm["icon"];
            $crime->icon_3d = $crm["icon_3d"];
            $crime->save();
            foreach ($crm["specific"] as $key => $specific) {
                $specific_crime = new SpecificCrime;
                $specific_crime->name = $specific["name"];
                $specific_crime->crime_id = $crime->id;
                $specific_crime->save();
            }
        }
    }

    public $crimes = [
        [
            "name"  =>  "Violent Crime",
            "icon"  =>  "assets/svg/select-violent-crime.svg",
            "icon_3d"   =>  "assets/svg/map-marker-violent-crime.svg",
            "specific" => [
                [
                    "name"  =>  "Assault",
                ],
                [
                    "name"  =>  "Murder",
                ],
                [
                    "name"  =>  "Armed Robbery",
                ],
                [
                    "name"  =>  "Domestic Violence",
                ],
            ]
        ],
        [
            "name"  =>  "Theft",
            "icon"  =>  "assets/svg/select-theft.svg",
            "icon_3d"   =>  "assets/svg/map-marker-theft.svg",
            "specific" => [
                [
                    "name"  =>  "Home Robbery",
                ],
                [
                    "name"  =>  "Shoplifting",
                ]
            ]
        ],
        [
            "name"  =>  "Property Damage",
            "icon"  =>  "assets/svg/select-property-damage.svg",
            "icon_3d"   =>  "assets/svg/map-marker-property-damage.svg",
            "specific" => [
                [
                    "name"  =>  "Arson",
                ],
                [
                    "name"  =>  "Vandalism",
                ],
                [
                    "name"  =>  "Vehicular hit and run",
                ],
                [
                    "name"  =>  "Car damage",
                ],
            ]
        ],
    ];
}
