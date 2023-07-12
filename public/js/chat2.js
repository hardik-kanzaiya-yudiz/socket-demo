$(document).ready(function () {
    $(".body-chat-message-user").scrollTop(
        $(".body-chat-message-user")[0].scrollHeight
    );

    /** start :: send message  */
    $(document).on("click", ".btnSend", function (e) {
        e.preventDefault();
        let message = $(".txtMessage").val().trim();
        var time = getDateTime();
        // console.log(message);
        // console.log(sendUserId);
        // console.log(recieveUserId);
        // console.log(userType);

        /** 1=>admin 2=>normal_user  */
        socket.emit("send-message", {
            message: message,
            send_user: sendUserId,
            recieve_user: recieveUserId,
            time: time,
            send_user_type: sendUserType,
            recieve_user_type: recieveUserType,
        });
    });
    /** end :: end send message  */

    /** start :: recive_message  */
    socket.on("new-message", (request) => {
        if (request.sendUserType == "user" && sendUserType == "user") {
            let newMessageSentUser = `<div class="message-user-right">
            <div class="message-user-right-img">
                <p class="mt-0 mb-0"><strong> ${userName} </strong></p>
                <small>  ${getTime()} </small>
                <img src="https://images.pexels.com/photos/2117283/pexels-photo-2117283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="">
            </div>
            <div class="message-user-right-text">
                <strong> ${request.message} </strong>
            </div>
         </div>`;
            $(".txtMessage").val("");
            $(".body-chat-message-user")
                .children()
                .last()
                .after(newMessageSentUser);

            $(".body-chat-message-user").scrollTop(
                $(".body-chat-message-user")[0].scrollHeight
            );
        }

        // // console.log(senderType);
        // if (recieveUserType == "admin") {
        //     let recievedUser = `<div class="message-user-left">
        //             <div class="message-user-left-img">
        //                 <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1" alt="">
        //                 <p class="mt-0 mb-0"><strong>${request.message}</strong></p>

        //             </div>
        //             <div class="message-user-left-text">
        //                 <strong>${request.message}</strong>
        //             </div>
        //         </div>`;

        //     let newEle = $(".body-chat-message-user").children().last();
        //     // console.log("hiiii");
        //     newEle.after(recievedUser);
        //     $(".body-chat-message-user").scrollTop(
        //         $(".body-chat-message-user")[2].scrollHeight
        //     );
        // }
    });
    /** end :: recive_message */

    // getChatMessages();
    $(document).on("click", ".user-chat", function (e) {
        let userId = $(this).data("user_id");
        let userName = $(this).data("username");
        // console.log(userId);
        getChatMessages(userId, userName);
    });

    function getChatMessages(userId, userName) {
        $.ajax({
            url: getChatMessagesUrl,
            type: "POST",
            data: {
                _token: csrfToken,
                user_id: userId,
            },
            success: function (chatMessages, textStatus, jqXHR) {
                console.log(textStatus);
                if (textStatus === "success") {
                    if (chatMessages.length == 0) {
                        $(".body-chat-message-user").empty();
                        $(".body-chat-message-user").append("No any chats.");
                    }
                    if (chatMessages.length > 0) {
                        $(".body-chat-message-user").empty();
                        chatMessages.forEach((chatMessage, i) => {
                            // this is the user then get message left side
                            let isSameUser =
                                userId == chatMessage.send_user
                                    ? "left"
                                    : "right";

                            let newHtml = `<div class="message-user-${isSameUser}">
                                <div class="message-user-${isSameUser}-img">
                                    <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        alt="">
                                    <p class="mt-0 mb-0"><strong> ${
                                        isSameUser == "left"
                                            ? userName
                                            : "Admin"
                                    } </strong></p>
                                     <small> ${chatMessage.created_at} </small>
                                </div>
                                <div class="message-user-${isSameUser}-text">
                                    <strong> ${chatMessage.message} </strong>
                                </div>
                            </div>`;
                            $(".body-chat-message-user").append(newHtml);
                            // console.log($(".body-chat-message-user")[0]);
                            console.log($(".body-chat-message-user"));
                            $(".body-chat-message-user").scrollTop(
                                $(".body-chat-message-user")[0].scrollHeight
                            );
                        });
                    } else {
                    }
                    // $(".chat-window").append(chatData);
                    // $(".txtMessage").val("");
                    // $(".btnSend").attr("disabled", true);
                    // $(".chat-window").scrollTop(
                    //     $(".chat-window")[0].scrollHeight
                    // );
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error");
                console.log("jqXHR", jqXHR);
                console.log("textStatus", textStatus);
                console.log("errorThrown", errorThrown);
                console.table(errorThrown);
            },
        });
    }

    /** when press the entre then send message */
    $(".txtMessage").on("keypress", function (e) {
        if (e.keyCode == 13) {
            $(".btnSend").click();
            // return false; // prevent the button click from happening
        }
    });
    /**  */

    /** start :: get date time   */
    function getDateTime() {
        var date = new Date();
        var current_date =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
        var current_time =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return current_date + " " + current_time;
    }
    /** end :: end get time  */

    /** start :  get only time  */
    function getTime() {
        var date = new Date();
        var current_time =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return current_time;
    }
    /** end : get only time */

    /** start :: sender type  */
    function getSenderType(request) {
        console.log(request);
        // if (sender == 1) {
        //     if (userType == "admin") {
        //         var senderType = "sender";
        //     } else {
        //         var senderType = "receiver";
        //     }
        // } else if (sender == 2) {
        //     if (userType == "admin") {
        //         var senderType = "receiver";
        //     } else {
        //         var senderType = "sender";
        //     }
        // }
        let sender = "";
        let reciever = "";
        if (
            request.sendUserType == "user" &&
            request.recieveUserType == "admin"
        ) {
            sender = "user";
            reciever = "admin";
        } else {
            sender = "admin";
            reciever = "user";
        }

        return;
    }
    /** end :: sender type  */
});
