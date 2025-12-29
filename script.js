const calendarGrid = document.getElementById("calendarGrid");
const summary = document.getElementById("summary");
const searchInput = document.getElementById("searchInput");
const historyList = document.getElementById("historyList");

const topicTitle = document.getElementById("topicTitle");
const topicSummary = document.getElementById("topicSummary");
const topicDates = document.getElementById("topicDates");
const addBtn = document.getElementById("addBtn");
const eventList = document.getElementById("eventList");

const events = [
  { title: "Rent Due", date: "2026-06-01", color: "#64748b" },

  { title: "WWDC Keynote", date: "2026-06-08", color: "#6366f1" },
  { title: "Project Deadline", date: "2026-06-08", color: "#ef4444" },
  { title: "ISRO Launch Window", date: "2026-06-08", color: "#22c55e" },

  { title: "Olympics Opening Ceremony", date: "2026-06-15", color: "#0ea5e9" },

  { title: "TCS NQT Exam", date: "2026-06-20", color: "#f59e0b" },

  { title: "Friend’s Wedding", date: "2026-06-21", color: "#ec4899" }
];

const TOPIC_TRENDS = {
  tech: ["WWDC", "Apple Event", "Google I/O", "OpenAI Dev Day"],
  education: ["TCS NQT", "UPSC", "JEE", "IELTS"],
  government: ["Union Budget", "General Elections", "G20 Summit"],
  science: ["ISRO Launch", "Moon Mission", "Mars Rover"],
  sports: ["Olympics 2028", "FIFA World Cup", "IPL"],
  global: ["World Expo", "UN Climate Summit"]
};




function getAllTrendingTopics() {
  return [
    ...new Set(
      Object.values(TOPIC_TRENDS).flat()
    )
  ];
}



let history = [
  {
    id: "iphone-17-launch",
    title: "iPhone 17 Launch",
    enabled: true, // toggle ON/OFF
    lastUpdated: "5 days ago",
    dates: [
      { date: "2026-09-08", label: "Launch" },
      { date: "2026-09-15", label: "Preorder" }
    ]
  }
];

let currentMonth = 5; // June (0-based)
let currentYear = 2026;
let selectedDate = null; // YYYY-MM-DD


const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];


function formatEventDate(dateStr) {
  const eventDate = new Date(dateStr);
  const today = new Date();

  // normalize times
  eventDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  const diffDays =
    (eventDate - today) / (1000 * 60 * 60 * 24);

  let relative;
  if (diffDays === 0) relative = "Today";
  else if (diffDays === 1) relative = "Tomorrow";
  else if (diffDays === -1) relative = "Yesterday";
  else {
    relative = eventDate.toLocaleDateString(undefined, {
      weekday: "short"
    });
  }

  const absolute = eventDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });

  return `${relative} · ${absolute}`;
}


function renderEventListForDay(dateKey) {
  eventList.innerHTML = "";

  const dayEvents = events.filter(e => e.date === dateKey);

  const date = new Date(dateKey);
  const header = document.createElement("div");
  header.style.marginTop = "21px";
  header.style.marginBottom = "21px";
  header.innerHTML = `
    <div style="font-weight:500">
      ${date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        weekday: "long"
      })}
    </div>
    <div class="event-time">${dayEvents.length} event${dayEvents.length !== 1 ? "s" : ""}</div>
  `;

  eventList.appendChild(header);

  if (dayEvents.length === 0) {
    eventList.innerHTML += `<div class="event-time">No events</div>`;
    return;
  }

  dayEvents.forEach(evt => {
    const div = document.createElement("div");
    div.className = "event-item";

    div.innerHTML = `
      <div class="event-dot" style="background:${evt.color}"></div>
      <div>
        <div>${evt.title}</div>
        <div class="event-time">${formatEventDate(evt.date)}</div>
      </div>
    `;

    eventList.appendChild(div);
  });
}



function generateCalendar(month, year) {
  calendarGrid.innerHTML = "";

  document.getElementById("monthLabel").textContent = monthNames[month];
  document.getElementById("yearLabel").textContent = year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // empty cells
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = day;

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // highlight selected day
    if (dateKey === selectedDate) {
      cell.classList.add("selected");
    }

    // render dots
    const dayEvents = events.filter(e => {
  return e.date === dateKey &&
    history.some(h =>
      h.enabled &&
      h.title === e.title
    );
});

    if (dayEvents.length > 0) {
  const dots = document.createElement("div");
  dots.className = "dots";

  const dot = document.createElement("span");
  dot.className = "dot";

  // 🎯 dynamic sizing
  const minSize = 6;
const maxSize = 12;
const step = 0.5;

const size = Math.min(
  minSize + dayEvents.length * step,
  maxSize
);

dot.style.width = `${size}px`;
dot.style.height = `${size}px`;
dot.style.opacity = Math.min(0.3 + dayEvents.length * 0.15, 0.9);



  dots.appendChild(dot);
  cell.appendChild(dots);
}


    // click = select day (desktop + mobile)
    cell.onclick = () => {
      selectedDate = dateKey;
      renderEventListForDay(dateKey);
      generateCalendar(currentMonth, currentYear);
    };

    calendarGrid.appendChild(cell);
  }
}


document.getElementById("prevMonth").onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
};

document.getElementById("nextMonth").onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
};
generateCalendar(currentMonth, currentYear);

// MOCK SEARCH → LLM OUTPUT
const trendingContainer = document.querySelector(".chips");

function renderTrending(topics) {
  trendingContainer.innerHTML = "";

  topics.forEach(topic => {
    const chip = document.createElement("span");
    chip.textContent = topic;
    chip.className = "trend-chip";

    chip.onclick = () => {
      searchInput.value = topic;
      searchInput.focus();

      // optional: auto-trigger search
      summary.classList.add("hidden");
    };

    trendingContainer.appendChild(chip);
  });
}

function renderSelectableDates(dates) {
  const container = document.getElementById("topicDates");
  container.innerHTML = "";

  dates.forEach(dateStr => {
    const label = document.createElement("label");
    label.className = "date-item";

    label.innerHTML = `
      <input type="checkbox" value="${dateStr}" checked />
      <span>${new Date(dateStr).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
      })}</span>
    `;

    container.appendChild(label);
  });
}


function runSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  topicTitle.textContent = query;
  topicSummary.textContent =
    "This is a clean AI-edited summary explaining what this topic is and why it matters in time.";

  const dates = ["2026-06-08", "2026-06-20"];
  renderSelectableDates(dates);

  document.getElementById("toggleAllDates").textContent = "Deselect all";
  summary.classList.remove("hidden");
}


searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    runSearch();
  }
});

document.getElementById("searchIcon").addEventListener("click", () => {
  runSearch();
});


// ADD TO CALENDAR
addBtn.addEventListener("click", () => {
  const selectedDates = [
    ...document.querySelectorAll("#topicDates input:checked")
  ].map(cb => cb.value);

  selectedDates.forEach(date => {
    events.push({
      title: topicTitle.textContent,
      date,
      color: "#111827"
    });
  });

  generateCalendar(currentMonth, currentYear);
  summary.classList.add("hidden");

  // add dot to random date (demo)
  const day = document.querySelectorAll(".day")[7];
  const dot = document.createElement("div");
  dot.className = "dot";
  day.appendChild(dot);

  renderHistory();
  renderEvents();

});


document.getElementById("toggleAllDates").onclick = function () {
  const checkboxes = document.querySelectorAll(
    "#topicDates input[type='checkbox']"
  );

  const allChecked = [...checkboxes].every(cb => cb.checked);

  checkboxes.forEach(cb => (cb.checked = !allChecked));

  this.textContent = allChecked ? "Select all" : "Deselect all";
};


function renderEvents() {
  eventList.innerHTML = "";

  history.forEach(item => {
    if (!item.visible) return;

    const div = document.createElement("div");
    div.className = "event-item";
    div.style.background = item.color;

    div.innerHTML = `
      <div class="event-dot" style="background:${item.color}"></div>
      <div>
        <div>${item.title}</div>
        <div class="event-time">${item.date}</div>
      </div>
    `;

    eventList.appendChild(div);
  });
}


// HISTORY RENDER
function renderHistory() {
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.className = "history-card";

    li.innerHTML = `
      <div class="history-header">
        <span class="history-title">${item.title}</span>

        <label class="switch">
          <input type="checkbox" ${item.enabled ? "checked" : ""} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="history-dates">
        ${item.dates.map(d => `
          <div class="history-date">
            <span>${d.label}</span>
            <small>${new Date(d.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</small>
          </div>
        `).join("")}
      </div>

      <div class="history-footer">
        <span class="history-updated">Updated ${item.lastUpdated}</span>

        <div class="history-actions">
          <button data-action="refresh">⟳</button>
          <button data-action="delete">🗑</button>
        </div>
      </div>
    `;

    historyList.appendChild(li);
  });
}

historyList.addEventListener("change", e => {
  if (e.target.type === "checkbox") {
    const index = [...historyList.children].indexOf(
      e.target.closest(".history-card")
    );
    history[index].enabled = e.target.checked;
    generateCalendar(currentMonth, currentYear);
  }
});

historyList.addEventListener("click", e => {
  const card = e.target.closest(".history-card");
  if (!card) return;

  const index = [...historyList.children].indexOf(card);

  // DELETE
  if (e.target.textContent === "🗑") {
    history.splice(index, 1);
    renderHistory();
    generateCalendar(currentMonth, currentYear);
  }

  // REFRESH
  if (e.target.textContent === "⟳") {
    history[index].lastUpdated = "Just now";
    renderHistory();
  }
});



// MOBILE VIEW SWITCHING
const mobileButtons = document.querySelectorAll(".mobile-nav button");
const sections = {
  calendar: document.querySelector(".calendar"),
  search: document.querySelector(".search"),
  history: document.querySelector(".history")
};

// default mobile view
sections.calendar.classList.add("active");

mobileButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    mobileButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    Object.values(sections).forEach(sec =>
      sec.classList.remove("active")
    );

    sections[btn.dataset.view].classList.add("active");
  });
});

// LIVE DATE & TIME (mobile top bar)
function updateMobileTime() {
  const now = new Date();
  const options = { weekday: "short", day: "numeric", month: "short" };
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  document.getElementById("mobileTime").textContent =
    `${now.toLocaleDateString(undefined, options)} · ${time}`;
}

updateMobileTime();
setInterval(updateMobileTime, 60000);

const monthPicker = document.getElementById("monthPicker");
const yearPicker = document.getElementById("yearPicker");

document.getElementById("monthLabel").onclick = () => {
  monthPicker.classList.toggle("hidden");
  yearPicker.classList.add("hidden");
};

monthPicker.querySelectorAll("span").forEach(m => {
  m.onclick = () => {
    currentMonth = +m.dataset.month;
    monthPicker.classList.add("hidden");
    generateCalendar(currentMonth, currentYear);
  };
});


let baseYear = currentYear;

function renderYearGrid() {
  const grid = document.getElementById("yearGrid");
  grid.innerHTML = "";

  const start = baseYear - 6;
  const end = baseYear + 5;

  document.getElementById("yearRange").textContent =
    `${start} – ${end}`;

  for (let y = start; y <= end; y++) {
    const span = document.createElement("span");
    span.textContent = y;
    span.onclick = () => {
      currentYear = y;
      yearPicker.classList.add("hidden");
      generateCalendar(currentMonth, currentYear);
    };
    grid.appendChild(span);
  }
}

document.getElementById("yearLabel").onclick = () => {
  renderYearGrid();
  yearPicker.classList.toggle("hidden");
  monthPicker.classList.add("hidden");
};

document.getElementById("prevYear").onclick = () => {
  baseYear -= 12;
  renderYearGrid();
};

document.getElementById("nextYear").onclick = () => {
  baseYear += 12;
  renderYearGrid();
};

document.getElementById("jumpToday").onclick = () => {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  yearPicker.classList.add("hidden");
  generateCalendar(currentMonth, currentYear);
};



document.querySelectorAll(".category-row button").forEach(btn => {
  btn.addEventListener("click", () => {
    const topic = btn.dataset.topic;

    // active state (optional but recommended)
    document.querySelectorAll(".category-row button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // filter Trending by category
    renderTrending(TOPIC_TRENDS[topic]);
  });
});


renderTrending(getAllTrendingTopics());

searchInput.addEventListener("focus", () => {
  document.querySelectorAll(".category-row button")
    .forEach(b => b.classList.remove("active"));

  renderTrending(getAllTrendingTopics());
});

renderHistory();



const historyDrawer = document.querySelector(".history");
const historyToggle = document.querySelector(".history-toggle");
const backdrop = document.querySelector(".history-backdrop");

// OPEN / CLOSE via hamburger
historyToggle.addEventListener("click", () => {
  const isOpen = historyDrawer.classList.contains("open");

  historyDrawer.classList.toggle("open", !isOpen);
  backdrop.classList.toggle("hidden", isOpen);
});

// CLOSE on backdrop click
backdrop.addEventListener("click", closeHistory);

// CLOSE on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeHistory();
});

// CLOSE helper
function closeHistory() {
  historyDrawer.classList.remove("open");
  backdrop.classList.add("hidden");
}

window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    closeHistory();
  }
});
