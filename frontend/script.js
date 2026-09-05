console.log("JavaScript Loaded!");

const startButton = document.getElementById("startBtn");
const registerSection = document.getElementById("registerSection");
const closeRegisterBtn = document.getElementById("closeRegisterBtn");
const navRegisterBtn = document.getElementById("navRegisterBtn");
const registerButton = document.getElementById("registerBtn");
const registerForm = document.getElementById("registerForm");
const registerToast = document.getElementById("registerToast");

// Helper function to open modal
function openModal() {
    console.log("Opening register modal");
    if (registerSection) {
        registerSection.style.display = "flex";
    }
}

// Helper function to close modal
function closeModal() {
    console.log("Closing register modal");
    if (registerSection) {
        registerSection.style.display = "none";
    }
}

if (startButton) {
    startButton.addEventListener("click", function () {
        console.log("Start button clicked");
        openModal();
    });
}

if (navRegisterBtn) {
    navRegisterBtn.addEventListener("click", function () {
        console.log("Nav register button clicked");
        openModal();
    });
}

if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener("click", function () {
        closeModal();
    });
}

// Close modal when clicking outside content box
if (registerSection) {
    registerSection.addEventListener("click", function (e) {
        if (e.target === registerSection) {
            closeModal();
        }
    });
}

if (registerButton) {
    registerButton.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Register button clicked");

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";

        console.log("Name:", name);
        console.log("Email:", email);

        if (name && email) {
            // Show dynamic success toast
            if (registerToast) {
                registerToast.textContent = `🎉 Welcome, ${name}! Your AI Career Dashboard is initializing...`;
                registerToast.classList.remove("hidden");

                setTimeout(function () {
                    registerToast.classList.add("hidden");
                    if (nameInput) nameInput.value = "";
                    if (emailInput) emailInput.value = "";
                    closeModal();
                }, 2200);
            }
        } else {
            alert("Please fill in both your Name and Email address.");
        }
    });
}