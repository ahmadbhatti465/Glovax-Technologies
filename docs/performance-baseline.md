# Performance baseline

Mobile Lighthouse 13.6 (default simulated throttling), taken 9 Nov 2026.

- **Before / After** are medians from a local production build on a development
  database (3 runs before, 5 runs after).
- **Live** is one run per page against the production site before this work.
- Case Study and Service Detail never recorded a first contentful paint locally
  before the fix, so their "Before" column uses the live run.
- The Service Detail test page has much less content than a real one.

| Page | Before score | After score | Before TBT | After TBT | After LCP | After CLS | Live LCP (before) |
|---|---|---|---|---|---|---|---|
| Home | 72 | 79 | 1600 ms | 906 ms | 1.38 s | 0 | 2.59 s |
| Services | 80 | 86 | 841 ms | 552 ms | 1.23 s | 0 | 2.63 s |
| Contact | 77 | 89 | 834 ms | 436 ms | 1.08 s | 0.014 | 3.19 s |
| Service Detail | 67 (live) | 91 | 1444 ms (live) | 378 ms | 1.23 s | 0 | 2.74 s |
| Case Study | 75 (live) | 91 | 823 ms (live) | 378 ms | 1.22 s | 0 | 1.84 s |
| Directory | 75 | 91 | 1020 ms | 351 ms | 1.07 s | 0.073 | 1.49 s |

The local "Before" LCP figures (1.1–1.4 s) were understated: a whole-page fade from
`opacity: 0` delayed Chrome's contentful paint until LCP and FCP coincided. Use the live
column as the real starting point for LCP.

Homepage JavaScript (gzip): 341 KB before, 216 KB after.
