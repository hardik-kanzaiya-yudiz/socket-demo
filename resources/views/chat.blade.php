<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
        type="text/css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"
        type="text/css" />
    <style>
        textarea {
            resize: none;
        }

        .scroll-smooth {
            scroll-behavior: smooth;
        }

        .max-vh-100 {
            height: calc(100vh - 123px) !important;
        }

        .chat-window {
            overflow-y: auto;
            height: calc(100vh - 268px) !important;
        }

        .chat-message {
            padding: 12px;
            /* border: 1px solid #b4b4b4; */
        }

        .sender {
            display: flex;
            justify-content: end;
        }

        .sender span.message {
            /* background-color: #6495ED; */
            background-color: #0d6efd;
            text-align: right;
            padding: 0.5rem 1rem 0.5rem 1rem;
            border-radius: 8px 2px 8px 8px;
            width: fit-content;
            max-width: 70%;
            word-break: break-all;
            color: #f1f1f1;
            text-align: left;
        }

        .sender span.message sub.timestamp {
            font-size: 10px;
            color: #e1e1e1;
            margin-left: 5px;
        }

        .receiver {
            display: flex;
            justify-content: start;
            position: relative;
        }

        .receiver span.message {
            background-color: #b4b4b4;
            text-align: left;
            padding: 0.3rem 1rem 0.3rem 1rem;
            border-radius: 2px 8px 8px 8px;
            width: fit-content;
            max-width: 60%;
            word-break: break-all;
            position: relative;
        }

        .receiver span.message sub.timestamp {
            font-size: 12px;
            text-align: right;
            margin-left: 10px;
        }

        .chat-window-title {
            padding: 5px;
            border: 1px solid #dee2e6;
            border-radius: 8px 8px 0 0;
        }

        .chat-window-title h5 {
            margin-bottom: 0;
        }

        .chat-window-title small {
            color: rgba(33, 37, 41, 0.75);
        }

        .chat-room {
            cursor: pointer;
        }

        .chat-room.active {
            background-color: goldenrod;
            color: white;
        }
    </style>
</head>

<body>
    <main class="py-4">
        <div class="container bg-light p-2 rounded border shadow-sm">
            <div>
                <center>
                    <h2>Chat Rooms User</h2>
                </center>
            </div>
            <div class="row p-3 max-vh-100 ">
                <div class="col-3 h-100">
                    <!-- border-end -->

                    <div class="h-100 bg-white rounded border overflow-y-auto scroll-smooth">
                        {{-- @forelse($chatRooms as $chatRoom)
                            @if ($chatRoom->admin)
                                <div class="chat-room @if (!$loop->last) border-bottom px-3 py-3 @else px-3 py-3 @endif"
                                    data-room-id='{{ $chatRoom->id }}' data-admin-id='{{ $chatRoom->admin->id }}'>
                                    <div class="d-flex w-100 justify-content-between chatHeader">
                                        <h5 class="chatTitle mb-1">{{ $chatRoom->admin->full_name }}</h5>
                                        <small class="chatStatus"></small>
                                    </div>
                                    <div class="list-group">
                                        <small class="lastMessage" style="font-size: 13px;">
                                            @if ($chatRoom->chatMessage)
                                                {{ $chatRoom->chatMessage->message }}
                                            @endif
                                        </small>
                                    </div>
                                </div>
                            @endif
                        @empty
                            No Details Found.
                        @endforelse --}}
                        {{-- @forelse($chatRooms as $chatRoom)
                            @if ($chatRoom->admin) --}}
                        <div class="chat-room px-3 py-3 " data-room-id='1' data-admin-id='1'>
                            <div class="d-flex w-100 justify-content-between chatHeader">
                                <h5 class="chatTitle mb-1"> Hardik</h5>
                                <small class="chatStatus"></small>
                            </div>
                            <div class="list-group">
                                <small class="lastMessage" style="font-size: 13px;">
                                    {{-- @if ($chatRoom->chatMessage)
                                        {{ $chatRoom->chatMessage->message }}
                                    @endif --}}
                                </small>
                            </div>
                        </div>
                        {{-- @endif
                        @empty
                            No Details Found.
                        @endforelse --}}
                    </div>
                </div>
                <div class="col-9 position-relative">
                    <div class="chat-window-title">
                        <h5 class="text-dark" id="chatTitle">User Name</h5>
                        <small class="text-muted" id="chatStatus">online</small>
                    </div>
                    <div class="bg-white chat-window border rounded p-3 scroll-smooth">
                    </div>
                    <div class="row mt-3 position-absolute bottom-0 w-100">
                        <div class="col">
                            <div class="row">
                                <div class="col">
                                    <textarea placeholder="Write your message here..." class="form-control rounded-pill txtMessage" rows="1" readonly></textarea>
                                </div>
                                <div class="col-2 d-flex justify-content-center align-items-center">
                                    <div>
                                        <button class="btn btn-primary px-5 rounded-pill btnSend" disabled>Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.js"></script>
    <script>
        let socket = io.connect("{{ env('CHAT_URL') }}" + ':' + "{{ env('CHAT_PORT') }}");
        console.log(socket);
        let urlChatMessages = "{{ route('chatMessages') }}";
        let userId = 1;
        let userType = "user";
        let oppUserType = "admin";
        let csrfToken = "{{ csrf_token() }}";
        let sender = 2;
    </script>
    <script type="text/javascript" src="{{ asset('chat.js') }}"></script>
</body>

</html>
