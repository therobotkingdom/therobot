const eventDate = new Date("2026-12-19T10:00:00+02:00");

const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function updateCountdown() {
  const distance = eventDate.getTime() - Date.now();
  const countdown = document.querySelector("#countdown");

  if (distance <= 0) {
    countdown.innerHTML = "<p class=\"celebration-message\">The celebration has arrived.</p>";
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;
  countdownFields.days.textContent = Math.floor(distance / day);
  countdownFields.hours.textContent = String(Math.floor((distance % day) / hour)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((distance % hour) / minute)).padStart(2, "0");
  countdownFields.seconds.textContent = String(Math.floor((distance % minute) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.querySelector("#progressBar").style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

document.querySelector("#calendarButton").addEventListener("click", () => {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iQude Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:iqude-wandisile-20261219@invitation",
    "DTSTAMP:20261102T080000Z",
    "DTSTART:20261219T080000Z",
    "DTEND:20261219T120000Z",
    "SUMMARY:iQude — Wandisile Mokako",
    "DESCRIPTION:You are warmly invited to celebrate Wandisile Mokako's iQude.",
    "LOCATION:1371 Bundu Village\\, kwaMashiyane (ekhabo Thembisile)",
    "GEO:-25.306800;29.065410",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wandisile-mokako-iQude.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  const toast = document.querySelector("#toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
});
