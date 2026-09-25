document.addEventListener("DOMContentLoaded", function () {

    console.log("WE website loaded successfully.");
    console.log("WE Join system starting...");


    /* =========================================================
       GOOGLE SHEETS
    ========================================================= */

    const GOOGLE_SHEETS_URL =
        "https://script.google.com/macros/s/AKfycbztYwGOawoebwMmyRnwjuseuSNphMgmeNdFpAJi4G772CqE4HArd-Xvq2w4WKERZEs19g/exec";


    /* =========================================================
       STEP CONTROL
    ========================================================= */

    function showStep(number) {

        const steps = document.querySelectorAll(".join-step");

        steps.forEach(function (step) {
            step.classList.remove("active");
        });

        const targetStep =
            document.getElementById("step" + number);

        if (!targetStep) {
            console.error(
                "Step " + number + " was not found."
            );
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


    /* =========================================================
       GET CHECKBOX VALUES
    ========================================================= */

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


    /* =========================================================
       STEP 1
    ========================================================= */

    const startButton =
        document.getElementById("startJoinButton");

    const nameInput =
        document.getElementById("name");

    const nameMessage =
        document.getElementById("nameMessage");


    if (startButton) {

        startButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                if (name === "") {

                    if (nameMessage) {
                        nameMessage.textContent =
                            "Please enter your name.";
                    }

                    if (nameInput) {
                        nameInput.focus();
                    }

                    return;
                }


                if (nameMessage) {
                    nameMessage.textContent = "";
                }


                showStep(2);

            }
        );

    } else {

        console.error(
            "startJoinButton was not found."
        );

    }


    /* =========================================================
       NEXT BUTTONS
    ========================================================= */

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


    /* =========================================================
       BACK BUTTONS
    ========================================================= */

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


    /* =========================================================
       FINISH BUTTON
       
       IMPORTANT:
       The user reaches Step 7 immediately.
       Google Sheets submission happens separately.
       ========================================================= */

    const finishButton =
        document.getElementById("finishButton");


    if (finishButton) {

        finishButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /* -----------------------------------------
                   WHATSAPP NUMBER
                ----------------------------------------- */

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


                /* -----------------------------------------
                   COLLECT ALL FORM DATA
                ----------------------------------------- */

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


                /* -----------------------------------------
                   SHOW FINAL STEP FIRST
                ----------------------------------------- */

                const finalName =
                    document.getElementById("finalName");


                if (finalName) {

                    finalName.textContent =
                        name;

                }


                showStep(7);


                /* -----------------------------------------
                   PREPARE GOOGLE SHEETS DATA
                ----------------------------------------- */

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


                /* -----------------------------------------
                   SEND TO GOOGLE SHEETS
                   
                   This does NOT control the form navigation.
                ----------------------------------------- */

                fetch(
                    GOOGLE_SHEETS_URL,
                    {
                        method: "POST",
                        mode: "no-cors",
                        body: formData
                    }
                )
                .then(function () {

                    console.log(
                        "Registration sent to Google Sheets."
                    );

                })
                .catch(function (error) {

                    console.error(
                        "Google Sheets submission error:",
                        error
                    );

                });


                console.log(
                    "Registration completed for:",
                    name
                );

            }
        );

    } else {

        console.error(
            "finishButton was not found."
        );

    }


    /* =========================================================
       ENTER KEY ON NAME
    ========================================================= */

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


    /* =========================================================
       HERO JOIN BUTTON
    ========================================================= */

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


    /* =========================================================
       START ON STEP 1
    ========================================================= */

    showStep(1);


    console.log(
        "WE Join form JavaScript is ready."
    );

});