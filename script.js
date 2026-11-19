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

document.querySelector("#calendarButton").addEventListener("click", () => {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wandisile iQude//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:wandisile-iqude-20261219@invitation",
    "DTSTAMP:20261110T120000Z",
    "DTSTART;TZID=Africa/Johannesburg:20261219T100000",
    "SUMMARY:Wandisile Mokako's iQude Ceremony",
    "LOCATION:1371 Bundu Village\\, kwaMashiyane (ekhabo Thembisile)",
    "DESCRIPTION:You are warmly invited to Wandisile Mokako's iQude ceremony.",
    "GEO:-25.306534;29.065415",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wandisile-iqude-19-december-2026.ics";
  link.click();
  URL.revokeObjectURL(url);
});

const shareButton = document.querySelector("#shareButton");
const shareStatus = document.querySelector("#shareStatus");
shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "Wandisile's iQude Invitation",
    text: "Join us for Wandisile Mokako's iQude ceremony on Saturday, 19 December 2026 at 10:00.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "Invitation shared.";
    } else {
      await navigator.clipboard.writeText(window.location.href);
      shareStatus.textContent = "Invitation link copied.";
    }
  } catch (error) {
    if (error.name !== "AbortError") shareStatus.textContent = "Please copy the link from your browser.";
  }
});

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
backgroundMusic.volume = 0.45;

function updateMusicControl(isPlaying) {
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  musicLabel.textContent = isPlaying ? "Thulisa umculo" : "Dlala umculo";
}

async function playBackgroundMusic() {
  if (localStorage.getItem("iqudeMusic") === "paused") return;
  try {
    await backgroundMusic.play();
    updateMusicControl(true);
  } catch {
    updateMusicControl(false);
  }
}

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    localStorage.setItem("iqudeMusic", "playing");
    await playBackgroundMusic();
  } else {
    backgroundMusic.pause();
    localStorage.setItem("iqudeMusic", "paused");
    updateMusicControl(false);
  }
});

backgroundMusic.addEventListener("play", () => updateMusicControl(true));
backgroundMusic.addEventListener("pause", () => updateMusicControl(false));

playBackgroundMusic();
document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest("#musicToggle")) playBackgroundMusic();
}, { once: true });
