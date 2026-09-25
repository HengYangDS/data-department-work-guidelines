#!/usr/bin/env bash
# Install one pinned upstream CLI into ignored checkout-local CI state.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VERSION="0.24.2"
CACHE="$ROOT/build/runtime/tool-cache/lychee/$VERSION"
TARGET="$CACHE/lychee"

spec_for_arch() {
  case "$1" in
    x86_64)
      ASSET="lychee-x86_64-unknown-linux-gnu.tar.gz"
      DIGEST="1f4e0ef7f6554a6ed33dd7ac144fb2e1bbed98598e7af973042fc5cd43951c9a"
      ;;
    aarch64 | arm64)
      ASSET="lychee-aarch64-unknown-linux-gnu.tar.gz"
      DIGEST="91a7bd65685da41b90ccb9bc867a3d649a7818042dae04ff405e55a25bddee4c"
      ;;
    *)
      echo "unsupported lychee CI architecture: $1" >&2
      exit 2
      ;;
  esac
}

if [[ "${1:-}" == "--print-spec" && $# -eq 2 ]]; then
  spec_for_arch "$2"
  printf '%s %s %s\n' "$VERSION" "$ASSET" "$DIGEST"
  exit 0
fi
[[ $# -eq 0 ]] || {
  echo "unknown lychee bootstrap argument: ${1:-}" >&2
  exit 2
}
[[ "$(uname -s)" == "Linux" ]] || {
  echo "CI lychee bootstrap is Linux-only; use the Homebrew formula on macOS" >&2
  exit 2
}
spec_for_arch "$(uname -m)"

if [[ -e "$TARGET" ]]; then
  [[ -x "$TARGET" && "$("$TARGET" --version)" == "lychee $VERSION" ]] || {
    echo "existing lychee cache entry is invalid: $TARGET" >&2
    exit 2
  }
  exit 0
fi

command -v curl >/dev/null
command -v sha256sum >/dev/null
command -v tar >/dev/null
mkdir -p "$CACHE"
tmp="$(mktemp -d "$CACHE/.download.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT
url="https://github.com/lycheeverse/lychee/releases/download/lychee-v$VERSION/$ASSET"
curl --proto '=https' --tlsv1.2 --fail --location --silent --show-error \
  --connect-timeout 10 --max-time 90 --retry 0 --output "$tmp/$ASSET" "$url"
printf '%s  %s\n' "$DIGEST" "$tmp/$ASSET" | sha256sum --check --status
tar -xzf "$tmp/$ASSET" -C "$tmp"
binary="$tmp/${ASSET%.tar.gz}/lychee"
[[ -f "$binary" ]] || {
  echo "upstream lychee archive has no binary" >&2
  exit 2
}
chmod 755 "$binary"
[[ "$("$binary" --version)" == "lychee $VERSION" ]] || {
  echo "upstream lychee binary failed its version check" >&2
  exit 2
}
mv "$binary" "$TARGET"
printf 'installed pinned lychee %s into ignored checkout-local state\n' "$VERSION"
