# SEXAMATH.si

Static single-page site for SEXA Math (backdrop: RICOLMC-DDF, https://doi.org/10.17605/OSF.IO/WNV67).

## Assets
- Hero video: `preview/sexamath_animation_en_GB.mp4` (9:03, 1080p, ~54 MB; Jered cold open + British VO)
- Paper download: `assets/papers/RICOLMC-DDF.pdf` (OSF DOI-link version)

## Domain
`sexamath.si` was available on GoDaddy at time of build (not purchased):
https://www.godaddy.com/domainsearch/find?domainToCheck=sexamath.si&key=gd_mcp_server&itc=gd_mcp_server

## Preview locally
    cd /workspace/sexamath-si && python3 -m http.server 8080
Then open http://localhost:8080

## Deploy (after Jered buys the domain)
1. Push this folder to a GitHub repo; enable Pages (main branch, root). `CNAME` and `.nojekyll` are included.
2. At the registrar, point DNS: apex A records to 185.199.108.153 / .109.153 / .110.153 / .111.153, and `www` CNAME to `<user>.github.io`.
3. Enable "Enforce HTTPS" in Pages settings.
No DNS has been changed.
