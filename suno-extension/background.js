const DEFAULT_PASSPORT = 'TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl';
const MENU_ID = "suno-generate";

function createMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "IA: generar música con el texto seleccionado",
      contexts: ["selection"]
    });
  });
}

chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup.addListener(createMenus);

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return;
  await chrome.storage.local.set({ selectedText: info.selectionText || "" });
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

function withTimeout(promise, ms = 60000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
}

chrome.runtime.onMessage.addListener((req, _, send) => {
  if (req?.action !== "generateMusic") return;
  
  const payload = req.payload || {};
  const passport = (req.passport?.trim()) || DEFAULT_PASSPORT;
  
  if (!passport) {
    send({ ok: false, error: "Falta token" });
    return;
  }
  
  (async () => {
    try {
      const response = await withTimeout(fetch("https://usa.imgkits.com/node-api/suno/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${passport}`,
          "channel": "chrome-extension"
        },
        body: JSON.stringify(payload)
      }), 60000);
      
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
