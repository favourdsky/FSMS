# "Page not found" after turning on GitHub Pages

Your files are fine — I tested the launcher in both possible repository
layouts and it works in each. A 404 at this stage is almost always one of
four things. Work down the list; each takes under a minute.

---

## 1. Pages simply is not ready yet (most common)

The first build takes **1–5 minutes**, and the 404 page looks identical
whether the site is still building or genuinely broken.

**Check:** go to your repository → **Actions** tab. If a run has a spinning
amber dot, wait for the green tick, then reload.

Also check **Settings → Pages**. When it is live you will see a green banner:

> Your site is live at `https://USERNAME.github.io/fsms/`

If there is no banner, Pages has not finished — or was never saved.

---

## 2. The URL is missing the repository name

This trips almost everybody.

| | |
|---|---|
| ❌ `https://USERNAME.github.io` | this is a *different*, personal site |
| ✅ `https://USERNAME.github.io/fsms/` | your repository — note `/fsms/` |

The repository name is part of the address, and the **trailing slash matters**.
Use the exact link from the green banner in **Settings → Pages** rather than
typing it.

---

## 3. You uploaded the folder, not its contents

This is the one I would bet on.

If you dragged the whole **`pwa`** folder in, GitHub kept it as a folder, so
your files sit one level deeper:

```
fsms/
└── pwa/
    ├── index.html      ← the launcher is here
    ├── manifest.webmanifest
    ├── sw.js
    └── icons/
```

`https://USERNAME.github.io/fsms/` is then genuinely empty → **404**.

**Two ways to fix it, both fine:**

**A — just use the longer link** (nothing to change):

```
https://USERNAME.github.io/fsms/pwa/
```

I verified the launcher works perfectly from a subfolder — every path in it is
relative.

**B — add the redirect file** so the short link works too. In your repo:
**Add file → Upload files**, drag in **`pwa-root/index.html`**, and drop it at
the **root** (not inside `pwa/`). Now `/fsms/` forwards to `/fsms/pwa/`
automatically.

> Check which layout you have: open your repo's main page. If you see a folder
> called `pwa`, you have this situation. If you see `index.html` listed
> directly, you do not.

---

## 4. The branch or folder is wrong in the settings

**Settings → Pages** must read:

- Source: **Deploy from a branch**
- Branch: **main** — *not* `master`, *not* `gh-pages`
- Folder: **/ (root)**

Then **Save**. Changing this rebuilds the site; give it another minute.

---

## Still stuck?

Send me:

1. Your repository URL, or just your GitHub username and repo name
2. A screenshot of **Settings → Pages** (the whole panel)
3. A screenshot of the repo's file list (so I can see the layout)

That is enough to tell you the exact URL in one reply.

---

## A note on what a 404 does *not* mean

It does **not** mean anything is wrong with FSMS, your Apps Script
deployment, or the launcher. GitHub Pages is only serving static files here —
this is purely about where those files sit and what address you visit. Your
school system is untouched.
