let program = [];

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

function displayTitle(value) {
  const title = String(value ?? "").trim();
  if (!title || title !== title.toUpperCase() || title === title.toLowerCase()) return title;
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
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
      if (event.abstract) {
        return `
          <details class="event-card detail-event" data-kind="${event.kind}">
            <summary>
              <span class="event-time">${escapeHtml(event.time)}</span>
              <span class="event-title">${escapeHtml(event.title)}</span>
              <span class="event-detail">${escapeHtml(event.detail)}</span>
              <span class="event-disclosure">${event.kind === "tutorial" ? "Tutorial details" : "Talk details"}</span>
            </summary>
            <div class="event-expanded-copy">
              ${event.talkTitle ? `<h4>${escapeHtml(event.talkTitle)}</h4>` : ""}
              ${event.presenters?.length ? `
                <div class="event-presenters">
                  <strong>${event.presenters.length === 1 ? "Presenter" : "Presenters"}</strong>
                  <ul>${event.presenters.map((presenter) => `<li>${escapeHtml(presenter)}</li>`).join("")}</ul>
                </div>
              ` : ""}
              <p>${escapeHtml(event.abstract)}</p>
            </div>
          </details>
        `;
      }
      if (event.chairs?.length) {
        return `
          <div class="event-card hosted-session" data-kind="${event.kind}">
            <button
              class="hosted-session-jump"
              type="button"
              data-session-jump="${event.sessionId}"
              aria-label="Show papers in ${escapeHtml(event.title)}"
            >
              <span class="event-time">${escapeHtml(event.time)}</span>
              <span class="event-title">${escapeHtml(event.title)}</span>
              <span class="event-detail">${escapeHtml(event.detail)}</span>
            </button>
            <div class="session-chairs">
              <strong>${event.chairs.length === 1 ? "Session chair" : "Session chairs"}</strong>
              ${event.chairs.map((chair) => `
                <span>
                  <a href="${escapeHtml(chair.profileUrl)}" target="_blank" rel="noreferrer">${escapeHtml(chair.name)}</a>
                  · ${escapeHtml(chair.affiliation)}
                </span>
              `).join("")}
            </div>
          </div>
        `;
      }
      const tag = event.sessionId ? "button" : "div";
      const attrs = event.sessionId
        ? `type="button" data-session-jump="${event.sessionId}" aria-label="Show papers in ${escapeHtml(event.title)}"`
        : "";
      return `
        <${tag} class="event-card" data-kind="${event.kind}" ${attrs}>
          <span class="event-time">${escapeHtml(event.time)}</span>
          <span class="event-title">${escapeHtml(event.title)}</span>
          ${event.detail ? `<span class="event-detail">${escapeHtml(event.detail)}</span>` : ""}
          ${event.talkTitle ? `<span class="event-talk-title">${escapeHtml(event.talkTitle)}</span>` : ""}
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
  return paper.authors.map((author) => author.profileUrl
    ? `<a href="${escapeHtml(author.profileUrl)}" target="_blank" rel="noreferrer">${highlight(author.name)}</a>`
    : `<span class="author-name">${highlight(author.name)}</span>`,
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
        <h3><a href="${escapeHtml(paper.openreviewUrl)}" target="_blank" rel="noreferrer">${highlight(displayTitle(paper.title))}</a></h3>
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
      const sortByOralTime = state.format === "oral" || state.session.startsWith("oral-");
      if (sortByOralTime) {
        return a.paper.oral.date.localeCompare(b.paper.oral.date)
          || a.paper.oral.start.localeCompare(b.paper.oral.start)
          || a.paper.oral.order - b.paper.oral.order
          || a.paper.title.localeCompare(b.paper.title);
      }
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
        <span class="quick-title">${highlight(displayTitle(paper.title))}</span>
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
function getJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return response.json();
  });
}

Promise.all([getJson("./data/program.json?v=20260924-program-json"), getJson("./data/papers.json?v=20260909-paper24-oral4")])
  .then(([programData, data]) => {
    program = programData.program;
    renderProgram();
    return data;
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
