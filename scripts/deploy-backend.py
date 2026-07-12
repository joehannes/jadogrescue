#!/usr/bin/env python3
"""
Deploy / redeploy the standalone Printify proxy (../server) to a free host.

WHEN YOU NEED THIS
------------------
Only if you host the backend SEPARATELY from the frontend. If your site is on
Cloudflare Pages, you almost certainly do NOT need this script: the proxy lives
in ../functions and Cloudflare deploys it together with the frontend on every
`git push` (or `npx wrangler pages deploy dist`). There is no separate backend
to push, so there is nothing for this script to do in that setup.

WHAT THIS DOES
--------------
Triggers a deploy of the ../server app on Render (https://render.com), whose
free tier runs a small web service. Render builds from your connected Git repo,
so "deploying an update" means: push your code, then trigger a build. This
script triggers that build one of two ways:

  1. Render API   (preferred) — set RENDER_API_KEY and RENDER_SERVICE_ID
  2. Deploy Hook  (simplest)  — set RENDER_DEPLOY_HOOK_URL

One-time setup (see ../MERCH_SETUP.md for detail):
  * Create a Render "Web Service" from this repo, root directory = `server`,
    build `npm install`, start `npm start`.
  * Add env var PRINTIFY_API_TOKEN (and optionally ALLOWED_ORIGIN) in Render.
  * Grab either an API key + the service id (srv-...), or a Deploy Hook URL.

Usage:
  export RENDER_API_KEY=rnd_xxx RENDER_SERVICE_ID=srv_xxx
  python3 scripts/deploy-backend.py            # trigger + wait for result

  # or, with a deploy hook:
  export RENDER_DEPLOY_HOOK_URL="https://api.render.com/deploy/srv-...?key=..."
  python3 scripts/deploy-backend.py

Requires only the Python standard library.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

RENDER_API = "https://api.render.com/v1"


def _request(method, url, token=None, data=None):
    headers = {"Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = None
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode()
            return resp.status, (json.loads(raw) if raw.strip() else {})
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        return e.code, {"error": raw}


def deploy_via_hook(hook_url):
    print("Triggering deploy via Render deploy hook...")
    status, _ = _request("POST", hook_url)
    if 200 <= status < 300:
        print("✓ Deploy triggered. Watch progress in the Render dashboard.")
        return 0
    print(f"✗ Deploy hook failed (HTTP {status}).")
    return 1


def deploy_via_api(api_key, service_id, wait=True):
    print(f"Triggering deploy for service {service_id} via Render API...")
    status, body = _request(
        "POST", f"{RENDER_API}/services/{service_id}/deploys", token=api_key, data={"clearCache": "do_not_clear"}
    )
    if status not in (200, 201):
        print(f"✗ Failed to start deploy (HTTP {status}): {body.get('error', body)}")
        return 1
    deploy_id = body.get("id")
    print(f"✓ Deploy {deploy_id} started (status: {body.get('status')}).")
    if not wait or not deploy_id:
        return 0

    terminal_ok = {"live"}
    terminal_bad = {"build_failed", "update_failed", "canceled", "deactivated", "pre_deploy_failed"}
    print("Waiting for build to finish (Ctrl-C to stop watching)...")
    for _ in range(120):  # ~10 min max
        time.sleep(5)
        status, body = _request("GET", f"{RENDER_API}/services/{service_id}/deploys/{deploy_id}", token=api_key)
        state = body.get("status", "unknown")
        print(f"  … {state}")
        if state in terminal_ok:
            print("✓ Deploy live.")
            return 0
        if state in terminal_bad:
            print(f"✗ Deploy ended: {state}")
            return 1
    print("• Still building after timeout — check the Render dashboard.")
    return 0


def main():
    hook = os.environ.get("RENDER_DEPLOY_HOOK_URL")
    api_key = os.environ.get("RENDER_API_KEY")
    service_id = os.environ.get("RENDER_SERVICE_ID")

    if api_key and service_id:
        return deploy_via_api(api_key, service_id)
    if hook:
        return deploy_via_hook(hook)

    print(
        "No deploy credentials found.\n"
        "Set either RENDER_API_KEY + RENDER_SERVICE_ID, or RENDER_DEPLOY_HOOK_URL.\n"
        "If your backend is a Cloudflare Pages Function, you don't need this script —\n"
        "it deploys with your site. See MERCH_SETUP.md."
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
