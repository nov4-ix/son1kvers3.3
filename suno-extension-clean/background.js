// Background service worker - Clean version
const DEFAULT_PASSPORT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKeXRYZlBRa21JUHM4b2JPbVYyaHpoREtEeVhxVzhnUCIsImV4cCI6MTc1OTk2Mzc1OH0.a6K0kTGbc164uQvU24GHJF8x9BYV07HztMjt0Ug2x0U';
const MENU_ID = "suno-generate";

// Create context menu
function createMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "IA: generar música con el texto seleccionado",
      contexts: ["selection"]
    });
  });
}

// Initialize on install/startup
chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup.addListener(createMenus);

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return;
  await chrome.storage.local.set({ selectedText: info.selectionText || "" });
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((req, _, send) => {
  if (req?.action !== "generateMusic") return;

  const payload = req.payload || {};
  const passport = (req.passport?.trim()) || DEFAULT_PASSPORT;

  if (!passport) {
    send({ ok: false, error: "Falta token" });
    return;
  }

  // Generate music with timeout
  (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch("https://ai.imgkits.com/suno/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${passport}`,
          "channel": "node-api",
          "origin": "https://www.livepolls.app",
          "referer": "https://www.livepolls.app/"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch {
        data = { raw: await response.text(), status: response.status };
      }

      await chrome.storage.local.set({ sunoResult: data, sunoLastError: null });
      send({ ok: true, data: data });
    } catch (error) {
      await chrome.storage.local.set({ sunoResult: null, sunoLastError: error.message });
      send({ ok: false, error: error.message });
    }
  })();

  return true;
});
