<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>

<body>
    <div class="container">
        <div class="content-chat mt-20">
            <div class="content-chat-user">
                <div class="head-search-chat">
                    <h4 class="text-center">Chat Finder</h4>
                </div>

                <div class="search-user mt-30">
                    <input id="search-input" type="text" placeholder="Search..." name="search" class="search">
                    <span>
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>

                <div class="list-search-user-chat mt-20">
                    <div class="user-chat" data-username="{{ $user->name }}" data-user_id="{{ $user->id }}" data-user_type="user">
                        <div class="user-chat-img">
                            <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="">
                            <div class="online"></div>
                        </div>

                        <div class="user-chat-text">
                            <p class="mt-0 mb-0"><strong> {{ $user->name }} </strong></p>
                            <small>Hi, how are you?</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-chat-message-user" data-username="{{ $user->name }}">
                <div class="head-chat-message-user">
                    <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="">
                    <div class="message-user-profile">
                        <p class="mt-0 mb-0 text-white"><strong> {{ $user->name }} </strong></p>
                        <small class="text-white">
                            <p class="online  mt-0 mb-0"></p>Online
                        </small>
                    </div>
                </div>
                <div class="body-chat-message-user">
                    @forelse ($chat_messages as $message)
                        <div class="message-user-{{ $message->send_user == $user->id ? 'right' : 'left' }}">
                            <div class="message-user-{{ $message->send_user == $user->id ? 'right' : 'left' }}-img">
                                <p class="mt-0 mb-0"><strong> {{ $user->name }} </strong></p>
                                <small> {{ Carbon\Carbon::parse($message->created_at)->format('H:i:s') }} </small>
                                <img src="https://images.pexels.com/photos/2117283/pexels-photo-2117283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="" />
                            </div>
                            <div class="message-user-{{ $message->send_user == $user->id ? 'right' : 'left' }}-text">
                                <strong>{{ $message->message }}</strong>
                            </div>
                        </div>
                    @empty
                        No any chat messages
                    @endforelse
                </div>
                <div class="footer-chat-message-user">
                    <div class="message-user-send">
                        <input type="text" placeholder="Aa" class="txtMessage">
                    </div>
                    <button type="button" class="btnSend">
                        <i class="fa fa-paper-plane"></i>
                    </button>
                </div>
            </div>


        </div>
    </div>
</body>
<script src="{{ asset('js/jquery.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('js/bootstrap.bundle.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('js/socket.io.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const userChats = document.querySelectorAll('.user-chat');
        const chatMessages = document.querySelectorAll('.content-chat-message-user');

        userChats.forEach((userChat) => {
            userChat.addEventListener('click', () => {
                const selectedUsername = userChat.getAttribute('data-username');

                chatMessages.forEach((chatMessage) => {
                    const messageUsername = chatMessage.getAttribute('data-username');

                    if (messageUsername === selectedUsername) {
                        chatMessage.classList.add('active');
                    } else {
                        chatMessage.classList.remove('active');
                    }
                });

                userChats.forEach((chat) => {
                    chat.classList.remove('active');
                });
                userChat.classList.add('active');
            });
        });

        // Activar el primer elemento user-chat inicialmente
        userChats[0].classList.add('active');
        chatMessages[0].classList.add('active');
    });

    let socket = io.connect("{{ env('CHAT_URL') }}" + ':' + "{{ env('CHAT_PORT') }}");
    // console.log(socket);
    let sendUserId = "{{ auth()->user() ? auth()->user()->id : '' }}";
    let recieveUserId = "{{ $admin->id }}";
    let sendUserType = "user";
    let recieveUserType = "admin";
    let getChatMessagesUrl = "{{ route('getChatMessages') }}";
    let userName = "{{ auth()->user() ? auth()->user()->name : 'Guest' }}";
    let csrfToken = "{{ csrf_token() }}";
</script>
<script type="text/javascript" src="{{ asset('js/chat2.js') }}"></script>


</html>
