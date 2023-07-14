$(document).ready(function () {
    $(".body-chat-message-user").scrollTop(
        $(".body-chat-message-user")[0].scrollHeight
    );

    /** start :: send message  */
    $(document).on("click", ".btnSend", function (e) {
        e.preventDefault();
        let eleValue = $(this)
            .siblings(".message-user-send")
            .children(".txtMessage");
        let message = eleValue.val();
        eleValue.val("");

        var time = getDateTime();
        // console.log(recieveUserId);
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

    /** start ::  admin:active user */
    function getActiveUserId() {
        let activeUser = $(".list-search-user-chat").children(".active");
        if (activeUser) {
            let activeUserId = $(activeUser).data("user_id");
            return activeUserId;
        }
        return false;
    }
    /** end :: admin active user */

    /** start :: recive_message  */
    socket.on("new-message", (request) => {
        let activeOnly = $(".content-chat-message-user.active")
            .children(".body-chat-message-user")
            .children()
            .last();
        let chatActiveUserId = getActiveUserId();

        if (
            (request.sendUserType == "user" &&
                sendUserType == "user" &&
                chatActiveUserId &&
                chatActiveUserId == request.send_user) ||
            (request.sendUserType == "admin" && sendUserType == "admin")
        ) {
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

            activeOnly.after(newMessageSentUser);
            let lastElementWantToappend = activeOnly.parent();
            // console.log(lastElementWantToappend);
            lastElementWantToappend.scrollTop(
                lastElementWantToappend[0].scrollHeight
            );
        } else {
            if (
                (chatActiveUserId && chatActiveUserId == request.send_user) ||
                (chatActiveUserId &&
                    chatActiveUserId == request.recieve_user) ||
                (request.sendUserType =
                    "user" &&
                    request.recieveUserType == "admin" &&
                    chatActiveUserId == request.send_user)
            ) {
                let newMessageSentUser = `<div class="message-user-left">
                    <div class="message-user-left-img">
                        <p class="mt-0 mb-0"><strong>  </strong></p>
                        <img src="https://images.pexels.com/photos/2117283/pexels-photo-2117283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="">
                        <small>  ${getTime()} </small>

                    </div>
                    <div class="message-user-left-text">
                        <strong> ${request.message} </strong>
                    </div>
                 </div>`;

                let lastEle = activeOnly.after(newMessageSentUser);
                let lastElementWantToappend = lastEle.parent();
                lastElementWantToappend.scrollTop(
                    lastElementWantToappend[0].scrollHeight
                );
            }
        }
    });
    /** end :: recive_message */

    // getChatMessages();
    $(document).on("click", ".user-chat", function (e) {
        let userId = $(this).data("user_id");
        let userType = $(this).data("user_type");
        let userName = $(this).data("username");
        if (userType != "user") {
            getChatMessages(userId, userName);
        }
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
                if (textStatus === "success") {
                    let activeOnly = $(
                        ".content-chat-message-user.active"
                    ).children(".body-chat-message-user");

                    if (chatMessages.length == 0) {
                        activeOnly.empty();
                        activeOnly.append("No any chats.");
                    }

                    if (chatMessages.length > 0) {
                        activeOnly.empty();
                        chatMessages.forEach((chatMessage, i) => {
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
                            activeOnly.append(newHtml);
                            activeOnly.scrollTop(activeOnly[0].scrollHeight);
                        });
                    }
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

    /** start : checking_online_offline */
    let userId = $(".user-chat.active").data("user_id");
    if (userId && sendUserType != "") {
        socket.emit("user_connected", userId);
    }
    socket.emit("dissconnect_user", userId);
    socket.on("updateLoggedInUsers", (loggedInUsersId) => {
        const userChatElements = document.querySelectorAll(".user-chat");
        Array.from(userChatElements).map((userChatElement) => {
            const userId = userChatElement.getAttribute("data-user_id");
            let onlineOffline = $(userChatElement)
                .children(".user-chat-img")
                .children("div");
            if (loggedInUsersId.includes(userId)) {
                onlineOffline.addClass("online").removeClass("offline");
            } else {
                onlineOffline.addClass("offline").removeClass("online");
            }
        });
    });

    /** end: checking_online_offline */

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
});
