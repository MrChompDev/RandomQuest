# Submitting via GitHub + Vercel

This guide walks you through pushing the project to GitHub and deploying the frontend to Vercel.

## 1) Push the project to GitHub

From the project root:

```powershell
git status
git add .
git commit -m "Prepare Random Quest for submission"
```

If the repo is not yet connected to GitHub:

```powershell
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

If the repo already has a GitHub remote:

```powershell
git push
```

## 2) Deploy the frontend to Vercel

1. Sign in to Vercel.
2. Click **New Project** and import your GitHub repo.
3. Set the **Root Directory** to `frontend/`.
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → your backend API base URL, e.g. `https://<your-backend-host>/api`
5. Click **Deploy**.

Vercel will auto-deploy on every push to `main`.

## 3) (Optional) Deploy the backend

You can deploy the Flask API to any platform that runs Python (Railway, Render, Fly.io, etc.).

Required environment variables:

- `OpenRouter_API_KEY` (preferred)
- `ANTHROPIC_API_KEY` (fallback if OpenRouter key is not set)

Make sure the backend is reachable publicly and update `NEXT_PUBLIC_API_URL` in Vercel to point to it.

## 4) Submission checklist

- GitHub repo is public or shared with judges
- Vercel URL loads the frontend
- Backend URL is reachable and `/api/health` returns `ok`
- `NEXT_PUBLIC_API_URL` points to the backend

