const program = [
  {
    day: "Monday",
    dateLabel: "SEP 28",
    date: "2026-09-28",
    events: [
      { time: "Daytime", title: "Tutorial Day", detail: "Schedule to be finalized", kind: "tutorial" },
      { time: "5:30–6:00 PM", title: "Special Keynote", detail: "Tülay Adalı", kind: "keynote" },
      { time: "6:00–9:00 PM", title: "Opening + Welcome Reception", kind: "social" },
    ],
  },
  {
    day: "Tuesday",
    dateLabel: "SEP 29",
    date: "2026-09-29",
    events: [
      { time: "8:00–9:00 AM", title: "Registration", kind: "registration" },
      { time: "9:00–10:00 AM", title: "Keynote 1", detail: "Dr. Chen Chen · Foundation", kind: "keynote" },
      { time: "10:00–10:30 AM", title: "Coffee Break", kind: "break" },
      { time: "10:30 AM–12:00 PM", title: "Oral Session 1", detail: "Foundation & Generative Models for Signals", kind: "oral", sessionId: "oral-1" },
      { time: "12:00–1:00 PM", title: "Lunch Break", kind: "break" },
      { time: "1:00–2:00 PM", title: "Keynote 2", detail: "Dr. Anand Sarwate · Federated", kind: "keynote" },
      { time: "2:00–3:30 PM", title: "Oral Session 2", detail: "Responsible, Causal & Federated Signal Intelligence", kind: "oral", sessionId: "oral-2" },
      { time: "3:30–4:00 PM", title: "Coffee Break", kind: "break" },
      { time: "4:00–6:00 PM", title: "Poster Session 1 + Special Session 1", kind: "poster", sessionId: "poster-1" },
      { time: "6:00–9:00 PM", title: "Social Event", kind: "social" },
    ],
  },
  {
    day: "Wednesday",
    dateLabel: "SEP 30",
    date: "2026-09-30",
    events: [
      { time: "8:00–9:00 AM", title: "Registration", kind: "registration" },
      { time: "9:00–10:00 AM", title: "Keynote 3", detail: "Dr. Justin Romberg · Temporal", kind: "keynote" },
      { time: "10:00–10:30 AM", title: "Coffee Break", kind: "break" },
      { time: "10:30 AM–12:00 PM", title: "Oral Session 3", detail: "Temporal & Sequential Signal Learning", kind: "oral", sessionId: "oral-3" },
      { time: "12:00–1:00 PM", title: "Lunch Break", kind: "break" },
      { time: "1:00–2:00 PM", title: "Keynote 4", detail: "Dr. Chethan Pandarinath · Neuroimaging", kind: "keynote" },
      { time: "2:00–3:30 PM", title: "Oral Session 4", detail: "ML for Neuroimaging, Neuroscience and Beyond", kind: "oral", sessionId: "oral-4" },
      { time: "3:30–4:00 PM", title: "Coffee Break", kind: "break" },
      { time: "4:00–6:00 PM", title: "Poster Session 2 + Special Session 2", kind: "poster", sessionId: "poster-2" },
      { time: "6:00–9:00 PM", title: "Banquet Dinner at the Aquarium", kind: "social" },
    ],
  },
  {
    day: "Thursday",
    dateLabel: "OCT 1",
    date: "2026-10-01",
    events: [
      { time: "8:00–9:00 AM", title: "Registration", kind: "registration" },
      { time: "9:00–10:00 AM", title: "Keynote 5", detail: "Dr. Mohit Bansal · Agentic", kind: "keynote" },
      { time: "10:00–10:30 AM", title: "Coffee Break", kind: "break" },
      { time: "10:30 AM–12:00 PM", title: "Oral Session 5", detail: "Agentic & Multimodal Learning", kind: "oral", sessionId: "oral-5" },
      { time: "12:00–1:00 PM", title: "Lunch Break", kind: "break" },
      { time: "1:00–3:00 PM", title: "Poster Session 3", kind: "poster", sessionId: "poster-3" },
      { time: "3:00–3:30 PM", title: "Closing Remarks", kind: "closing" },
      { time: "After 3:30 PM", title: "Conference Adjourns", kind: "closing" },
    ],
  },
];

const state = {
  papers: [],
  query: "",
  day: "all",
  format: "all",
  session: "all",
};

const searchInput = document.querySelector("#schedule-search");
const programGrid = document.querySelector("#program-grid");
const results = document.querySelector("#paper-results");
const resultsSummary = document.querySelector("#results-summary");
const clearButton = document.querySelector("#clear-filters");
const searchPreview = document.querySelector("#search-preview");

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function queryTokens() {
  return [...new Set(normalize(state.query).split(" ").filter(Boolean))];
}

function highlight(value) {
  const raw = String(value ?? "");
  const tokens = queryTokens().filter((token) => token.length > 1);
  if (!tokens.length) return escapeHtml(raw);
  const pattern = new RegExp(`(${tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return escapeHtml(raw).replace(pattern, "<mark>$1</mark>");
}

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function paperSearchText(paper) {
  return normalize([
    paper.title,
    paper.authors.map((author) => author.name).join(" "),
    paper.theme,
    paper.abstract,
    paper.submissionNumber,
    paper.poster.label,
    paper.oral?.label,
    paper.oral?.order ? `oral order ${paper.oral.order}` : "",
  ].join(" "));
}

function paperScore(paper) {
  const tokens = queryTokens();
  if (!tokens.length) return 0;
  const fields = [
    [normalize(paper.title), 10],
    [normalize(paper.authors.map((author) => author.name).join(" ")), 9],
    [normalize(paper.submissionNumber), 8],
    [normalize(paper.theme), 5],
    [normalize(`${paper.poster.label} ${paper.oral?.label ?? ""}`), 5],
    [normalize(paper.abstract), 1],
  ];
  let score = 0;
  for (const token of tokens) {
    if (/^\d$/.test(token)) {
      const sessionWords = normalize(`${paper.poster.label} ${paper.oral?.label ?? ""}`).split(" ");
      if (!sessionWords.includes(token)) return -1;
      score += 7;
      continue;
    }
    let tokenScore = 0;
    for (const [field, weight] of fields) {
      if (field.includes(token)) tokenScore = Math.max(tokenScore, weight + (field.startsWith(token) ? 2 : 0));
    }
    if (!tokenScore) return -1;
    score += tokenScore;
  }
  const phrase = normalize(state.query);
  if (phrase.length > 2 && paperSearchText(paper).includes(phrase)) score += 12;
  return score;
}

function renderProgram() {
  programGrid.innerHTML = program.map((day) => {
    const events = day.events.map((event) => {
      const tag = event.sessionId ? "button" : "div";
      const attrs = event.sessionId
        ? `type="button" data-session-jump="${event.sessionId}" aria-label="Show papers in ${escapeHtml(event.title)}"`
        : "";
      return `
        <${tag} class="event-card" data-kind="${event.kind}" ${attrs}>
          <span class="event-time">${escapeHtml(event.time)}</span>
          <span class="event-title">${escapeHtml(event.title)}</span>
          ${event.detail ? `<span class="event-detail">${escapeHtml(event.detail)}</span>` : ""}
        </${tag}>
      `;
    }).join("");
    return `
      <article class="day-column">
        <div class="day-heading"><h3>${day.day}</h3><span>${day.dateLabel}</span></div>
        <div class="day-events">${events}</div>
      </article>
    `;
  }).join("");

  programGrid.querySelectorAll("[data-session-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.session = button.dataset.sessionJump;
      updatePressedState("#session-filters", "session", state.session);
      renderPapers();
      document.querySelector("#paper-explorer").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function authorMarkup(paper) {
  if (!paper.authors.length) {
    return `<span class="authors-missing">Author list available on OpenReview</span>`;
  }
  return paper.authors.map((author) =>
    `<a href="${escapeHtml(author.profileUrl)}" target="_blank" rel="noreferrer">${highlight(author.name)}</a>`,
  ).join(", ");
}

function paperMarkup(paper) {
  const posterLine = `${formatDate(paper.poster.date)} · ${formatTime(paper.poster.start)}–${formatTime(paper.poster.end)} · ${paper.poster.label}`;
  const oralLine = paper.oral
    ? `${formatDate(paper.oral.date)} · ${formatTime(paper.oral.start)}–${formatTime(paper.oral.end)} · ${paper.oral.label} · Talk ${paper.oral.order}`
    : "";
  return `
    <article class="paper-card ${paper.oral ? "has-oral" : "poster-only"}" id="${paper.id}">
      <div class="paper-meta">
        <span class="paper-number">Paper ${paper.submissionNumber}</span>
        <span class="format-tag ${paper.oral ? "" : "poster"}">${paper.oral ? "Oral + poster" : "Poster"}</span>
      </div>
      <div class="paper-main">
        <h3><a href="${escapeHtml(paper.openreviewUrl)}" target="_blank" rel="noreferrer">${highlight(paper.title)}</a></h3>
        <p class="authors">${authorMarkup(paper)}</p>
        <p class="theme">${highlight(paper.theme)}</p>
        <details>
          <summary>Read abstract</summary>
          <p>${highlight(paper.abstract)}</p>
        </details>
      </div>
      <div class="schedule-block">
        ${oralLine ? `<div class="schedule-row"><strong>Oral</strong><span>${highlight(oralLine)}</span></div>` : ""}
        <div class="schedule-row"><strong>Poster</strong><span>${highlight(posterLine)}</span></div>
      </div>
    </article>
  `;
}

function rankedPapers() {
  return state.papers
    .map((paper) => ({ paper, score: paperScore(paper) }))
    .filter(({ paper, score }) => {
      if (score < 0) return false;
      if (state.day !== "all" && paper.poster.date !== state.day && paper.oral?.date !== state.day) return false;
      if (state.format === "oral" && !paper.oral) return false;
      if (state.format === "poster-only" && paper.oral) return false;
      if (state.session !== "all" && paper.poster.id !== state.session && paper.oral?.id !== state.session) return false;
      return true;
    })
    .sort((a, b) => {
      if (state.query && b.score !== a.score) return b.score - a.score;
      return a.paper.poster.date.localeCompare(b.paper.poster.date)
        || a.paper.poster.id.localeCompare(b.paper.poster.id)
        || a.paper.theme.localeCompare(b.paper.theme)
        || a.paper.title.localeCompare(b.paper.title);
    });
}

function quickSchedule(paper) {
  if (paper.oral) {
    return `Oral · ${formatDate(paper.oral.date)}, ${formatTime(paper.oral.start)} · ${paper.oral.label}`;
  }
  return `Poster · ${formatDate(paper.poster.date)}, ${formatTime(paper.poster.start)} · ${paper.poster.label}`;
}

function renderSearchPreview(ranked) {
  const searching = Boolean(state.query);
  document.body.classList.toggle("has-query", searching);
  searchPreview.hidden = !searching;
  if (!searching) {
    searchPreview.innerHTML = "";
    return;
  }

  const label = ranked.length === 1 ? "match" : "matches";
  if (!ranked.length) {
    searchPreview.innerHTML = `
      <div class="quick-summary"><strong>No matches</strong><button type="button" data-clear-search>Clear</button></div>
      <p class="quick-empty">Try fewer words, another spelling, or a session number.</p>
    `;
  } else {
    const firstMatches = ranked.slice(0, 4).map(({ paper }) => `
      <a class="quick-result" href="#${paper.id}">
        <span class="quick-title">${highlight(paper.title)}</span>
        <span class="quick-time">${highlight(quickSchedule(paper))}</span>
      </a>
    `).join("");
    searchPreview.innerHTML = `
      <div class="quick-summary">
        <strong>${ranked.length} ${label}</strong>
        <button type="button" data-clear-search>Clear</button>
      </div>
      <div class="quick-results">${firstMatches}</div>
      ${ranked.length > 4 ? `<a class="quick-all" href="#paper-explorer">View all ${ranked.length} results ↓</a>` : ""}
    `;
  }

  searchPreview.querySelector("[data-clear-search]")?.addEventListener("click", () => {
    state.query = "";
    searchInput.value = "";
    renderPapers();
    searchInput.focus();
  });
}

function renderPapers() {
  const ranked = rankedPapers();
  renderSearchPreview(ranked);

  const active = Boolean(state.query || state.day !== "all" || state.format !== "all" || state.session !== "all");
  clearButton.hidden = !active;
  const label = ranked.length === 1 ? "paper" : "papers";
  resultsSummary.textContent = `${ranked.length} ${label}${state.query ? ` matching “${state.query}”` : ""}`;
  results.innerHTML = ranked.length
    ? ranked.map(({ paper }) => paperMarkup(paper)).join("")
    : `<div class="empty-state"><h3>No matching papers</h3><p>Try fewer words, another spelling, or clear one of the filters.</p></div>`;
  results.setAttribute("aria-busy", "false");
}

function sessionLabel(id) {
  const event = program.flatMap((day) => day.events).find((item) => item.sessionId === id);
  return event?.title ?? id;
}

function renderSessionFilters() {
  const ids = [...new Set(state.papers.flatMap((paper) => [paper.poster.id, paper.oral?.id]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  document.querySelector("#session-filters").innerHTML = [
    `<button class="chip is-active" type="button" data-session="all" aria-pressed="true">All sessions</button>`,
    ...ids.map((id) => `<button class="chip" type="button" data-session="${id}" aria-pressed="false">${sessionLabel(id)}</button>`),
  ].join("");
  bindFilterGroup("#session-filters", "session");
}

function updatePressedState(selector, key, value) {
  document.querySelectorAll(`${selector} [data-${key}]`).forEach((button) => {
    const selected = button.dataset[key] === value;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function bindFilterGroup(selector, key) {
  document.querySelectorAll(`${selector} [data-${key}]`).forEach((button) => {
    button.addEventListener("click", () => {
      state[key] = button.dataset[key];
      updatePressedState(selector, key, state[key]);
      renderPapers();
    });
  });
}

function clearAll() {
  state.query = "";
  state.day = "all";
  state.format = "all";
  state.session = "all";
  searchInput.value = "";
  updatePressedState("#day-filters", "day", "all");
  updatePressedState("#format-filters", "format", "all");
  updatePressedState("#session-filters", "session", "all");
  renderPapers();
}

searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim();
  renderPapers();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    state.query = "";
    renderPapers();
  }
});

clearButton.addEventListener("click", clearAll);
bindFilterGroup("#day-filters", "day");
bindFilterGroup("#format-filters", "format");
renderProgram();

fetch("./data/papers.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Schedule data returned ${response.status}`);
    return response.json();
  })
  .then((data) => {
    state.papers = data.papers;
    document.querySelector("#paper-total").textContent = data.paperCount;
    document.querySelector("#oral-total").textContent = data.papers.filter((paper) => paper.oral).length;
    renderSessionFilters();
    renderPapers();
  })
  .catch((error) => {
    console.error(error);
    results.setAttribute("aria-busy", "false");
    resultsSummary.textContent = "Schedule unavailable";
    results.innerHTML = `<div class="load-error"><h3>The schedule data did not load</h3><p>Reload the page. If the problem continues, the data file may be temporarily unavailable.</p></div>`;
  });
