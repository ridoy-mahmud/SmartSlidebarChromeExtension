export const manifestJson = `{
  "manifest_version": 3,
  "name": "Smart Sidebar",
  "version": "1.0",
  "description": "Unlimited shortcuts side panel for Chrome",
  "permissions": ["sidePanel", "storage", "tabs"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  },
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["icon48.png"],
      "matches": ["<all_urls>"]
    }
  ],
  "action": {
    "default_title": "Open Smart Sidebar"
  },
  "icons": {
    "48": "icon48.png"
  }
}`;

export const backgroundJs = `chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'open_side_panel' && sender.tab) {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
  }
});
`;

export const contentJs = `// Injected floating button
const injectFloatingButton = () => {
  if (document.getElementById('smart-sidebar-floating-btn')) return;

  const btn = document.createElement('div');
  btn.id = 'smart-sidebar-floating-btn';
  
  // Create shadow root for isolation
  const shadow = btn.attachShadow({ mode: 'closed' });
  
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'fixed',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '48px',
    backgroundColor: '#0d0518',
    border: '1px solid rgba(167, 139, 250, 0.4)',
    borderRight: 'none',
    borderRadius: '12px 0 0 12px',
    boxShadow: '-4px 4px 16px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '6px',
    cursor: 'pointer',
    zIndex: '2147483647',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden'
  });

  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('icon48.png');
  Object.assign(img.style, {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    transition: 'transform 0.2s'
  });

  wrapper.appendChild(img);
  shadow.appendChild(wrapper);

  // Hover effects
  wrapper.addEventListener('mouseenter', () => {
    wrapper.style.width = '42px';
    wrapper.style.backgroundColor = '#1a0b2e';
    wrapper.style.paddingLeft = '10px';
    img.style.transform = 'scale(1.1)';
  });
  
  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.width = '32px';
    wrapper.style.backgroundColor = '#0d0518';
    wrapper.style.paddingLeft = '6px';
    img.style.transform = 'scale(1)';
  });

  // Click to open
  wrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    try {
      chrome.runtime.sendMessage({ action: 'open_side_panel' });
    } catch(err) {
      console.log('Error opening side panel:', err);
    }
  });

  document.body.appendChild(btn);
  return wrapper;
};

injectFloatingButton();

document.addEventListener('mousedown', (e) => {
  // Only send if it's a left click
  if (e.button === 0) {
    const isFloatingBtn = e.target.id === 'smart-sidebar-floating-btn';
    if (!isFloatingBtn) {
      try {
        chrome.runtime.sendMessage({ action: 'close_sidepanel' });
      } catch(err) {
        // Ignored: extension context invalidated or panel closed
      }
    }
  }
});
`;



export const sidepanelHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Sidebar</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="header">
    <div class="time" id="time-display">00:00</div>
    <div class="date" id="date-display">Monday, 1</div>
  </div>

  <div class="toolbar">
    <span class="toolbar-title">Shortcuts</span>
  </div>

  <div class="grid-container" id="shortcut-grid">
    <!-- Shortcuts injected via JS -->
  </div>

  <button class="add-button" id="add-btn" title="Add Shortcut">+</button>

  <!-- Add/Edit Modal -->
  <div class="modal-overlay" id="modal" style="display: none;">
    <div class="modal-content">
      <h3 id="modal-title">Add Shortcut</h3>
      <input type="text" id="name-input" placeholder="Name (max 10 chars)" maxlength="10">
      <input type="url" id="url-input" placeholder="URL (e.g. google.com)">
      <div class="modal-actions">
        <button id="cancel-btn">Cancel</button>
        <button id="save-btn" class="primary">Save</button>
      </div>
    </div>
  </div>

  <!-- Context Menu -->
  <div class="context-menu" id="context-menu" style="display: none;">
    <div class="menu-item" id="edit-item">Edit</div>
    <div class="menu-item delete" id="delete-item">Delete</div>
  </div>

  <script src="sidepanel.js"></script>
</body>
</html>
`;

export const stylesCss = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --bg-color: #0d0518;
  --text-main: #f8fafc;
  --text-muted: #a78bfa;
  --text-sub: #cbd5e1;
  --accent-color: #c4a8ff;
  --surface-color: rgba(255, 255, 255, 0.03);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(167, 139, 250, 0.3);
  --danger-color: #ff7eb6;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  font-family: 'Poppins', -apple-system, sans-serif;
  background-color: var(--bg-color);
  background-image: 
    radial-gradient(circle at 10% 0%, rgba(59, 21, 107, 0.6) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(32, 11, 59, 0.8) 0%, transparent 50%);
  background-attachment: fixed;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(167, 139, 250, 0.3); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(167, 139, 250, 0.5); }

.header {
  padding: 10px 14px 6px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-direction: row-reverse;
  position: relative;
  flex-shrink: 0;
}

.header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 1px;
  background: linear-gradient(to right, var(--accent-color), transparent);
  opacity: 0.2;
}

.time { font-size: 12px; font-weight: 400; color: var(--text-muted); }
.date { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); letter-spacing: -0.2px; }

.toolbar { padding: 8px 14px 0px; display: flex; align-items: center; }
.toolbar-title { font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(167, 139, 250, 0.6); font-weight: 600; }

.grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  align-content: flex-start;
  padding-bottom: 80px;
}

.shortcut-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-top: 1px solid rgba(255,255,255,0.12);
  border-left: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  text-decoration: none;
  color: var(--text-sub);
  user-select: none;
  aspect-ratio: 1 / 1;
}

.shortcut-card:hover {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0.05) 100%);
  border-color: var(--border-hover);
  box-shadow: 0 8px 24px rgba(167, 139, 250, 0.2);
  transform: translateY(-2px) scale(1.02);
}

.shortcut-card:active {
  transform: scale(0.96);
}

.icon-wrapper {
  width: 42px;
  height: 42px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
  transition: transform 0.3s;
}

.shortcut-card:hover .icon-wrapper {
  transform: scale(1.05);
}

.shortcut-icon { width: 100%; height: 100%; object-fit: contain; }

.shortcut-name {
  font-size: 9px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
}

.menu-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  line-height: 1;
  padding-bottom: 6px;
}

.shortcut-card:hover .menu-btn { opacity: 1; }
.menu-btn:hover, .menu-btn.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.add-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
  color: #fff;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(167, 139, 250, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.add-button:hover {
  transform: scale(1.08) rotate(90deg);
  box-shadow: 0 6px 20px rgba(167, 139, 250, 0.6);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  animation: fadeIn 0.2s forwards;
}

.modal-content {
  background: linear-gradient(135deg, rgba(32, 11, 59, 0.95), rgba(13, 5, 24, 0.98));
  border: 1px solid var(--border-hover);
  border-radius: 16px;
  padding: 20px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(167, 139, 250, 0.1);
  transform: translateY(10px);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-content h3 { margin: 0; font-size: 15px; color: #fff; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

.modal-content input {
  background-color: rgba(0,0,0,0.3);
  border: 1px solid var(--border-color);
  color: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
}

.modal-content input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.modal-actions button {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: var(--text-muted);
  font-family: inherit;
  transition: all 0.2s;
}

.modal-actions button:hover {
  background-color: rgba(255,255,255,0.1);
  color: #fff;
}

.modal-actions button.primary {
  background: var(--accent-color);
  color: #1a0b2e;
  font-weight: 600;
}

.modal-actions button.primary:hover {
  background: #d4c1ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.4);
}

/* Context Menu */
.context-menu {
  position: absolute;
  background: rgba(32, 11, 59, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-hover);
  border-radius: 10px;
  padding: 4px;
  min-width: 120px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  z-index: 50;
  transform-origin: top right;
  animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.menu-item {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #fff;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item:hover { background-color: rgba(255,255,255,0.1); }
.menu-item.delete { color: var(--danger-color); }
.menu-item.delete:hover { background-color: rgba(243, 139, 168, 0.15); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`;

export const sidepanelJs = `document.addEventListener('DOMContentLoaded', () => {
  // Listen for clicks outside (from content.js) to close panel
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'close_sidepanel') {
      window.close();
    }
  });

  const timeDisplay = document.getElementById('time-display');
  const dateDisplay = document.getElementById('date-display');
  const grid = document.getElementById('shortcut-grid');
  const addBtn = document.getElementById('add-btn');
  
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const nameInput = document.getElementById('name-input');
  const urlInput = document.getElementById('url-input');
  const cancelBtn = document.getElementById('cancel-btn');
  const saveBtn = document.getElementById('save-btn');
  
  const contextMenu = document.getElementById('context-menu');
  const editItem = document.getElementById('edit-item');
  const deleteItem = document.getElementById('delete-item');

  let shortcuts = [];
  let editingId = null;
  let activeContextId = null;

  // Let the window blur close it (only works if used as a popup, but added for completeness)
  window.addEventListener('blur', () => {
    // If it's a popup, this will close it. Chrome sidepanels ignore it.
    // window.close(); 
  });

  const defaultShortcuts = [
    { id: '1', name: 'Google', url: 'https://google.com' },
    { id: '2', name: 'YouTube', url: 'https://youtube.com' },
    { id: '3', name: 'GitHub', url: 'https://github.com' },
    { id: '4', name: 'Notion', url: 'https://notion.so' },
    { id: '5', name: 'Dribbble', url: 'https://dribbble.com' },
    { id: '6', name: 'Linear', url: 'https://linear.app' }
  ];

  chrome.storage.local.get(['shortcuts'], (result) => {
    if (result.shortcuts && result.shortcuts.length > 0) {
      shortcuts = result.shortcuts;
    } else {
      shortcuts = defaultShortcuts;
      saveShortcuts();
    }
    renderGrid();
  });

  function saveShortcuts() {
    chrome.storage.local.set({ shortcuts });
  }

  function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeDisplay.textContent = \`\${hours}:\${minutes}\`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    dateDisplay.textContent = \`\${dayName}, \${dateNum}\`;
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  function renderGrid() {
    grid.innerHTML = '';
    shortcuts.forEach((sc) => {
      const a = document.createElement('a');
      a.className = 'shortcut-card';
      a.href = sc.url;
      a.dataset.id = sc.id;
      
      let domain = 'example.com';
      try { domain = new URL(sc.url).hostname; } catch (e) {}
      
      const faviconUrl = \`https://www.google.com/s2/favicons?domain=\${domain}&sz=64\`;

      a.innerHTML = \`
        <div class="icon-wrapper">
          <img class="shortcut-icon" src="\${faviconUrl}" alt="\${sc.name}" onerror="this.style.display='none'" />
        </div>
        <div class="shortcut-name">\${sc.name}</div>
        <button class="menu-btn" data-id="\${sc.id}">⋮</button>
      \`;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('menu-btn')) {
          showContextMenu(e, sc.id, e.target);
          return;
        }
        chrome.tabs.create({ url: sc.url });
      });

      a.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, sc.id, a.querySelector('.menu-btn'));
      });

      grid.appendChild(a);
    });
  }

  function showContextMenu(e, id, btnElement) {
    activeContextId = id;
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    contextMenu.style.display = 'block';
    let x = e.clientX;
    let y = e.clientY;
    if (x + 120 > window.innerWidth) x = window.innerWidth - 120;
    if (y + 90 > window.innerHeight) y = window.innerHeight - 90;
    contextMenu.style.left = \`\${x}px\`;
    contextMenu.style.top = \`\${y}px\`;
  }

  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('menu-btn') && !contextMenu.contains(e.target)) {
      contextMenu.style.display = 'none';
      activeContextId = null;
      document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    }
  });

  editItem.addEventListener('click', () => {
    const sc = shortcuts.find(s => s.id === activeContextId);
    if (sc) {
      editingId = sc.id;
      nameInput.value = sc.name;
      urlInput.value = sc.url;
      modalTitle.textContent = 'Edit Shortcut';
      modal.style.display = 'flex';
      contextMenu.style.display = 'none';
      nameInput.focus();
    }
  });

  deleteItem.addEventListener('click', () => {
    shortcuts = shortcuts.filter(s => s.id !== activeContextId);
    saveShortcuts();
    renderGrid();
    contextMenu.style.display = 'none';
  });

  addBtn.addEventListener('click', () => {
    editingId = null;
    nameInput.value = '';
    urlInput.value = '';
    modalTitle.textContent = 'Add Shortcut';
    modal.style.display = 'flex';
    nameInput.focus();
  });

  cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });

  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim().substring(0, 10);
    let url = urlInput.value.trim();
    if (!name || !url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) { url = 'https://' + url; }

    if (editingId) {
      const index = shortcuts.findIndex(s => s.id === editingId);
      if (index !== -1) { shortcuts[index] = { ...shortcuts[index], name, url }; }
    } else {
      shortcuts.push({ id: Date.now().toString(), name, url });
    }

    saveShortcuts();
    renderGrid();
    modal.style.display = 'none';
  });
  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') cancelBtn.click();
  });
});
`;;

export const base64Icon48 = "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";
