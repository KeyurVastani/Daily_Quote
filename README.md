# Daily Quote

React Native app for daily quotes, favorites, category discovery, and sharing. Quotes are loaded from [API Ninjas](https://api-ninjas.com/) (Quotes API v2).

---

## Prerequisites

Complete the official guide first: **[Set up your environment](https://reactnative.dev/docs/set-up-your-environment)** (Node, Watchman, Xcode, Android SDK, etc.).

This repo expects:

| Requirement | Notes |
|---------------|--------|
| **Node.js** | `>= 22.11.0` (see `package.json` → `engines`) |
| **npm** or **yarn** | Used for JS dependencies |
| **Ruby + Bundler** | For iOS CocoaPods (see `Gemfile`) |
| **Xcode** | iOS builds |
| **Android Studio** | Android builds |

---

## 1. Clone and install dependencies

```sh
git clone <your-repo-url>
cd Daily_Quote
npm install
```

> If you use Yarn, run `yarn` instead of `npm install`.

---

## 2. Environment variables (`.env`)

The app reads secrets from a **root** `.env` file via [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv) (configured in `babel.config.js` as module `@env`).

### Step A — Create `.env`

From the project root:

```sh
cp .env.example .env
```

### Step B — Add your API Ninjas key

1. Sign up / log in at [api-ninjas.com](https://api-ninjas.com/).
2. Open the dashboard and copy your **API key**.
3. Edit `.env`:

```env
API_NINJAS_BASE_URL=https://api.api-ninjas.com
API_NINJAS_KEY=paste_your_real_key_here
```

- **`API_NINJAS_BASE_URL`** — Host for REST calls (default shown above). Use `https://api.api-ninjas.com`, not the marketing site `https://api-ninjas.com` (see [API Ninjas](https://api-ninjas.com)).
- **`API_NINJAS_KEY`** — From your [API Ninjas](https://api-ninjas.com) dashboard.
- **No quotes** around values unless they contain spaces.
- **No spaces** around `=`.
- If you omit `API_NINJAS_BASE_URL`, the app falls back to `https://api.api-ninjas.com` (still add it to `.env` for clarity).

### Step C — Restart Metro after changing `.env`

Environment values are inlined at **bundle time**. After any change to `.env`:

```sh
# Stop Metro (Ctrl+C), then:
npm start -- --reset-cache
```

Then rebuild the app (see below). A full rebuild is safest on native changes; for `.env` alone, reset-cache + reload is usually enough.

### TypeScript types for `@env`

Declared in `src/types/env.d.ts`. If you add a new variable:

1. Add it to `.env` / `.env.example`.
2. Export it in `declare module '@env' { ... }` in `src/types/env.d.ts`.

### Security

- `.env` is **gitignored** — do not commit real keys.
- Commit **`.env.example`** only (placeholders).

---

## 3. iOS setup

Install CocoaPods (first time / after changing native deps):

```sh
cd ios
bundle install          # installs CocoaPods version from Gemfile
bundle exec pod install
cd ..
```

Run on simulator or device:

```sh
npm run ios
```

**Troubleshooting:** If `pod install` fails, use the Ruby version your team documents, run `bundle install` from `ios/`, and see [CocoaPods troubleshooting](https://guides.cocoapods.org/using/troubleshooting).

---

## 4. Android setup

- Open the project in Android Studio once to sync SDKs if needed.
- Start an emulator or connect a device with USB debugging.

```sh
npm run android
```

---

## 5. Run the app (daily workflow)

**Terminal 1 — Metro:**

```sh
npm start
```

**Terminal 2 — Platform:**

```sh
npm run ios
# or
npm run android
```

Useful Metro flags:

```sh
npm start -- --reset-cache
```

---

## 6. Other scripts

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint |
| `npm test` | Jest |

---

## 7. Project structure (high level)

| Path | Purpose |
|------|---------|
| `App.tsx` | App entry / navigation shell |
| `src/api/quotesApi.ts` | API Ninjas client (`API_NINJAS_BASE_URL`, `API_NINJAS_KEY` from `@env`) |
| `src/types/env.d.ts` | TypeScript for `@env` |
| `babel.config.js` | `react-native-dotenv` → `@env`, reads `.env` |

---

## 8. Troubleshooting

| Issue | What to try |
|--------|-------------|
| Quotes fail / network errors | Confirm `API_NINJAS_KEY` in `.env`, restart Metro with `--reset-cache`, rebuild app. |
| `@env` undefined or wrong value | Ensure `.env` is in the **project root** (same folder as `package.json`). |
| iOS build errors after `npm install` | `cd ios && bundle exec pod install && cd ..` |
| Stale JS bundle | `npm start -- --reset-cache` |

More general help: [React Native troubleshooting](https://reactnative.dev/docs/troubleshooting).

---

## Learn more

- [React Native docs](https://reactnative.dev/docs/getting-started)
- [API Ninjas Quotes API](https://api-ninjas.com/api/quotes)
