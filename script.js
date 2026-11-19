const eventDate = new Date("2026-12-19T10:00:00+02:00");

const timerFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function updateCountdown() {
  const distance = eventDate.getTime() - Date.now();
  if (distance <= 0) {
    Object.values(timerFields).forEach((field) => { field.textContent = "00"; });
    document.querySelector("#countdownTitle").textContent = "Today, we celebrate!";
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;
  timerFields.days.textContent = String(Math.floor(distance / day)).padStart(2, "0");
  timerFields.hours.textContent = String(Math.floor((distance % day) / hour)).padStart(2, "0");
  timerFields.minutes.textContent = String(Math.floor((distance % hour) / minute)).padStart(2, "0");
  timerFields.seconds.textContent = String(Math.floor((distance % minute) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const backgroundMusic = document.querySelector("#backgroundMusic");
const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");
const musicGate = document.querySelector("#musicGate");
const enterInvitation = document.querySelector("#enterInvitation");
backgroundMusic.volume = 0.45;
let musicWasPausedByVisitor = false;

function revealInvitation() {
  if (musicGate.hidden || musicGate.classList.contains("is-opening")) return;
  musicGate.classList.add("is-opening");
  document.body.classList.remove("music-gate-open");
  window.setTimeout(() => { musicGate.hidden = true; }, 600);
}

function updateMusicControl(isPlaying) {
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  musicLabel.textContent = isPlaying ? "Thulisa umculo" : "Dlala umculo";
}

async function playBackgroundMusic() {
  if (musicWasPausedByVisitor) return;
  try {
    await backgroundMusic.play();
    updateMusicControl(true);
    revealInvitation();
  } catch {
    updateMusicControl(false);
  }
}

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    musicWasPausedByVisitor = false;
    await playBackgroundMusic();
  } else {
    backgroundMusic.pause();
    musicWasPausedByVisitor = true;
    updateMusicControl(false);
  }
});

enterInvitation.addEventListener("click", async () => {
  musicWasPausedByVisitor = false;
  await playBackgroundMusic();
  revealInvitation();
});

backgroundMusic.addEventListener("play", () => updateMusicControl(true));
backgroundMusic.addEventListener("pause", () => updateMusicControl(false));

playBackgroundMusic();
document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest("#musicToggle")) playBackgroundMusic();
}, { once: true });
window.addEventListener("pageshow", playBackgroundMusic);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") playBackgroundMusic();
});
