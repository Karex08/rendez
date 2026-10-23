# rendez

Client booking app for The Barbershop Geneva (salon in Vésenaz). The v1 spec in `docs/spec-v1.md` is the source of truth for screens, content and look and feel. App copy is French with tutoiement.

## Stack

- Expo SDK 58 (React Native 0.88, New Architecture), TypeScript, Expo Router with routes in `src/app/`. Non-route code goes in `src/components`, `src/domain`, `src/data`, `src/store` and `src/services`.
- SDK 58 is newer than most training data. Check the versioned docs at https://docs.expo.dev/versions/v58.0.0/ (index: https://docs.expo.dev/llms.txt) before using an Expo API.
- Install packages with `npx expo install <pkg>`, never with plain npm.
- `expo-calendar` and the native modules need a development build, not Expo Go:
  - build with `npx expo run:ios`
  - serve the JS with `npx expo start --dev-client`
- `ios/` and `android/` are generated and gitignored. Configure native settings in `app.json`.
- There is no backend in v1. Screens talk only to `src/store/AppStore.tsx`, and persistence lives in `src/store/repository.ts`, which v2 will swap for a server.
- Before declaring work done, run the type check with `npx tsc --noEmit`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on Karex08/rendez, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
