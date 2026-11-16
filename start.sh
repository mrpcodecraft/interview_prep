#!/usr/bin/env bash
# Installs dependencies for both the backend and frontend, then runs them together.
# Usage:
#   ./start.sh
# Stop both with Ctrl+C.

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

echo "==> Installing server dependencies..."
(cd "$SERVER_DIR" && npm install)

echo "==> Installing client dependencies..."
(cd "$CLIENT_DIR" && npm install)

# Make sure both background processes are killed when this script exits
# (Ctrl+C, error, or normal exit).
cleanup() {
  echo ""
  echo "==> Shutting down..."
  kill "$SERVER_PID" "$CLIENT_PID" 2>/dev/null || true
  wait "$SERVER_PID" "$CLIENT_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM  

echo "==> Starting backend (http://localhost:4000)..."
(cd "$SERVER_DIR" && npm start) &
SERVER_PID=$!

echo "==> Starting frontend (http://localhost:5173)..."
(cd "$CLIENT_DIR" && npm run dev) &
CLIENT_PID=$!

echo ""
echo "Both servers running. Open http://localhost:5173 in your browser."
echo "Press Ctrl+C to stop both."

wait "$SERVER_PID" "$CLIENT_PID"