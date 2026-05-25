# Mobile Release

Native mobile apps are not hosted like the web app. They are built, signed, uploaded, reviewed, and distributed through platform stores.

## iOS

Use native SwiftUI.

Release flow:

- Apple Developer account
- App Store Connect app record
- Bundle identifier
- Signing certificates and provisioning
- Archive build with Xcode or CI
- Upload build to App Store Connect
- TestFlight for beta testing
- App Store review for production release

Do not commit certificates, private keys, provisioning profiles, or exported archives.

## Android

Use native Kotlin and Jetpack Compose.

Release flow:

- Google Play Console app record
- Application ID
- Signing key management
- Android App Bundle (`.aab`) build
- Internal testing track
- Closed/open testing where needed
- Production rollout in Play Console

Do not commit keystores, signing passwords, generated APKs, or generated AABs.

## Parity Rule

Mobile apps must not become afterthoughts. Any public feature shipped on web needs corresponding iOS and Android decisions, implementation, or an explicit documented exception.
