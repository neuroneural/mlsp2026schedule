const program = [
  {
    day: "Monday",
    dateLabel: "SEP 28",
    date: "2026-09-28",
    events: [
      { time: "7:30 AM", title: "Registration", kind: "registration" },
      {
        time: "8:00–9:30 AM",
        title: "Tutorial 1",
        detail: "Continuous Evaluation and Monitoring of Foundation Models: Streaming, Knowledge-Graph, and Benchmarking Methods for LLMs, and Agentic AI",
        kind: "tutorial",
        presenters: [
          "Kishor Datta Gupta, Ph.D. · Clark Atlanta University",
          "Mohd Ariful Haque, MS · Atlanta University Center Consortium",
        ],
        abstract: "Learn how to treat foundation-model outputs as time-indexed signals and detect hallucination, semantic drift, biased framing, and grounding failures through structured representations, adaptive thresholds, and anomaly detection. The tutorial moves beyond one-time leaderboards toward practical monitoring of LLMs, VLMs, RAG systems, and tool-using agents while models, prompts, retrieval corpora, safeguards, and the external world change.",
      },
      { time: "9:30–10:00 AM", title: "Coffee Break", kind: "break" },
      {
        time: "10:00–11:30 AM",
        title: "Tutorial 2 · Session 1",
        detail: "Recent Advances in the Application of AI and Machine Learning to Medical Video Analysis Systems",
        kind: "tutorial",
        presenters: ["Marios S. Pattichis, Ph.D. · University of New Mexico"],
        abstract: "An introduction to the evolution of AI models and datasets for medical video analysis, with emphasis on video representations, modern architectures, and self- and semi-supervised approaches for small ground-truth datasets. The session connects these foundations to generative and foundation models for multimodal medical imaging.",
      },
      { time: "11:30–11:45 AM", title: "Coffee Break", kind: "break" },
      {
        time: "11:45 AM–1:00 PM",
        title: "Tutorial 2 · Session 2",
        detail: "Recent Advances in the Application of AI and Machine Learning to Medical Video Analysis Systems",
        kind: "tutorial",
        presenters: ["Marios S. Pattichis, Ph.D. · University of New Mexico"],
        abstract: "A hands-on continuation with browser-based Google Colab demos. Attendees will work through concepts behind video Q&A, adversarial attacks and training, autoencoders, GANs, diffusion models, BiomedGPT, and where to find medical imaging and multimodal models and datasets.",
      },
      { time: "1:00–2:00 PM", title: "Lunch Break", kind: "break" },
      {
        time: "2:00–3:15 PM",
        title: "Tutorial 3 · Session 1",
        detail: "Low-Rank Adaptation Redux in Large Models",
        kind: "tutorial",
        presenters: [
          "Bingcong Li, Ph.D. · ETH Zurich",
          "Yilang Zhang, Ph.D. · Morgan Stanley",
          "Georgios B. Giannakis, Ph.D. · University of Minnesota",
        ],
        abstract: "Large-model scale drives performance but makes task-specific adaptation costly. This tutorial connects classical signal-processing tools for low-rank modeling with LoRA-based fine-tuning, showing how low-dimensional update structure can reduce memory and compute.",
      },
      { time: "3:15–3:45 PM", title: "Coffee Break", kind: "break" },
      {
        time: "3:45–5:30 PM",
        title: "Tutorial 3 · Session 2",
        detail: "Low-Rank Adaptation Redux in Large Models",
        kind: "tutorial",
        presenters: [
          "Bingcong Li, Ph.D. · ETH Zurich",
          "Yilang Zhang, Ph.D. · Morgan Stanley",
          "Georgios B. Giannakis, Ph.D. · University of Minnesota",
        ],
        abstract: "A continuation of the low-rank adaptation framework, aimed at building a systematic understanding of fine-tuning methods with stronger expressiveness, effectiveness, and applicability. The session highlights how signal-processing insights can support more principled and broadly deployable LLM adaptation.",
      },
      {
        time: "5:30–6:00 PM",
        title: "Special Keynote",
        detail: "Tülay Adalı",
        kind: "keynote",
        talkTitle: "From Latent Structure to Reliable Conclusions: Interpretable Data Fusion and Fair Comparisons",
      },
      { time: "6:00–9:00 PM", title: "Opening + Welcome Reception", kind: "social" },
    ],
  },
  {
    day: "Tuesday",
    dateLabel: "SEP 29",
    date: "2026-09-29",
    events: [
      { time: "8:00 AM", title: "Registration", kind: "registration" },
      {
        time: "9:00–10:00 AM",
        title: "Keynote 1",
        detail: "Dr. Chen Chen · Foundation",
        kind: "keynote",
        talkTitle: "Reinforcement learning for visual generation",
        abstract: "Visual generative models have advanced rapidly, yet aligning their outputs with precise conditions and human preferences remains challenging. This talk examines reinforcement learning for visual generation through three interconnected perspectives: reward design, reward rectification, and reward-data scaling. First, I will show how task-specific visual reward models and consistency feedback can provide explicit, efficient supervision for controllable image generation. Next, I will discuss how noisy or misaligned supervision can be rectified and strengthened through vision-language reasoning and contrastive signals, substantially improving instruction-based image editing. Finally, I will present a scalable framework for visual preference optimization that combines robust learning objectives with large, diverse, and carefully curated preference data for both image and video generation. Together, these studies highlight a central principle: effective reinforcement learning for visual generation depends not only on the optimization algorithm, but also on how reward signals are designed, corrected, and scaled.",
      },
      { time: "10:00–10:30 AM", title: "Coffee Break", kind: "break" },
      { time: "10:30 AM–12:00 PM", title: "Oral Session 1", detail: "Foundation & Generative Models for Signals", kind: "oral", sessionId: "oral-1" },
      { time: "12:00–1:00 PM", title: "Lunch Break", kind: "break" },
      {
        time: "1:00–2:00 PM",
        title: "Keynote 2",
        detail: "Dr. Anand Sarwate · Federated",
        kind: "keynote",
        talkTitle: "Differential privacy: from statistical decisions to application challenges",
        abstract: "Differential privacy is now 20 years old and has become the \"gold standard\" for certain scenarios. At the same time, many people in machine learning and signal processing are less familiar with it. This talk will show how differential privacy connects to basic detection theory and the challenges that arise when trying to apply it to standard signal processing and machine learning scenarios.",
      },
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
      { time: "8:00 AM", title: "Registration", kind: "registration" },
      {
        time: "9:00–10:00 AM",
        title: "Keynote 3",
        detail: "Dr. Justin Romberg · Temporal",
        kind: "keynote",
        talkTitle: "Dimensionality reduction for sensor arrays",
        abstract: "Next-generation RF arrays will have the ability to generate data at tremendous rates. In this talk we will discuss how these massive data streams can be managed using dimensionality reduction at the array. By adopting and expanding upon ideas from machine learning (including kernel regression, online PCA algorithms, and manifold optimization) and harmonic analysis, we develop a framework that is both \"hardware friendly\" and has a strong theoretical foundation.",
      },
      { time: "10:00–10:30 AM", title: "Coffee Break", kind: "break" },
      { time: "10:30 AM–12:00 PM", title: "Oral Session 3", detail: "Temporal & Sequential Signal Learning", kind: "oral", sessionId: "oral-3" },
      { time: "12:00–1:00 PM", title: "Lunch Break", kind: "break" },
      {
        time: "1:00–2:00 PM",
        title: "Keynote 4",
        detail: "Dr. Chethan Pandarinath · Neuroimaging",
        kind: "keynote",
        talkTitle: "Interpreting computational mechanisms from multi-area brain recordings",
        abstract: "Understanding how the brain subdivides into modular computational primitives requires disentangling one area's intrinsic dynamics from inter-area communication, yet existing models struggle with interpretable and hallucination-free inference of dynamics. We introduce DynISys, a multi-compartment latent dynamical systems model combining Neural ODEs and injective normalizing flows to achieve expressive, trustworthy, and interpretable inference directly from recordings of multi-region neural activity. Applied to motor cortex during reaching, DynISys uncovers how inter-area communication mechanically modulates fixed-point landscapes to drive motor preparation—offering an interpretable computational framework for interrogating distributed neural processing.",
      },
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
      { time: "8:00 AM", title: "Registration", kind: "registration" },
      {
        time: "9:00–10:00 AM",
        title: "Keynote 5",
        detail: "Dr. Mohit Bansal · Agentic",
        kind: "keynote",
        talkTitle: "Trustworthy Planning Agents for Collaborative Reasoning and Multimodal Generation",
        abstract: "In this talk, I will present our journey of developing trustworthy and adaptive AI planning agents that can reliably communicate and collaborate for uncertainty-calibrated reasoning (across diverse domains, such as math, commonsense, coding and tool-use) and for interpretable, controllable multimodal generation (across diverse modalities such as text, images, videos, audio, layouts, etc.). In the first part, we will discuss: (1) how to teach agents to be trustworthy and reliable collaborators via social/pragmatic multi-agent interactions (e.g., confidence calibration via speaker-listener reasoning and learning to balance positive and negative persuasion), as well as (2) how to acquire and improve agent skills needed for efficient and robust perception and action (e.g., learning reusable, verified abstractions over actions & code, and adaptive data generation based on discovered weak skills). In the second part, we will discuss interpretable and controllable multimodal generation via LLM-agents based planning and programming, such as (1) layout-controllable image generation and evaluation via visual programming, (2) consistent video generation via LLM-guided multi-scene planning, targeted corrections, and retrieval-augmented motion adaptation, and (3) interactive, composable any-to-any multimodal generations. We will conclude with examples of improving real-world applications such as medical data reasoning and classroom education engagement.",
      },
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
renderProgram();

fetch("./data/papers.json?v=20260825-authors")
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
