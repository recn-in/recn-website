#!/usr/bin/env bash
# Installs RECN Node on macOS or Linux, for the user who runs it.
#
#   curl -fsSL https://recn.in/install-node.sh | bash
#
# What it does, each step printed as it happens:
#   1. Finds the newest RECN Node build on github.com/recn-in/recn-releases
#      that has an archive for this machine and its SHA256SUMS.
#   2. Downloads it and checks the SHA-256.
#   3. Unpacks it to ~/Applications/RECN Node/current (macOS) or
#      ~/.local/opt/recn-node/current (Linux). The Node updates itself in
#      place from there. Its data lives apart, in ~/Library/Application
#      Support/RECN Node or ~/.local/share/recn-node.
#   4. Links ~/.local/bin/recn-node to it.
#   5. Runs `recn-node service install`: a per-user LaunchAgent (macOS) or a
#      systemd user unit (Linux), started now and at every boot or login.
#      On Linux it also turns on lingering, so the Node keeps running after
#      you log out of SSH.
#
# Nothing needs sudo, except `loginctl enable-linger` on distros that ask
# for it. Uninstall: recn-node reset uninstall --yes
#
# Set GITHUB_TOKEN to lift GitHub's 60-requests-an-hour limit on shared
# cloud IPs.
set -euo pipefail

FEED='https://api.github.com/repos/recn-in/recn-releases/releases?per_page=100'

if [ -t 1 ]; then B=$'\e[1m'; D=$'\e[2m'; R=$'\e[31m'; G=$'\e[32m'; N=$'\e[0m'; else B='' D='' R='' G='' N=''; fi
step() { printf '%s==>%s %s%s%s\n' "$G" "$N" "$B" "$*" "$N"; }
info() { printf '    %s%s%s\n' "$D" "$*" "$N"; }
die() { printf '%serror:%s %s\n' "$R" "$N" "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null || die "$1 is needed and is not installed."; }

need curl
need tar

step "Checking this machine"
case "$(uname -s)" in
  Darwin) os=macos; root="$HOME/Applications/RECN Node"; sha() { shasum -a 256 "$1"; } ;;
  Linux)  os=linux; root="$HOME/.local/opt/recn-node"; need sha256sum; sha() { sha256sum "$1"; } ;;
  *) die "RECN Node's installer runs on macOS and Linux. On Windows, unzip the build from https://recn.in/node/ and run bin\\recn_node.exe service install." ;;
esac
case "$(uname -m)" in
  x86_64 | amd64) arch=x64 ;;
  arm64 | aarch64) arch=arm64 ;;
  *) die "No RECN Node build for $(uname -m) yet." ;;
esac
target="$os-$arch"
info "$target, installing for $(id -un) into $root"
[ "$(id -u)" -ne 0 ] || info "Running as root works; a user of its own keeps the Node's data apart."

current="$root/current"
exe="$current/bin/recn_node"

if [ -x "$exe" ]; then
  step "RECN Node is already installed"
  info "$(cat "$current/build" 2>/dev/null || echo 'unknown build') in $current"
  info "It updates itself. To update now: recn-node update"
else
  step "Finding the newest RECN Node build"
  auth=()
  [ -z "${GITHUB_TOKEN:-}" ] || auth=(-H "Authorization: Bearer $GITHUB_TOKEN")
  archive_url='' sums_url=''
  # The app lanes publish to the same repo, so a node build can sit a page down.
  for page in 1 2 3; do
    body=$(curl -fsSL ${auth[@]+"${auth[@]}"} -H 'Accept: application/vnd.github+json' "$FEED&page=$page") ||
      die "GitHub's release list did not answer. If it says rate limit, wait an hour or set GITHUB_TOKEN."
    # Every download URL on the page, newest release first.
    urls=$(printf '%s' "$body" | tr ',' '\n' | sed -n 's/.*"browser_download_url": *"\([^"]*\)".*/\1/p')
    [ -n "$urls" ] || [ "$page" -gt 1 ] || die "GitHub's release list came back empty."
    # The first node archive for this machine whose release also has its SHA256SUMS.
    while read -r url; do
      tag=$(basename "$(dirname "$url")")
      if printf '%s\n' "$urls" | grep -qx "https://github.com/recn-in/recn-releases/releases/download/$tag/SHA256SUMS"; then
        archive_url=$url
        sums_url="$(dirname "$url")/SHA256SUMS"
        break
      fi
    done < <(printf '%s\n' "$urls" | grep -E "/download/node-v[^/]+/recn-node-[^/]+-$target\.tar\.gz$" || true)
    [ -z "$archive_url" ] || break
  done
  [ -n "$archive_url" ] || die "No RECN Node build for $target was found."
  name=$(basename "$archive_url")
  info "$tag"

  tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' EXIT

  step "Downloading $name"
  curl -fL --progress-bar -o "$tmp/$name" "$archive_url"
  curl -fsSL -o "$tmp/SHA256SUMS" "$sums_url"

  step "Checking the SHA-256"
  want=$(awk -v f="$name" '$2 == f || $2 == "*" f { print $1 }' "$tmp/SHA256SUMS")
  have=$(sha "$tmp/$name" | awk '{ print $1 }')
  [ -n "$want" ] || die "SHA256SUMS has no line for $name; not installing."
  [ "$want" = "$have" ] || die "$name does not match its SHA-256 ($have, expected $want); not installing."
  info "$have"

  step "Unpacking to $current"
  tar -xzf "$tmp/$name" -C "$tmp"
  mkdir -p "$root"
  rm -rf "$root/staging"
  mv "$tmp/${name%.tar.gz}" "$current"
  "$exe" --version >/dev/null 2>&1 || die "$exe does not run on this machine."
fi

step "Linking recn-node into ~/.local/bin"
mkdir -p "$HOME/.local/bin"
ln -sf "$exe" "$HOME/.local/bin/recn-node"
case ":$PATH:" in
  *":$HOME/.local/bin:"*) info "recn-node is on your PATH" ;;
  *) info "Add it to your PATH: echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.$(basename "${SHELL:-bash}")rc" ;;
esac

if [ "$os" = linux ]; then
  if [ -d /run/systemd/system ]; then
    step "Keeping the Node running after you log out"
    if [ "$(loginctl show-user "$(id -un)" -p Linger --value 2>/dev/null)" = yes ]; then
      info "Lingering is already on for $(id -un)"
    elif loginctl enable-linger "$(id -un)" 2>/dev/null || sudo loginctl enable-linger "$(id -un)"; then
      info "loginctl enable-linger $(id -un)"
    else
      info "Could not turn on lingering: the Node stops when you log out. Run: sudo loginctl enable-linger $(id -un)"
    fi
    # `su` and `sudo -u` sessions have no user bus; lingering starts one here.
    export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
    for _ in 1 2 3 4 5 6 7 8 9 10; do [ -S "$XDG_RUNTIME_DIR/bus" ] && break; sleep 0.5; done
  else
    info "No systemd here (a container?): the Node starts at your next desktop login only. The Docker image suits this better: ghcr.io/recn-in/recn-node"
  fi
fi

step "Installing the service"
"$exe" service install | sed 's/^/    /'

step "RECN Node is running"
if [ -n "${SSH_CONNECTION:-}" ] && [ -z "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]; then
  port=$("$exe" status 2>/dev/null | sed -n 's#^http://127\.0\.0\.1:\([0-9]*\)/.*#\1#p' | head -n 1)
  port=${port:-7326}
  cat <<EOF
    The dashboard only listens on this machine. From your own computer:
      ssh -N -L $port:127.0.0.1:$port $(id -un)@<this machine>
    then here:
      recn-node open --no-browser
    and open the URL it prints on your computer within 60 seconds.

    Pair a phone from this terminal:   recn-node invite
    Guide: https://recn.in/guide/node/
EOF
else
  cat <<EOF
    Open the dashboard:   recn-node open
    Pair a phone:         recn-node invite
    Guide: https://recn.in/guide/node/
EOF
fi
