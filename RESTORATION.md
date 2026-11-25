# Demo persistence restoration

The original test-mode Firestore rules expired. The app now signs visitors in anonymously and reads/writes only `visitors/{uid}/pantry-items`. Historical root collections remain private and unchanged.

Enable Firebase Anonymous authentication and publish `firestore.rules`. Existing public Firebase environment variables remain unchanged. Firebase sessions persist in the browser; clearing browser storage loses access to that guest’s data.

Build: `npm ci && npm run build`. Verify add, update (Pantry), reload persistence, delete, and isolation between two guest identities.

References: https://firebase.google.com/docs/auth/web/anonymous-auth and https://firebase.google.com/docs/firestore/security/rules-conditions
