/* Programmatic theme verification via Chrome DevTools Protocol.
   Extracts computed styles from key elements of the live homepage. */
const { spawn } = require("child_process");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

const ws = [];
function cdp(wsUrl, method, params = {}, id = 0) {
  return new Promise((resolve, reject) => {
    const cb = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id === id) {
        ws.splice(ws.indexOf(cb), 1);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    };
    ws.push(cb);
    wsUrl.send(JSON.stringify({ id, method, params }));
  });
}

(async () => {
  // Launch headless Chrome with remote debugging
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`, "about:blank",
  ], { stdio: "ignore" });

  // Wait for debugging endpoint
  let version;
  for (let i = 0; i < 40; i++) {
    try { version = await getJson(`http://127.0.0.1:${PORT}/json/version`); break; }
    catch { await sleep(250); }
  }
  if (!version) { console.error("CDP not reachable"); process.exit(1); }

  // Create a new tab for the homepage
  const target = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("http://localhost:3000/")}`, { method: "PUT" }).then((r) => r.json());

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { socket.onopen = res; socket.onerror = rej; });
  socket.onmessage = (ev) => { for (const cb of [...ws]) cb(ev); };
  let msgId = 1;
  const send = (method, params) => cdp(socket, method, params, msgId++);

  // Enable Page + Runtime
  await send("Page.enable");
  await send("Runtime.enable");
  await sleep(6000); // let the page + animations settle

  const EXPR = `(() => {
    const pick = (sel) => document.querySelector(sel);
    const cs = (el, prop) => el ? getComputedStyle(el).getPropertyValue(prop).trim() : "MISSING";

    // Identify the magnetic buttons: primary first, outline second
    const magneticButtons = [...document.querySelectorAll("a,button")].filter((a) =>
      (a.className || "").includes("rounded-full") && (a.className || "").includes("transition-all")
    );
    const primary = magneticButtons.find((b) => (b.className||"").includes("from-teal"));
    const outline = magneticButtons.find((b) => (b.className||"").includes("border-teal-muted"));
    const chatLauncher = document.querySelector("button[aria-label*='concierge'], button[aria-label*='chat']");
    const body = document.body;
    const card = document.querySelector(".bg-surface-raised");
    const mutedText = document.querySelector(".text-muted");
    const techChip = document.querySelector(".hover\\:text-teal");
    const primaryBtnText = primary && primary.querySelector("span.relative");

    return {
      bodyBackground: cs(body, "background-color"),
      bodyColor: cs(body, "color"),
      heroPrimaryCtaBackgroundImage: cs(primary, "background-image"),
      heroPrimaryCtaTextColor: primaryBtnText ? cs(primaryBtnText, "color") : cs(primary, "color"),
      heroOutlineCtaBorderColor: cs(outline, "border-color"),
      chatLauncherBackgroundImage: cs(chatLauncher, "background-image"),
      cardBackground: cs(card, "background-color"),
      mutedTextColor: cs(mutedText, "color"),
      techChipHoverRulePresent: Boolean(document.querySelector(".hover\\:text-teal")),
      tealGlowShadowDefined: Boolean([...document.styleSheets].some((s) => {
        try { return s.cssRules && [...s.cssRules].some((r) => r.cssText && r.cssText.includes("--teal-glow")); } catch { return false; }
      })),
    };
  })()`;

  const res = await send("Runtime.evaluate", { expression: EXPR, returnByValue: true });
  console.log(JSON.stringify(res.result.value, null, 2));

  // Also screenshot via CDP (saved for the user to open)
  await send("Page.captureScreenshot", { format: "png" }).then(async (shot) => {
    const fs = require("fs");
    fs.writeFileSync("D:\\Projects\\Glovax Technologies\\tools\\preview-home-cdp.png", Buffer.from(shot.data, "base64"));
    console.log("screenshot saved to tools/preview-home-cdp.png");
  }).catch((e) => console.error("screenshot failed:", e.message));

  socket.close();
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
