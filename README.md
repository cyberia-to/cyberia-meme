# cyberia.meme — the meme state

a meme is a particle. the site renders memes from the protocol's own lines over the
seven colours, an emoji figure, or the real bostrom cybergraph sample (`graph.json`,
1,200 particles · 6,000 cyberlinks, copied from `cyber/landing/graph.json`), and lets
anyone make one: top, bottom, background, figure → png minted in the browser, sha-256
of the bytes shown as its particle, the whole meme encoded in the URL hash.

no build. `index.html` + `app.js` + `meme.css` on the house engine shared with cyber.page (`style.css` is a copy of `cyber/landing/style.css`: seven-colour chapters, rail, HUD, sound, fit system), `graph.json`, `og.png`. seven chapters: meme · particle · make · the wall · mint · spread · doors.

## deploy

    nu scripts/deploy.nu          # rsync → cyberproxy:/var/www/html/cyberia.meme/

- nginx: `/etc/nginx/sites-enabled/cyberia.meme` (mirrored in `apparatus/servers/cyberproxy/nginx/cyberia.meme`)
- TLS: certbot, `cyberia.meme` + `www.cyberia.meme`
- DNS (Namecheap, via `nc-dns` on cyberproxy): `A @ 167.235.28.94`, `CNAME www cyberia.meme.`
- analytics: lytics tag in `<head>`

## adding a meme to the wall

edit `CANON` in `app.js`: `[top, bottom, background, figure]` where background is one
of the seven hex colours, `'graph'`, `'black'` or `'white'`, and figure is an emoji or `''`.
every line should come from a page of the graph.
