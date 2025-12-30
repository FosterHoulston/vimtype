# Testing, Deployment, and Compliance

## Testing strategy
### Unit tests
- Vim engine transitions: `(buffer, cursor, mode) + keys[] => newState`.
- Edge cases: start/end of line, empty selection, unicode, tabs vs spaces.
- Stats tracking: insertion correctness and timing boundaries.

### Integration tests
- Golden prompts: known algorithms with scripted keystrokes.
- Validate WPM/raw/accuracy match Monkeytype definitions.

### Anti-cheat tests
- Ensure disallowed operations cannot insert more than 1 character per keypress.

## Production deployment (Monkeytype-aligned)
- Docker-first production path (frontend + backend + database + cache).
- Accounts/auth provider optional, consistent with Monkeytype.
- Monitoring + analytics consistent with existing disclosures.
- Security: rate limits, abuse prevention, optional Recaptcha if accounts enabled.
- CI: lint/build/test in the standard pipeline.

## Licensing and compliance
- Keep GPL-3.0 licensing aligned with Monkeytype.
- Ensure deployed site offers corresponding source code (GPL compliance).
- Do not import LeetCode or other proprietary prompt/solution text.
- Algorithms are authored by us or clearly public-domain/permissive.
