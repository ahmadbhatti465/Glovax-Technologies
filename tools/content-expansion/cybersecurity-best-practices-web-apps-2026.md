The threat landscape for web applications in 2026 is defined by automation and speed. Autonomous AI agents crawl public sites and scan for unpatched dependencies, exposed API keys, and misconfigured endpoints in milliseconds — a reconnaissance process that used to take a human attacker days. Credential-stuffing botnets hammer login endpoints with billions of stolen password combinations, and prompt-injection attacks now target the LLM-powered features that are increasingly embedded in standard web apps.

Security in this environment is a defense-in-depth discipline. No single control stops a determined adversary; the goal is layers of controls that slow an attacker, block the automated waves, and contain the damage when something slips through. These are the five defenses we implement on every production web application at Glovax Technologies.

## Defense 1: Strict Content Security Policy and CORS

A Content Security Policy (CSP) is your first line against the injection attacks that feed the majority of data breaches — stored and reflected XSS. CSP tells the browser exactly which sources of scripts, styles, images, and fonts are trusted, so injected markup cannot execute attacker-controlled JavaScript.

In 2026 the recommended approach is a strict, nonce-based policy rather than a wildcard allowlist. Generate a unique nonce per request for inline scripts, and restrict everything else to your own domains:

```http
Content-Security-Policy: default-src 'self';
  script-src 'self' 'nonce-{random}' https://js.stripe.com;
  img-src 'self' https://images.unsplash.com data:;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
```

CORS is the complementary control. It is not a security feature by itself — it is a browser access-control mechanism — but a misconfigured `Access-Control-Allow-Origin: *` header on an API that handles authenticated requests is a serious hole. Restrict origins to exactly the domains you control, never reflect the `Origin` header blindly, and keep credentials (`Access-Control-Allow-Credentials`) off unless the specific endpoint requires them. If you use a third-party CDN or gateway, audit the headers it forwards.

## Defense 2: Parameterized queries against SQL injection

SQL injection remains the top database attack because it is trivial to automate and devastating when it works. The 2026 rule is absolute: never build SQL by concatenating user input. Modern ORMs make this easy.

We use **Drizzle ORM** for TypeScript projects precisely because its schema-first, parameterized query builder prevents string-based injection by construction. A prepared statement keeps data and structure separate:

```ts
import { eq } from "drizzle-orm";
import { users } from "./schema";

// Safe: the ORM parameterizes the query; input can never alter the SQL structure.
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, inputEmail));
```

Even with an ORM, two rules apply: validate and sanitize input at the boundary, and grant your database user the least privileges required (a web app should never connect to the database as an admin user with `DROP TABLE` rights). Row-level security and tenant-scoped queries further limit the blast radius of any compromise. For architecture depth, our [guide to building enterprise SaaS with Next.js 16, Drizzle, and Turso](/blog/building-enterprise-saas-nextjs-16-drizzle-turso) shows the pattern in production.

## Defense 3: Rate limiting and bot protection at the edge

Automated attacks — credential stuffing, card testing, inventory scraping, and the AI reconnaissance scanners mentioned earlier — are stopped most efficiently before they reach your origin. Edge-level protection sits in front of your application and throttles or blocks suspicious traffic.

In 2026 the practical stack is:

- **Vercel Firewall or Cloudflare WAF** at the edge, with rate limits per IP and per account on login, signup, and checkout endpoints.
- **Challenge rules** for known bot signatures, data-center IP ranges, and headless-browser fingerprints.
- **Progressive delay on failed logins** (e.g., 1s, 5s, 30s, then account lockout after N attempts) rather than instant rejection, which gives legitimate users a recovery path.
- **Allowlisting for your own integrations** so API keys and internal services are never throttled.

Rate limiting is a blunt instrument — tune it. Too tight and you block real users on shared corporate IPs; too loose and the botnet sails through. Monitor false-positive rates and let legitimate traffic through while keeping the flood at bay.

## Defense 4: Encrypted sessions, HttpOnly cookies, and hardened auth

Session handling is where web apps leak credentials most often. The two cardinal rules in 2026:

1. **Never store tokens in `localStorage` or `sessionStorage`.** Both are readable by any script running on the page, so one XSS flaw hands your session to an attacker. Use `HttpOnly` cookies so JavaScript cannot even see the token.
2. **Sign and encrypt the session.** Signing with `jose` (or your platform's equivalent) prevents tampering; encryption protects payload contents at rest in the cookie.

Here is the cookie configuration we use for production sessions:

```http
Set-Cookie: session=<signed-encrypted-token>;
  HttpOnly; Secure; SameSite=Strict; Path=/;
  Max-Age=604800; Domain=.example.com
```

Add the modern hardening controls on top: short-lived access tokens with refresh rotation, MFA on any privileged account, and session termination on password change. For high-value apps, add device fingerprinting and anomaly detection (a login from a new city triggers a challenge). This session pattern is the same one we document in our [DevSecOps pipeline guide](/blog/devops-ci-cd-security-devsecops-pipeline-guide), where the checks are enforced automatically in CI.

## Defense 5: Automated dependency and container scanning

The OWASP Top 10's "vulnerable and outdated components" category is a permanent fixture because dependency risk scales with your dependency count. Modern applications pull hundreds of packages; any one of them can carry a known CVE. The 2026 answer is automated scanning baked into CI — not quarterly manual audits.

- **GitHub Dependabot** monitors your manifest and opens automated PRs for vulnerable versions.
- **Snyk or Trivy** scans the dependency tree and the final container image for known CVEs and license risks.
- **Block the build** when a high-severity vulnerability appears — the deployment pipeline refuses to ship, which converts "we'll patch it later" into an immediate decision.

Also enforce supply-chain hygiene: pin exact versions or use lockfiles, verify package provenance (e.g., `npm` provenance attestation and Sigstore signatures), and review any package with a large installed base that appears suddenly.

## The supporting layer: logging, secrets, and least privilege

Three habits complete the picture:

- **Structured, centralized logging.** Ship request logs, auth events, and errors to a SIEM or log aggregator with alerting on patterns like repeated 401s, unusual egress, or admin-role escalations.
- **Secrets management.** Never commit `.env` files. Use a vault (or platform-native secret store) with rotation and short-lived credentials for databases and third-party APIs.
- **Least privilege everywhere.** The web tier, the database user, the CI tokens, and every service account should have exactly the permissions it needs — nothing more.

Security is an ongoing process, not a one-time setup. Automated scans, dependency updates, and policy reviews need a team that treats them as routine. If you want to harden your current application or build one with security baked into the architecture, our [web development and cloud security services](/services) cover the full lifecycle — and we can walk through your threat model on a [call with our engineers](/contact).

## FAQ

### How do I protect my app against AI-powered attacks?

The same controls that stop human attackers stop AI agents — they just need to be automated and tuned. Edge rate limiting, bot detection, CSP, and strict CORS block the scanning and probing waves before they reach your application logic. Then rely on parameterized queries and hardened auth for the payloads that get through.

### What is the biggest security mistake Next.js and React apps make?

Storing tokens in `localStorage` and relying on a default CSP. Both stem from convenience but turn a single XSS bug into a full account takeover. Use `HttpOnly` cookies for sessions and a strict nonce-based CSP.

### Do we need a WAF if we deploy on a serverless platform?

Yes. Serverless platforms still expose your API routes and edge functions to the public internet. A WAF plus edge rate limiting (Vercel Firewall, Cloudflare) provides the distributed first layer that your functions should not have to implement themselves.

### How often should we scan for vulnerabilities?

Continuously, in CI, for dependencies and images. Nightly or per-build scanning with a blocked build on high-severity findings is the standard. Manual penetration testing remains valuable quarterly or before major releases — automation finds known issues; pentesters find logic flaws.

### Is encryption at rest enough to protect user data?

No. Encryption at rest protects against physical data theft but does nothing against an attacker who has a valid session or a compromised service account. Defense-in-depth means encryption at rest and in transit, strict access control, least privilege, and monitoring — layered, not single-point.
