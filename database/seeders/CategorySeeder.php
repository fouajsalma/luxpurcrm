<?php

namespace Database\Seeders;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
   public function run()
{
    \App\Models\Category::insert([
    ['name' => 'Hôtel'],
    ['name' => 'Riad'],
    ['name' => 'Restaurant'],
    ['name' => 'Client VIP'],
    ['name' => 'Client entreprise'],
    ['name' => 'Agence de voyage'],
    ['name' => 'Réservation'],
    ['name' => 'Partenaire'],
]);
}
}
