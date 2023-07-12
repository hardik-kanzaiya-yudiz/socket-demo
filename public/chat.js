$(document).ready(function() {

    /* keyup / typing stop */
    $(document).on('keyup', '.txtMessage', function(e) {
        e.preventDefault();

        if($(this).val().trim().length > 0) {
            $('.btnSend').attr('disabled', false);

            sendTyping('stop');
        } else {
            $('.btnSend').attr('disabled', true);
        }
    });

    /* keydown / typing start */
    $(document).on('keydown', '.txtMessage', function(e) {
        sendTyping('start');
    });

    /************************************************ Socket Receive Method *************************************/
    // typing
    socket.on('typing', function(response) {

        $(".chat-room").each(function(){
            var element = $(this);
            var currentUserId = getCurrentUserId(element, oppUserType);

            if( response.room_id == $(this).data('room-id') && response.user_id == currentUserId ){
                var otherRoomMessage = $(this).find('.chatHeader').find('.chatStatus');

                if(response.typing_mode == 'start'){
                    otherRoomMessage.html('typing...');
                }else{
                    setTimeout(function () {
                        otherRoomMessage.html(response.chat_status);
                    }, 2000);
                }
            }
        });
    });

    // online offline
    socket.on('online-offline', function(response) {
        $(".chat-room").each(function(){
            var element             =   $(this);
            var currentUserId       =   getCurrentUserId(element, oppUserType);
            var processArray        =   getProcessArray(oppUserType, response.overallUsers, response.overallAdmins);
            var elementChatStatus   =   $(this).find('.chatHeader').find('.chatStatus');

            if(currentUserId && elementChatStatus){
                if(processArray.length > 0){
                    processArray.forEach(overallUser => {
                        if(overallUser == currentUserId) {
                            changeStatus(elementChatStatus,'online');
                        }else{
                            changeStatus(elementChatStatus,'offline');
                        }
                    });
                }else{
                    changeStatus(elementChatStatus,'offline');
                }
            }
        });
    });

    // Chat Room
    $(document).on('click', '.chat-room', function(e) {
        e.preventDefault();
        let room_id             =   $(this).data('room-id');
        var elementLastMessage  =   $(this).find('.list-group').find('.lastMessage');
        var lastMessage         =   elementLastMessage.html();
        var chatTitle           =   $(this).find('.chatTitle').html();
        var chatStatus          =   $(this).find('.chatStatus').html();
        var color               =   getColorUsingStatus(chatStatus);

        if( !$(this).hasClass('active') ){
            $('.chat-window').children().remove();
        }

        $(this).addClass("active").siblings().removeClass("active");
        $("#chatTitle").html(chatTitle).html();
        $("#chatStatus").html(chatStatus);
        $("#chatStatus").css('color', color);
        $(".txtMessage").prop('readonly', false);
        $(".txtMessage").val('');
        $('.btnSend').prop('disabled', true);

        socket.emit('disconnect-room', {
            user_id     :   userId,
        });

        socket.emit('join-room', {
            room_id     :   room_id,
            user_id     :   userId,
            user_type   :   userType
        })

        getChatMessages(room_id, elementLastMessage, lastMessage);
    });

    function getChatMessages(room_id, elementLastMessage, lastMessage) {
        let message_id = '';
        if(lastMessage == 'undefined') {
            lastMessage = '';
        }

        if( $('.chat-window').find('.chat-message').length ){
            var latestMessage = $('.chat-window').find('.chat-message').last();
            message_id = latestMessage.data('message-id');
        }
        console.log(urlChatMessages);
        $.ajax({
            url: urlChatMessages,
            type: "POST",
            data: {
                _token      :   csrfToken,
                // room_id     :   room_id,
                // message_id  :   message_id
            },
            success: function (chatMessages, textStatus, jqXHR) {
                console.log(chatMessages);
                if(textStatus === "success") {
                    var chatData = '';

                    if(chatMessages.length > 0){
                        chatMessages.forEach((chatMessage, i) => {
                            var senderType = getSenderType(chatMessage.sender);
                            chatData += '<div class="chat-message '+senderType+'" data-message-id='+chatMessage.custom_id+'><span class="message">'+chatMessage.message+'<sub class="timestamp">'+ getMessageTime(chatMessage.created_at) +'</sub></span></div>';

                            if(chatMessages.length > 0){
                                var isLatestMessage = chatMessages.length - 1;
                            }else{
                                var isLatestMessage = chatMessages.length;
                            }
                            elementLastMessage.html(chatMessages[isLatestMessage].message);
                        });
                    }else{
                        if( $('.chat-window').find('.chat-message').length == 0 ){
                            elementLastMessage.html('');
                        }else{
                            elementLastMessage.html(lastMessage);
                        }
                    }
                    $('.chat-window').append(chatData);
                    $('.txtMessage').val('');
                    $('.btnSend').attr('disabled', true);
                    $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error')
                console.log('jqXHR', jqXHR)
                console.log('textStatus', textStatus)
                console.log('errorThrown', errorThrown)
                console.table(errorThrown)
            }
        });
    }

    // new message
    socket.on('new-message', (request)=>{
        var senderType = getSenderType(request.sender);
        var elementLastMessage = activeRoom().find('.list-group').find('.lastMessage');

        if(elementLastMessage){
            if( request.room_id == activeRoomId() ){
                elementLastMessage.html(request.message);

                $('.chat-window').append(
                    '<div class="chat-message '+senderType+' data-message-id='+request.custom_id+'">'+
                        '<span class="message">'+request.message+
                            '<sub class="timestamp">'+ getMessageTime(request.created_at) +'</sub>'+
                        '</span>'+
                    '</div>'
                );
            }else{
                $(".chat-room").each(function(){
                    if( request.room_id == $(this).data('room-id') ){
                        var otherRoomMessage = $(this).find('.list-group').find('.lastMessage');
                        otherRoomMessage.html(request.message);
                    }
                });
            }
        }

        $('.txtMessage').val('');
        $('.btnSend').attr('disabled', true);
        $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);
    });


    /************************************************ Socket Send Message *************************************/

    /* Join The Socket Room */
    socket.emit('join-global', {
        user_id     :   userId,
        user_type   :   userType
    });

    // send message
    $(document).on('click', '.btnSend', function(e) {
        e.preventDefault();

        let admin_id = user_id = '';
        if(userType == 'admin') {
            admin_id        =   userId;
            user_id         =   activeRoom().data('user-id');
        }else if(userType == 'user') {
            admin_id        =   activeRoom().data('admin-id');
            user_id         =   userId;
        }

        let message         =   $('.txtMessage').val().trim();
        let room_id         =   activeRoomId();
        let message_type    =   1;
        let status          =   1;
        var time            =   getDateTime();

        socket.emit('send-message', {
            id              : makeId(8),
            message         : message,
            room_id         : room_id,
            admin_id        : admin_id,
            user_id         : user_id,
            message_type    : message_type,
            sender          : sender,
            status          : status,
            time            : time,
        });
    });

    // send typing
    function sendTyping(typingMode) {
        let roomId              =   activeRoomId();
        var otherRoomMessage    =   activeRoom().find('.chatHeader').find('.chatStatus');
        var chatStatus          =   otherRoomMessage.html();

        socket.emit('typing', {
            user_id     :   userId,
            room_id     :   roomId,
            user_type   :   userType,
            typing_mode :   typingMode,
            chat_status :   chatStatus
        });
    }

    /************************************************ Socket End *************************************/

    /* Extra Helper Functions */
    function activeRoom() {
        return $('.chat-room.active');
    }

    function activeRoomId() {
        return activeRoom().data('room-id');
    }

    function getCurrentUserId(element, user_type) {
        var currentUserId = '';
        if(user_type == 'user') {
            currentUserId = element.data('user-id');
        }else if(user_type == 'admin') {
            currentUserId = element.data('admin-id');
        }
        return currentUserId;
    }

    function getProcessArray(user_type, overallUsers, overallAdmins) {
        var processArray = [];
        if(user_type == 'user') {
            processArray = overallUsers;
        }else if(user_type == 'admin') {
            processArray = overallAdmins;
        }

        return processArray;
    }

    function changeStatus(elementChatStatus,status){
        var color = getColorUsingStatus(status);
        elementChatStatus.css('color',color);
        elementChatStatus.html(status);
        return true;
    }

    function getColorUsingStatus(status){
        var color = '';
        if(status == 'online'){
            color = 'green';
        }else if(status == 'offline'){
            color = 'red';
        }
        return color;
    }

    function getSenderType(sender) {
        var senderType = '';
        if(sender == 1){
            if(userType == 'admin'){
                var senderType = 'sender';
            }else{
                var senderType = 'receiver';
            }
        }else if(sender == 2){
            if(userType == 'admin'){
                var senderType = 'receiver';
            }else{
                var senderType = 'sender';
            }
        }
        return senderType;
    }

    function getMessageTime(date) {
        var time = new Date(date);
        return time.toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    function makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }

    function getDateTime() {
        var date            =   new Date();
        var current_date    =   date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
        var current_time    =   date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
        return  current_date+" "+current_time;
    }
});

