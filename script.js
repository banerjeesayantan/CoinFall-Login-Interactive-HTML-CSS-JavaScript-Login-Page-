// ===== Selectors =====
const emailInput    = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const loginButton   = document.querySelector(".btn-primary");
const resultMsg     = document.querySelector("#rlt_show");
const formGroups    = document.querySelectorAll(".form-group"); // [email-group, password-group]
const canvas        = document.getElementById('coinCanvas');
const ctx           = canvas.getContext('2d');

// ===== Canvas Setup =====
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const coinImage = new Image();
coinImage.src = './pixelcut-export - Copy.png';

let coins = [];
const COIN_BASE_SIZE = 250;   // average coin size
const COIN_VARIATION = 7;   // how much random variation (+/-)

// ===== Coin Class =====
class Coin {
   constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = COIN_BASE_SIZE + Math.random() * COIN_VARIATION;
    this.speed = 2 + Math.random() * 3;
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(coinImage, -this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
  }
}

// ===== Animation Loop (runs once) =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  coins.forEach((coin, index) => {
    coin.update();
    coin.draw();
    if (coin.y > canvas.height + 50) coins.splice(index, 1); // remove offscreen coins
  });
  requestAnimationFrame(animate);
}
animate(); // start the animation loop once

// ===== Generate Coins =====
function generateCoins(count = 30) {
  for (let i = 0; i < count; i++) {
    coins.push(new Coin());
  }
}

// ===== Validation Patterns =====
const emailPattern    = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ===== Helper Functions =====
function isEmailValid(email)    { return email && emailPattern.test(email); }
function isPasswordValid(pass)  { return pass && passwordPattern.test(pass); }
function toggleFieldError(index, isError) { 
  if(isError) formGroups[index].classList.add("inncent");
  else formGroups[index].classList.remove("inncent");
}
function showError(message) { resultMsg.textContent = message; resultMsg.style.color = "red"; }
function showSuccess(message) { resultMsg.textContent = message; resultMsg.style.color = "green"; }

// ===== Login Button Click Handler =====
loginButton.addEventListener("click", (e) => {
  e.preventDefault();

  const email    = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const emailValid    = isEmailValid(email);
  const passwordValid = isPasswordValid(password);

  // Toggle visual error states
  toggleFieldError(0, !emailValid);
  toggleFieldError(1, !passwordValid);

  // Validation messages
  if (!email || !password) showError("⚠️ Please fill in both fields!");
  else if (!emailValid) showError("⚠️ Invalid email!");
  else if (!passwordValid) showError("⚠️ Password must be at least 8 chars, include 1 uppercase, 1 number & 1 special!");
  else {
    showSuccess("✅ Login Successful!");
    formGroups.forEach(g => g.classList.remove("inncent"));

    // Trigger coin rain on successful login
    generateCoins(100); // adjust count as needed
  }
});

// ===== Handle Window Resize =====
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
