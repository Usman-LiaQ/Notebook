/**
 * Developer Workspace - Clean & Human Code Logic
 */

// Initial Realistic Mock Notes
const initialNotes = [
  {
    id: 1,
    title: "ESP32 Async WebServer Setup",
    category: "project",
    body: "Configured local DNS routing and asynchronous HTTP endpoints for real-time sensor updates.",
    date: "Today, 2:15 PM"
  },
  {
    id: 2,
    title: "MERN Stack State Management",
    category: "learning",
    body: "Optimized React state updates to prevent unnecessary re-renders in dynamic dashboard components.",
    date: "Yesterday"
  }
];

// App State
let notes = JSON.parse(localStorage.getItem("dev_notes")) || initialNotes;
let currentFilter = "all";

// --- Immediate Preloader Removal ---
function dismissPreloader() {
  const loader = document.getElementById("preloader");
  if (loader) {
    loader.classList.add("fade-out");
  }
}

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  renderFeed();
  setupEventListeners();
  
  // Fast and smooth exit
  setTimeout(dismissPreloader, 150);
});

// Render Notes Feed
function renderFeed() {
  const container = document.getElementById("feed-container");
  const totalBadge = document.getElementById("total-badge");
  const searchVal = document.getElementById("search-input").value.toLowerCase();

  if (!container) return;
  container.innerHTML = "";

  // Filtering
  let filtered = notes.filter(n => {
    const matchesFilter = currentFilter === "all" || n.category === currentFilter;
    const matchesSearch = n.title.toLowerCase().includes(searchVal) || n.body.toLowerCase().includes(searchVal);
    return matchesFilter && matchesSearch;
  });

  if (totalBadge) totalBadge.textContent = `${filtered.length} notes`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        No developer notes found.
      </div>`;
    return;
  }

  filtered.forEach(note => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <span class="card-title">${escapeHTML(note.title)}</span>
        <span class="card-tag">${note.category}</span>
      </div>
      <p class="card-body">${escapeHTML(note.body)}</p>
      <div class="card-footer">
        <span>${note.date}</span>
        <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Save to LocalStorage
function saveNotes() {
  localStorage.setItem("dev_notes", JSON.stringify(notes));
}

// Add Note Function
function addNote(title, category, body) {
  const newNote = {
    id: Date.now(),
    title,
    category,
    body,
    date: "Just now"
  };
  notes.unshift(newNote);
  saveNotes();
  renderFeed();
}

// Delete Note
window.deleteNote = function(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderFeed();
};

// Event Listeners
function setupEventListeners() {
  // Modal Elements
  const modal = document.getElementById("modal-backdrop");
  const openBtn = document.getElementById("open-new-post");
  const closeBtn = document.getElementById("close-modal");
  const form = document.getElementById("note-form");

  if (openBtn) openBtn.onclick = () => modal.classList.add("active");
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove("active");

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove("active");
    };
  }

  // Submit Form
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const title = document.getElementById("note-title").value;
      const category = document.getElementById("note-category").value;
      const body = document.getElementById("note-body").value;

      addNote(title, category, body);
      
      form.reset();
      modal.classList.remove("active");
    };
  }

  // Sidebar Filter Clicking
  document.querySelectorAll(".menu-section li").forEach(li => {
    li.onclick = () => {
      document.querySelectorAll(".menu-section li").forEach(item => item.classList.remove("active"));
      li.classList.add("active");
      currentFilter = li.dataset.filter;
      renderFeed();
    };
  });

  // Search Input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.oninput = () => renderFeed();
  }

  // Ping timer simulator
  setInterval(() => {
    const ping = Math.floor(Math.random() * 8) + 20;
    const pingEl = document.getElementById("ping-val");
    if (pingEl) pingEl.textContent = `${ping}ms`;
  }, 3000);
}

// Helper to escape HTML tags
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}