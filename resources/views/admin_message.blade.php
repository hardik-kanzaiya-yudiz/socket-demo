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
                    @forelse ($users as $user)
                        <div class="user-chat" data-user_id="{{ $user->id }}" data-username="{{ $user->name }}">
                            <div class="user-chat-img">
                                <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="">
                                <div class="offline"></div>
                            </div>

                            <div class="user-chat-text">
                                <p class="mt-0 mb-0"><strong> {{ $user->name }} </strong></p>
                                <small>Hi, how are you?</small>
                            </div>
                        </div>
                    @empty
                        No Any Users
                    @endforelse

                </div>
            </div>

            {{-- user chats  --}}
            @forelse ($users as $user)
                <div class="content-chat-message-user" data-user_id="{{ $user->id }}"
                    data-username="{{ $user->name }}">
                    <div class="head-chat-message-user">
                        <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="">
                        <div class="message-user-profile">
                            <p class="mt-0 mb-0 text-white"><strong> {{ $user->name }} </strong></p>
                            <small class="text-white">
                                <p class="offline  mt-0 mb-0"></p>Offline
                            </small>
                        </div>
                    </div>
                    <div class="body-chat-message-user">

                    </div>
                    <div class="footer-chat-message-user">
                        <div class="message-user-send">
                            <input type="text" placeholder="Aa" class="txtMessage">
                        </div>
                        <button type="button" class="btnSend">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            @empty
                No any chats
            @endforelse
        </div>
    </div>
</body>
<script src="{{ asset('js/jquery.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('js/bootstrap.bundle.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('js/socket.io.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const userChats = document.querySelectorAll('.user-chat');
        // console.log(userChats);
        const chatMessages = document.querySelectorAll('.content-chat-message-user');
        // console.log(chatMessages);
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
        // userChats[0].classList.add('active');
        // chatMessages[0].classList.add('active');
    });

    let socket = io.connect("{{ env('CHAT_URL') }}" + ':' + "{{ env('CHAT_PORT') }}");
    let sendUserId = recieveUserId = sendUserType = recieveUserType = csrfToken = getChatMessagesUrl = userName = ""
    $(document).on("click", '.user-chat', function() {
        sendUserId = "{{ auth()->user()->id }}";
        recieveUserId = $(this).data("user_id");
        sendUserType = "admin";
        recieveUserType = 'user';
        csrfToken = "{{ csrf_token() }}";
        getChatMessagesUrl = "{{ route('getChatMessages') }}";
        userName = "{{ auth()->user() ? auth()->user()->name : 'Guest' }}"
    });
</script>
<script type="text/javascript" src="{{ asset('js/chat2.js') }}"></script>

</html>
