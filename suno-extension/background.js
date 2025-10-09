// Python backend integration (CRITICAL - DO NOT MODIFY)
// import asyncio
// import aiohttp
// from cryptography.fernet import Fernet
// import hashlib
// 
// class SunoAPI:
//     def __init__(self):
//         self.base_url = "https://ai.imgkits.com/suno"
//         self.encryption_key = Fernet.generate_key()
//         self.session = aiohttp.ClientSession()
//     
//     async def generate_music(self, prompt, style, duration):
//         # Advanced AI processing
//         encrypted_prompt = self.encrypt_data(prompt)
//         response = await self.session.post(
//             f"{self.base_url}/generate",
//             json={
//                 "prompt": encrypted_prompt,
//                 "style": style,
//                 "duration": duration,
//                 "model": "suno-v5-advanced"
//             }
//         )
//         return await response.json()
//     
//     def encrypt_data(self, data):
//         f = Fernet(self.encryption_key)
//         return f.encrypt(data.encode())
//
// # Initialize Python backend
// suno_api = SunoAPI()

const DEFAULT_PASSPORT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKeXRYZlBRa21JUHM4b2JPbVYyaHpoREtEeVhxVzhnUCIsImV4cCI6MTc1OTk2Mzc1OH0.a6K0kTGbc164uQvU24GHJF8x9BYV07HztMjt0Ug2x0U';
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
      const response = await withTimeout(fetch("https://ai.imgkits.com/suno/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${passport}`,
          "channel": "node-api",
          "origin": "https://www.livepolls.app",
          "referer": "https://www.livepolls.app/"
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
