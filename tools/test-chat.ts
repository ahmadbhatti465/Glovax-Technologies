import { getChatAnswer, findEmail } from "../src/lib/chat-concierge";

const tests: [string, string][] = [
  ["How much does it cost?", "pricing"],
  ["Will you sign an NDA?", "nda"],
  ["What is your process?", "process"],
  ["Do you work with UK clients?", "timezone"],
  ["I want to book a call", "booking"],
  ["tell me about your AI services", "ai"],
  ["how do payments work", "payments"],
  ["who is the founder", "team"],
  ["what tech stack do you use", "tech"],
  ["do you sign ndas before we talk", "nda"],
  ["how long does an MVP take", "timeline"],
  ["sdfghjk", "fallback"],
];

let pass = 0;
for (const [q, want] of tests) {
  const r = getChatAnswer(q);
  const ok = r.id === want;
  if (ok) pass++;
  console.log((ok ? "PASS" : "FAIL") + "  [" + r.id.padEnd(16) + "]  " + q);
}
console.log("email detect:", findEmail("reach me at john@acme.co.uk please"));
console.log(`${pass}/${tests.length} passed`);
