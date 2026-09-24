const joinButton = document.querySelector("#joinButton");
const nameInput = document.querySelector("#name");
const message = document.querySelector("#message");

joinButton.addEventListener("click", function () {
    const name = nameInput.value;

    message.textContent = "Welcome to We, " + name + "!";
});