<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    //
    function getChat()
    {
        $chat  = ChatMessage::select('message')->where("user_id", "1")->get();
        // dd($chats);
        return view("chat");
    }

    function getAnotherUser()
    {
        $chats  = ChatMessage::select('message')->where("user_id", "2")->get();
        return view("chat2");
    }

    function getChatMessages(Request $request)
    {
        //if normal user
        $chatMessage  = ChatMessage::query();
        $user = auth()->user();
        if ($user->user_type == "2") {
            $chatMessage = $chatMessage->where('send_user', $user->id)->orWhere('recieve_user', $user->id)->get();
        } else {
            $chatMessage = $chatMessage->select('send_user', 'recieve_user', 'message', 'created_at')->where('send_user', $request->user_id)->orWhere('recieve_user', $request->user_id)->get();
        }

        if ($chatMessage->isNotEmpty()) {
            return $chatMessage;
        }
        return false;
    }
}
