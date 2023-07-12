<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;

class AuthenticateController extends Controller
{
    //
    function login()
    {
        return view('login');
    }

    function checkLogin(LoginRequest $request)
    {
        if (auth()->attempt($request->validated())) {
            return to_route('dashboard');
        }
        return to_route('login')->with('error', "Invalid credential");
    }

    /** user_type => 1 admin, 2 user */
    function dashboard()
    {
        $user = auth()->user();
        //user type is admin
        $adminUser = User::where('user_type', '1')->first();
        if ($user->user_type == '1') {
            $users = User::where('user_type', '2')->get();
            return view('admin_message', ["users" => $users]);
        }
        $chatMessage = $this->getChatMessages();
        // dd(auth()->user()->id);
        return view('message', ["user" => $user, 'admin' => $adminUser, 'chat_messages' => $chatMessage]);
    }

    function getChatMessages()
    {
        $chatMessage  = ChatMessage::query();
        $user = auth()->user();
        /** only normal user  */
        if ($user->user_type == "2") {
            $chatMessage = $chatMessage->where('send_user', $user->id)->orWhere('recieve_user', $user->id)->get();
        }

        return $chatMessage;
    }
}
