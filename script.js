// Address of our Python API

const API_URL = "http://localhost:8080/messages";


// DOM querying

const messageForm =
    document.querySelector("#message-form");

const messageInput =
    document.querySelector("#message-input");

const messageList =
    document.querySelector("#message-list");

const statusMessage =
    document.querySelector("#status-message");


// -----------------------------
// GET MESSAGES
// -----------------------------

function loadMessages() {

    fetch(API_URL)

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Could not load messages.");
            }

            return response.json();

        })

        .then(function (messages) {

            // Remove old content

            messageList.innerHTML = "";


            if (messages.length === 0) {

                const emptyMessage =
                    document.createElement("p");

                emptyMessage.textContent =
                    "No messages have been recorded.";

                messageList.appendChild(
                    emptyMessage
                );

                return;
            }


            // Create a card for every message

            messages.forEach(
                function (message, index) {

                    const messageCard =
                        document.createElement("div");

                    messageCard.classList.add(
                        "message-card"
                    );


                    const messageNumber =
                        document.createElement("div");

                    messageNumber.classList.add(
                        "message-number"
                    );

                    messageNumber.textContent =
                        "Message " + (index + 1);


                    const messageText =
                        document.createElement("div");

                    messageText.textContent =
                        message;


                    messageCard.appendChild(
                        messageNumber
                    );

                    messageCard.appendChild(
                        messageText
                    );

                    messageList.appendChild(
                        messageCard
                    );

                }
            );

        })

        .catch(function (error) {

            messageList.innerHTML = "";

            const errorMessage =
                document.createElement("p");

            errorMessage.textContent =
                "Unable to load messages.";

            messageList.appendChild(
                errorMessage
            );

            console.log(error);

        });
}


// -----------------------------
// POST MESSAGE
// -----------------------------

function sendMessage(message) {

    fetch(
        API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "text/plain"
            },

            body: message
        }
    )

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Could not send message."
                );

            }


            statusMessage.textContent =
                "Message recorded successfully.";


            messageInput.value = "";


            // Requirement:
            // After POST finishes,
            // send another GET request.

            loadMessages();

        })

        .catch(function (error) {

            statusMessage.textContent =
                "Unable to record message.";

            console.log(error);

        });
}


// -----------------------------
// FORM EVENT
// -----------------------------

messageForm.addEventListener(
    "submit",
    function (event) {

        // Prevent the page from refreshing

        event.preventDefault();


        const message =
            messageInput.value.trim();


        if (message === "") {

            statusMessage.textContent =
                "Please enter a message.";

            return;

        }


        statusMessage.textContent =
            "Sending message...";


        sendMessage(message);

    }
);


// Load existing messages when page opens

loadMessages();