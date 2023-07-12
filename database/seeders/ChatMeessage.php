<?php

namespace Database\Seeders;

use App\Models\ChatMessage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChatMeessage extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chatMessage = [
            [
                "user_id" => 1,
                "description" => "first message",
            ],
            [
                "user_id" => 1,
                "description" => "second message",
            ],
            [
                "user_id" => 1,
                "description" => "third message",
            ],
            [
                "user_id" => 1,
                "description" => "four message",
            ],

            [
                "user_id" => 2,
                "description" => "first 2 message",
            ],
            [
                "user_id" => 2,
                "description" => "second 2 message",
            ],
            [
                "user_id" => 2,
                "description" => "third 2 message",
            ],
            [
                "user_id" => 2,
                "description" => "four 2 message",
            ],

        ];

        ChatMessage::insert($chatMessage);
    }
}
