# FSMS as a phone app (PWA)

Install once, then launch from the home screen: your logo as the icon, a
splash screen while it loads, and **no browser address bar**.

Everything here is free and takes about 15 minutes.

---

## Why this folder exists

Apps Script serves your app inside a sandboxed iframe on
`googleusercontent.com`. A browser only reads `<link rel="manifest">` and
registers a service worker from the **top-level** document — so a manifest
added to `Index.html` is simply ignored, and the app can never be installed.

That is a platform rule, not something to code around. I verified it: a
manifest inside an iframe is invisible to the installer.

So this folder is a **tiny launcher** that becomes the top-level document. It
carries the manifest, the icons and the service worker, and loads your real
Apps Script app inside it. Roughly 6 KB of HTML plus icons.

Nothing in FSMS itself changes. Same deployment, same data, same sign-in.

---

## Setup

### 1. Create a free GitHub account

[github.com/signup](https://github.com/signup) if you do not have one.

### 2. Make a new repository

- Name it **`fsms`**
- Set it to **Public** (required — GitHub Pages needs it on a free account)
- Tick **Add a README file**
- **Create repository**

### 3. Upload the files

- **Add file → Upload files**
- Open the `pwa` folder on your computer and drag in **what is inside it** —
  `index.html`, `manifest.webmanifest`, `sw.js` and the `icons` folder
- **Commit changes**

> **Drag the contents, not the `pwa` folder itself.** If you drag the folder,
> everything lands one level deeper and your link becomes
> `…github.io/fsms/pwa/` instead of `…github.io/fsms/`. Both work — but the
> short link will 404 unless you also upload `pwa-root/index.html` to the
> repository root, which forwards one to the other. See
> [PAGE-NOT-FOUND.md](PAGE-NOT-FOUND.md).

### 4. Paste your app URL

- Click **`index.html`** → the **pencil** (Edit)
- Find this line near the bottom:

  ```js
  var FSMS_URL = 'PASTE_YOUR_EXEC_URL_HERE';
  ```

- Replace the placeholder with your web-app address from
  **Deploy → Manage deployments**. It must end in **`/exec`**:

  ```js
  var FSMS_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
  ```

- **Commit changes**

> A `/dev` URL only ever works for the account that owns the script. It will
> fail for everyone else.

### 5. Turn on GitHub Pages

- **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)** → **Save**

Wait 1–2 minutes. Your app is now at:

```
https://YOUR-USERNAME.github.io/fsms/
```

That is the link you give people from now on.

---

## Installing it

> **Sharing with staff and families?** Send them the illustrated guide for
> their device:
> **[iPhone](INSTALL-IPHONE.md)** · **[Android](INSTALL-ANDROID.md)** · **[PC](INSTALL-PC.md)**

**Android (Chrome)** — open the link, tap **⋮**, then **Add to Home screen**
or **Install app**. Chrome often offers this by itself.

**iPhone (Safari — it must be Safari)** — open the link, tap **Share**, then
**Add to Home Screen**.

**Desktop (Chrome/Edge)** — an install icon appears in the address bar. No
icon? **⋮** → *Cast, save, and share* → *Install page as app*.

After installing, launch from the home-screen icon. You get the splash screen,
then FSMS full-screen with no address bar.

---

## What people will see

| | |
|---|---|
| **Icon** | Your gold `Favoured` mark on dark |
| **Name** | FSMS |
| **Splash** | Logo, "FSMS", and the school name |
| **Then** | FSMS full screen, no address bar |

---

## Honest limitations

**It still needs the internet.** The launcher shell is cached so the splash
appears instantly, but FSMS itself is live data behind a session. The service
worker deliberately does **not** cache registers, attendance or wallet
balances — a stale register is worse than an honest "you are offline".

**iOS is stricter.** "Add to Home Screen" only works from Safari, not Chrome
on iPhone, and Apple does not offer an automatic install prompt.

**It is not in the app stores.** This is a real app on the home screen, not a
Play Store listing. Getting into the stores needs a native wrapper, a
developer account (\$25 one-off for Google, \$99/year for Apple) and review.
Tell me if you ever want that; for a school, this is almost always enough.

---

## Changing things later

**New app URL?** Edit `FSMS_URL` in `index.html` and commit. Installed phones
pick it up on next launch.

**New logo?** Replace the files in `icons/`, then bump `CACHE` in `sw.js`
(`fsms-shell-v1` → `v2`) so phones fetch the new ones instead of the cached
old ones. Note the mark is also embedded inside `index.html` and
`manifest.webmanifest` as a fallback — regenerate those with
`tools/make_pwa_icons.py` if you want the fallback to match too.

**Updating FSMS itself?** Nothing to do here. The launcher always loads your
current deployment.

---

## If something goes wrong

| What you see | Almost always means |
|---|---|
| "Set FSMS_URL…" under the logo | Step 4 was skipped |
| Splash, then a blank frame | The `/exec` URL is wrong, or the deployment is not set to **Anyone** |
| **404 / "Page not found"** | Pages is still building (wait 2 min), the URL is missing `/fsms/`, or you uploaded the folder instead of its contents — see [PAGE-NOT-FOUND.md](PAGE-NOT-FOUND.md) |
| No install option on Android | Not served over HTTPS — use the `github.io` link, not a local file |
| No install option on iPhone | You are in Chrome; iOS only allows this from Safari |
| Old icon after changing it | Bump `CACHE` in `sw.js` and reinstall |
| Broken-image box on the splash | The `icons` folder did not upload. The logo now falls back to a copy embedded in `index.html`, so this should no longer happen — but upload `icons/` anyway for the sharp home-screen icon |
| **No "Install app" option at all** | Almost always the missing `icons` folder: Chrome refuses to install if the manifest's icons 404. The manifest now embeds its own copies, so installing works regardless — re-upload the launcher files to pick up the fix |
| Stuck on the splash | Wait 6 seconds; a link to open it in the browser appears |
