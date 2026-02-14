const STORAGE_KEY = "bharatdarpan_posts_v1";

const defaultPosts = [
  { id: crypto.randomUUID(), title: "दिल्ली में प्रदूषण पर नई कार्ययोजना", summary: "सरकार ने AQI नियंत्रण के लिए 10-बिंदु योजना जारी की।", category: "national", author: "डेस्क", createdAt: "2026-02-14" },
  { id: crypto.randomUUID(), title: "भारत ने टेस्ट सीरीज 2-0 से जीती", summary: "स्पोर्ट्स डेस्क के अनुसार भारत की गेंदबाज़ी शानदार रही।", category: "sports", author: "स्पोर्ट्स टीम", createdAt: "2026-02-13" },
  { id: crypto.randomUUID(), title: "AI स्टार्टअप्स में निवेश बढ़ा", summary: "टेक सेक्टर में इस तिमाही रिकॉर्ड फंडिंग दर्ज हुई।", category: "tech", author: "बिज़नेस ब्यूरो", createdAt: "2026-02-12" },
];

function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
    return defaultPosts;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
    return defaultPosts;
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function renderPosts(container, posts) {
  if (!posts.length) {
    container.innerHTML = "<p>कोई खबर उपलब्ध नहीं है।</p>";
    return;
  }

  container.innerHTML = posts
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((post) => `
      <article class="article">
        <div class="meta">${categoryLabel(post.category)} • ${post.createdAt} • ${post.author}</div>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
      </article>
    `)
    .join("");
}

function categoryLabel(key) {
  const map = {
    home: "होम",
    national: "राष्ट्रीय",
    world: "अंतरराष्ट्रीय",
    sports: "खेल",
    entertainment: "मनोरंजन",
    tech: "टेक",
    religion: "धर्म",
    jobs: "जॉब्स",
  };
  return map[key] || key;
}

function initNewsPage(pageCategory = "home") {
  const posts = loadPosts();
  const list = document.getElementById("news-list");
  const searchInput = document.getElementById("search");

  const apply = () => {
    const q = (searchInput?.value || "").toLowerCase();
    const filtered = posts.filter((post) => {
      const inCategory = pageCategory === "home" ? true : post.category === pageCategory;
      const inQuery = [post.title, post.summary, post.author].join(" ").toLowerCase().includes(q);
      return inCategory && inQuery;
    });
    renderPosts(list, filtered);
  };

  if (searchInput) searchInput.addEventListener("input", apply);
  apply();
}

function initAdminPage() {
  const form = document.getElementById("news-form");
  const tbody = document.getElementById("admin-table");

  const refreshTable = () => {
    const posts = loadPosts().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    tbody.innerHTML = posts.map((post) => `
      <tr>
        <td>${post.createdAt}</td>
        <td>${post.title}</td>
        <td>${categoryLabel(post.category)}</td>
        <td>${post.author}</td>
        <td><button class="btn delete-btn" data-id="${post.id}">Delete</button></td>
      </tr>
    `).join("");

    tbody.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const updated = loadPosts().filter((post) => post.id !== btn.dataset.id);
        savePosts(updated);
        refreshTable();
      });
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const post = {
      id: crypto.randomUUID(),
      title: data.get("title")?.toString().trim(),
      summary: data.get("summary")?.toString().trim(),
      category: data.get("category")?.toString(),
      author: data.get("author")?.toString().trim() || "Admin",
      createdAt: data.get("createdAt")?.toString() || new Date().toISOString().slice(0, 10),
    };

    if (!post.title || !post.summary) return;
    const posts = loadPosts();
    posts.push(post);
    savePosts(posts);
    form.reset();
    refreshTable();
  });

  refreshTable();
}
