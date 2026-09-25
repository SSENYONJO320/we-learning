```javascript
document.addEventListener("DOMContentLoaded", function () {

    console.log("WE website loaded successfully.");
    console.log("WE Join system starting...");


    /* =========================================
       GOOGLE SHEETS CONNECTION
    ========================================= */

    const GOOGLE_SHEETS_URL =
        "https://script.google.com/macros/s/AKfycbztYwGOawoebwMmyRnwjuseuSNphMgmeNdFpAJi4G772CqE4HArd-Xvq2w4WKERZEs19g/exec";


    /* =========================================
       STEP CONTROL
    ========================================= */

    function showStep(number) {

        const steps = document.querySelectorAll(".join-step");

        steps.forEach(function (step) {
            step.classList.remove("active");
        });

        const targetStep =
            document.getElementById("step" + number);

        if (!targetStep) {
            console.error("Step " + number + " was not found.");
            return;
        }

        targetStep.classList.add("active");

        setTimeout(function () {

            targetStep.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 50);

        console.log("Showing step " + number);
    }


    /* =========================================
       GET CHECKBOX VALUES
    ========================================= */

    function getCheckedValues(name) {

        const checked =
            document.querySelectorAll(
                'input[name="' + name + '"]:checked'
            );

        return Array.from(checked)
            .map(function (input) {
                return input.value;
            })
            .join(", ");
    }


    /* =========================================
       NAME STEP
    ========================================= */

    const startButton =
        document.getElementById("startJoinButton");

    const nameInput =
        document.getElementById("name");

    const nameMessage =
        document.getElementById("nameMessage");


    if (!startButton) {

        console.error(
            "startJoinButton was not found."
        );

    } else {

        console.log(
            "Continue button found."
        );

    }


    if (startButton) {

        startButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (!nameInput) {

                    console.error(
                        "Name input was not found."
                    );

                    return;
                }

                const name =
                    nameInput.value.trim();


                if (name === "") {

                    if (nameMessage) {

                        nameMessage.textContent =
                            "Please enter your name.";

                    }

                    nameInput.focus();

                    return;
                }


                if (nameMessage) {

                    nameMessage.textContent = "";

                }


                showStep(2);

            }
        );

    }


    /* =========================================
       NEXT BUTTONS
    ========================================= */

    document
        .querySelectorAll(".nextButton")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const nextStep =
                        button.getAttribute("data-next");

                    if (!nextStep) {

                        console.error(
                            "No data-next value found."
                        );

                        return;
                    }

                    showStep(nextStep);

                }
            );

        });


    /* =========================================
       BACK BUTTONS
    ========================================= */

    document
        .querySelectorAll(".backButton")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const previousStep =
                        button.getAttribute("data-back");

                    if (!previousStep) {

                        console.error(
                            "No data-back value found."
                        );

                        return;
                    }

                    showStep(previousStep);

                }
            );

        });


    /* =========================================
       FINISH BUTTON
    ========================================= */

    const finishButton =
        document.getElementById("finishButton");


    if (finishButton) {

        finishButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();


                /* -------------------------
                   WHATSAPP
                ------------------------- */

                const whatsappInput =
                    document.getElementById("whatsapp");


                if (!whatsappInput) {

                    console.error(
                        "WhatsApp input was not found."
                    );

                    return;
                }


                const whatsapp =
                    whatsappInput.value.trim();


                if (whatsapp === "") {

                    alert(
                        "Please enter your WhatsApp number."
                    );

                    whatsappInput.focus();

                    return;
                }


                /* -------------------------
                   COLLECT FORM DATA
                ------------------------- */

                const name =
                    document
                        .getElementById("name")
                        .value
                        .trim();


                const age =
                    document
                        .getElementById("age")
                        .value
                        .trim();


                const location =
                    document
                        .getElementById("location")
                        .value
                        .trim();


                const about =
                    document
                        .getElementById("aboutYou")
                        .value
                        .trim();


                const interests =
                    getCheckedValues("interest");


                let skills =
                    getCheckedValues("skill");


                const otherSkill =
                    document
                        .getElementById("otherSkill")
                        .value
                        .trim();


                if (otherSkill !== "") {

                    if (skills !== "") {

                        skills +=
                            ", " + otherSkill;

                    } else {

                        skills =
                            otherSkill;

                    }

                }


                const participationInput =
                    document.querySelector(
                        'input[name="participation"]:checked'
                    );


                const participation =
                    participationInput
                        ? participationInput.value
                        : "";


                const anythingElse =
                    document
                        .getElementById("anythingElse")
                        .value
                        .trim();


                /* -------------------------
                   PREPARE GOOGLE SHEETS DATA
                ------------------------- */

                const formData =
                    new URLSearchParams();


                formData.append(
                    "name",
                    name
                );


                formData.append(
                    "age",
                    age
                );


                formData.append(
                    "location",
                    location
                );


                formData.append(
                    "about",
                    about
                );


                formData.append(
                    "interests",
                    interests
                );


                formData.append(
                    "skills",
                    skills
                );


                formData.append(
                    "participation",
                    participation
                );


                formData.append(
                    "whatsapp",
                    whatsapp
                );


                formData.append(
                    "extra",
                    anythingElse
                );


                /* -------------------------
                   TEMPORARILY DISABLE BUTTON
                ------------------------- */

                finishButton.disabled = true;

                finishButton.textContent =
                    "Sending...";


                /* -------------------------
                   SEND TO GOOGLE SHEETS
                ------------------------- */

                try {

                    await fetch(
                        GOOGLE_SHEETS_URL,
                        {
                            method: "POST",
                            mode: "no-cors",
                            body: formData
                        }
                    );


                    console.log(
                        "Registration sent to Google Sheets."
                    );


                } catch (error) {

                    console.error(
                        "Google Sheets error:",
                        error
                    );

                    alert(
                        "We could not save your registration right now. Please try again."
                    );

                    finishButton.disabled = false;

                    finishButton.textContent =
                        "Finish";

                    return;
                }


                /* -------------------------
                   FINAL STEP
                ------------------------- */

                const finalName =
                    document.getElementById("finalName");


                if (finalName) {

                    finalName.textContent =
                        name;

                }


                finishButton.disabled = false;

                finishButton.textContent =
                    "Finish";


                showStep(7);

            }
        );

    }


    /* =========================================
       ENTER KEY ON NAME FIELD
    ========================================= */

    if (nameInput) {

        nameInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    if (startButton) {

                        startButton.click();

                    }

                }

            }
        );

    }


    /* =========================================
       HERO BUTTON
       JavaScript enhancement only.
       HTML href still works if JS fails.
    ========================================= */

    const heroJoinButton =
        document.getElementById("heroJoinButton");


    if (heroJoinButton) {

        heroJoinButton.addEventListener(
            "click",
            function () {

                const joinSection =
                    document.getElementById("join");


                if (joinSection) {

                    setTimeout(
                        function () {

                            joinSection.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        },
                        10
                    );

                }

            }
        );

    }


    /* =========================================
       START ON STEP 1
    ========================================= */

    showStep(1);


    console.log(
        "WE Join form JavaScript is ready."
    );

});
```
