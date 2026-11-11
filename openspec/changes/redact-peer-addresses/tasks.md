## 1. Record roots

- [x] 1.1 Declare `record_roots = ["docs/decisions/"]` in `.ethos/profile.toml`; done when the
      keyless preview reports all five occurrences inside the effective record roots and none
      outside. The preview reports five `url` occurrences: two in the archived design and three in
      `docs/decisions/`, all inside the roots and none outside.

## 2. Redaction

- [ ] 2.1 Redact with
      `ethos lane redact private-addresses --apply --key-stdin --authorize --expect-head <head>`;
      done when a fresh preview reports no occurrence.
- [ ] 2.2 Verify with
      `ethos lane redact private-addresses --verify --key-stdin --base <base> --head <head>`; done
      when ETHOS records the `redaction:private-peer` Attestation for the head.
