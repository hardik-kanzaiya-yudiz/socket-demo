<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                "id" => generate_uuid(),
                "name" => "admin",
                "email" => "admin@admin.com",
                "user_type" => "1",
                "password" => Hash::make("12345678"),
            ],
            [
                "id" => generate_uuid(),
                "name" => "Vishal",
                "email" => "vishal@gmail.com",
                "user_type" => "2",
                "password" => Hash::make("12345678"),
            ],
            [
                "id" => generate_uuid(),
                "name" => "Hardik",
                "email" => "hardik@gmail.com",
                "user_type" => "2",
                "password" => Hash::make("12345678"),
            ],
            [
                "id" => generate_uuid(),
                "name" => "akshay",
                "email" => "akshay@gmail.com",
                "user_type" => "2",
                "password" => Hash::make("12345678"),
            ],
        ];

        User::insert($users);
    }
}
