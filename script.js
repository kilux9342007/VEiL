function login() {
    let input = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let foundUser = users.find(user =>
        (user.username === input || user.email === input) &&
        user.password === password
    );

    if (foundUser) {
        kiNotify("Access Granted! Welcome " + foundUser.username, "success");
    } else {
        kiNotify("Access Denied! Wrong credentials.", "error");

        const loginBox = document.querySelector(".login-box");
        loginBox.classList.add("shake");
        setTimeout(() => {
            loginBox.classList.remove("shake");
        }, 500);
    }
}


const toggleEye = document.querySelector('#toggleEye');
const passwordField = document.querySelector('#password');

toggleEye.addEventListener('click', function () {
    // 1. Switch the 'type' attribute
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // 2. Toggle the eye icon style (Eye vs Eye-Slash)
    this.classList.toggle('fa-eye-slash');
});

const buttons = document.querySelectorAll(".login-btn");

buttons.forEach(btn => {

    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        btn.style.setProperty("--btn-x", x + "px");
        btn.style.setProperty("--btn-y", y + "px");
    });

    // 🔥 FIX: reset para di mag stuck
    btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--btn-x", "50%");
        btn.style.setProperty("--btn-y", "50%");
    });

});


const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// 🖱️ MOUSE
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener('mousemove', (e) => { 
    mouse.x = e.x; 
    mouse.y = e.y; 
});

// 🕷️ PET
let pet = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 6
};

// ✨ PARTICLE CLASS
class Particle {
    constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(0, 242, 255, 0.9)";

        // glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 242, 255, 0.8)";

        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.dx *= -1;
        if (this.y > canvas.height || this.y < 0) this.dy *= -1;

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// INIT
function init() {
    particlesArray = [];

    let num = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < Math.min(num, 120); i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

        let dx = (Math.random() - 0.5) * 0.4; // 🔥 slower = smoother
        let dy = (Math.random() - 0.5) * 0.4;

        particlesArray.push(new Particle(x, y, dx, dy, size));
    }
}

// ANIMATE
function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DOTS
    particlesArray.forEach(p => p.update());

    // 🕷️ PET FOLLOW (smooth)
    pet.x += (mouse.x - pet.x) * 0.08;
    pet.y += (mouse.y - pet.y) * 0.08;

    // 🕸️ WEB CONNECTION (SPIDER EFFECT 🔥)
    particlesArray.forEach(p => {
        let dx = p.x - pet.x;
        let dy = p.y - pet.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
            ctx.strokeStyle = `rgba(255, 179, 71, ${1 - dist / 120})`;
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(pet.x, pet.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
    });

    // DRAW PET (on top of lines)
    ctx.beginPath();
    ctx.arc(pet.x, pet.y, pet.size, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(255, 179, 71, 1)";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "rgba(255, 179, 71, 0.9)";

    ctx.fill();
    ctx.shadowBlur = 0;
}


// RESIZE FIX
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

const displayElement = document.getElementById('typewriter-text');
const fullPhrase = "We bring the action closer to you through smart strategies, teamwork, and the drive to win every point!";

let charIndex = 0;
let isDeleting = false;

function playTypewriter() {
    // Current state of the text
    const currentText = fullPhrase.substring(0, charIndex);
    displayElement.textContent = currentText;

    let typeSpeed = isDeleting ? 30 : 60; // Deletes faster than it types

    if (!isDeleting && charIndex < fullPhrase.length) {
        // Typing
        charIndex++;
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        charIndex--;
    } else if (!isDeleting && charIndex === fullPhrase.length) {
        // Full sentence is typed, pause for 3 seconds
        isDeleting = true;
        typeSpeed = 3000; 
    } else if (isDeleting && charIndex === 0) {
        // Fully cleared, pause before restarting
        isDeleting = false;
        typeSpeed = 200;
    }

    setTimeout(playTypewriter, typeSpeed);
}

// Kick off the animation
playTypewriter();



let aiBox = document.querySelector(".ai-input-box");
let aiLogo = document.querySelector(".ai-circle");
let input = document.getElementById("userInput");
let idleTimer;

// 🔥 START IDLE
function startIdle() {
  aiBox.classList.add("idle");
  aiLogo.classList.add("idle");
  aiBox.classList.remove("active");
}

// 🔥 STOP IDLE (pag ginagamit)
function stopIdle() {
  aiBox.classList.remove("idle");
  aiLogo.classList.remove("idle");
  aiBox.classList.add("active");
}

// 🔥 RESET TIMER (para bumalik idle after no activity)
function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    startIdle();
  }, 10000); // ⬅️ tagal bago bumalik animation
}

// 👉 FOCUS / TYPE
input.addEventListener("focus", () => {
  stopIdle();
});

input.addEventListener("input", () => {
  stopIdle();
  resetIdleTimer();
});

// 👉 BLUR
input.addEventListener("blur", () => {
  resetIdleTimer();
});

// 🔥 INITIAL STATE
startIdle();


// =======================
// 💬 SEND MESSAGE
// =======================

function sendMessage() {
  let text = input.value;

  if (text === "") return;

  stopIdle(); // ❗ STOP animation habang nagchachat

  let dots = 0;

  // 🔹 typing dots
  let typing = setInterval(() => {
    dots = (dots + 1) % 4;
    input.value = "VEiL is typing" + ".".repeat(dots);
  }, 300);

  setTimeout(() => {
    clearInterval(typing);

    let msg = text.toLowerCase();
    let reply = "";

    if (
      msg.includes("hello") ||
      msg.includes("hey") ||
      msg.includes("hi")
    ) {
      reply = "Hi! I'm VEiL. How can I help you today?";
    } 
    else if (msg.includes("maganda ba ako?")||
      msg.includes("ganda") ||
      msg.includes("pretty")
    ) {
        reply = "Only if you are Kim Jasmine Tolentino.";
    }
    else if (msg.includes("pogi")) {
        reply = "Yes… from a certain angle 😂😂👌";
    }
    else {
      reply = "Hmm... I'm still learning";
    }

    input.value = "";

    let i = 0;

    function typeEffect() {
      if (i < reply.length) {
        input.value += reply.charAt(i);
        i++;
        setTimeout(typeEffect, 40);
      } else {
        // ⏳ stay muna bago mawala
        setTimeout(() => {
          input.value = "";

          // 🔥 AFTER CHAT → saka lang babalik idle
          resetIdleTimer();

        }, 6500); // stay duration
      }
    }

    typeEffect();

  }, 1500);
}



function openSignup() {
    const login = document.getElementById("loginContainer");
    const signup = document.getElementById("signupContainer");

    login.classList.add("hide");

    setTimeout(() => {
        signup.classList.add("active");
    }, 200);

    // 🔥 ADD HISTORY
    history.pushState({ page: "signup" }, "", "#signup");
}


window.addEventListener("popstate", function () {
    const login = document.getElementById("loginContainer");
    const signup = document.getElementById("signupContainer");

    signup.classList.remove("active");

    setTimeout(() => {
        login.classList.remove("hide");
    }, 200);
});



const signupEye = document.getElementById("signupEye");
const signupPass = document.getElementById("signupPassword");

if (signupEye && signupPass) {
    signupEye.addEventListener("click", function () {
        const type = signupPass.type === "password" ? "text" : "password";
        signupPass.type = type;
        this.classList.toggle("fa-eye-slash");
    });
}


const confirmEye = document.getElementById("confirmEye");
const confirmPass = document.getElementById("confirmPassword");

if (confirmEye && confirmPass) {
    confirmEye.addEventListener("click", function () {
        const type = confirmPass.type === "password" ? "text" : "password";
        confirmPass.type = type;
        this.classList.toggle("fa-eye-slash");
    });
}


function openLogin() {
    const login = document.getElementById("loginContainer");
    const signup = document.getElementById("signupContainer");

    signup.classList.remove("active");

    setTimeout(() => {
        login.classList.remove("hide");
    }, 200);
}

const container = document.createElement('div');
container.id = 'notification-box';
document.body.appendChild(container);


function kiNotify(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `ki-toast ${type}`;
    
    toast.innerHTML = `
        <span>${msg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => { toast.remove(); }, 200);
    }, 2000);
}


function signup() {
    let terms = document.getElementById("termsCheck");
    let pass = document.getElementById("signupPassword").value.trim();
    let confirm = document.getElementById("confirmPassword").value.trim();

    let inputs = document.querySelectorAll('#signupContainer input');

    let firstName = inputs[0].value.trim();
    let lastName = inputs[1].value.trim();
    let email = inputs[2].value.trim();
    let username = inputs[3].value.trim();

    let btn = document.querySelector("#signupContainer .login-btn");

    // =====================
    // ❌ EMPTY CHECK
    // =====================
    if (!firstName || !lastName || !email || !username || !pass || !confirm) {
        kiNotify("Please complete all fields!", "error");
        return;
    }

    // =====================
    // ❌ TERMS CHECK
    // =====================
    if (!terms.checked) {
        kiNotify("Please agree to Terms & Privacy Policy", "error");
        return;
    }

    // =====================
    // ❌ EMAIL VALIDATION
    // =====================
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(emailPattern)) {
        kiNotify("Invalid email format!", "error");
        return;
    }

    // =====================
    // ❌ PASSWORD MATCH
    // =====================
    if (pass !== confirm) {
        kiNotify("Passwords do not match!", "error");
        return;
    }

    // =====================
    // 🔥 STRONG PASSWORD
    // =====================
    let strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!pass.match(strongPass)) {
        kiNotify("Password must be 8+ chars, include A-Z, a-z, number & symbol", "error");
        return;
    }

    // =====================
    // ❌ CHECK DUPLICATE
    // =====================
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existUser = users.find(user =>
        user.username === username || user.email === email
    );

    if (existUser) {
        kiNotify("Username or Email already exists!", "error");
        return;
    }

    // =====================
    // 🔥 LOADING
    // =====================
    btn.innerText = "Creating...";
    btn.disabled = true;

    setTimeout(() => {

        users.push({
            firstName,
            lastName,
            email,
            username,
            password: pass
        });

        localStorage.setItem("users", JSON.stringify(users));

        kiNotify("Account Created Successfully!", "success");

// 🔥 CLEAR ALL INPUTS
inputs.forEach(input => input.value = "");
document.getElementById("signupPassword").value = "";
document.getElementById("confirmPassword").value = "";
terms.checked = false;

btn.innerText = "Create Account";
btn.disabled = false;

openLogin(); // optional: pwede mo rin tanggalin kung gusto mo stay sa signup


    }, 1200);
}


// 🔓 OPEN
function openForgot() {
    document.getElementById("forgotBox").style.display = "flex";
}

// ❌ CLOSE
function closeForgot() {
    document.getElementById("forgotBox").style.display = "none";
}

// 🔁 RESET PASSWORD
function submitForgot() {
    let input = document.getElementById("fpUser").value.trim();
    let newPass = document.getElementById("fpNewPass").value.trim();

    if (!input || !newPass) {
        kiNotify("Complete all fields!", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u =>
        u.username.toLowerCase() === input.toLowerCase() ||
        u.email.toLowerCase() === input.toLowerCase()
    );


    if (!user) {
        kiNotify("User not found!", "error");
        return;
    }

    let strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!newPass.match(strongPass)) {
        kiNotify("Password must be 8+ chars with A-Z, a-z, number & symbol!", "error");
        return;
    }

    user.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    kiNotify("Password updated!", "success");

    document.getElementById("fpUser").value = "";
    document.getElementById("fpNewPass").value = "";

    closeForgot();
}



const fpEye = document.getElementById("fpEye");
const fpPass = document.getElementById("fpNewPass");

if (fpEye && fpPass) {
    fpEye.addEventListener("click", function () {
        const type = fpPass.type === "password" ? "text" : "password";
        fpPass.type = type;

        this.classList.toggle("fa-eye-slash");
    });
}
