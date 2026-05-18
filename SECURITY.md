# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.0.x | ✅ Yes |

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Email: open a **private** GitHub Security Advisory at:
`https://github.com/muhtasim-rahman/devtoolhub/security/advisories/new`

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect a response within **72 hours**.

## Security Notes

- DevToolHub is a **client-side only** application — no user data is transmitted to our servers
- The **URL Metadata** tool makes requests to third-party APIs (Microlink, Dub.co, JSONLink, AllOrigins) — use with URLs you are comfortable sharing with those services
- Image processing (EXIF Remover, Batch Renamer) happens entirely in your browser using the Canvas API — no images leave your device
- localStorage is used only for theme preference and URL history — no sensitive data is stored
