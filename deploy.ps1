#!/usr/bin/env pwsh
# ═══════════════════════════════════════════════════════════════
#  Origenix — Full Global Deploy Script
#  Google Cloud Run (backend) + Firebase Hosting (frontend)
#  Usage: .\deploy.ps1
# ═══════════════════════════════════════════════════════════════

param(
  [string]$ProjectId   = "origenix-app",        # Your GCP project ID
  [string]$Region      = "us-central1",          # Cloud Run region
  [string]$ServiceName = "origenix-backend",     # Cloud Run service name
  [string]$MongoUri    = $env:MONGO_URI,         # MongoDB Atlas URI
  [string]$JwtSecret   = $env:JWT_SECRET         # JWT secret
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Origenix Global Deploy — Google Cloud  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Pre-flight checks ──────────────────────────────────────────
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  Write-Host "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
  exit 1
}

if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Firebase CLI not found. Run: npm install -g firebase-tools" -ForegroundColor Red
  exit 1
}

if (-not $MongoUri) {
  Write-Host "❌ MONGO_URI not set. Pass it as param or set env var." -ForegroundColor Red
  exit 1
}

if (-not $JwtSecret) {
  Write-Host "❌ JWT_SECRET not set. Pass it as param or set env var." -ForegroundColor Red
  exit 1
}

Write-Host "✅ All prerequisites met" -ForegroundColor Green
Write-Host ""

# ── Step 1: Set GCP Project ────────────────────────────────────
Write-Host "📌 Step 1/6 — Setting GCP project to: $ProjectId" -ForegroundColor Cyan
gcloud config set project $ProjectId

# ── Step 2: Enable required GCP APIs ──────────────────────────
Write-Host ""
Write-Host "🔧 Step 2/6 — Enabling Cloud APIs..." -ForegroundColor Cyan
gcloud services enable `
  run.googleapis.com `
  cloudbuild.googleapis.com `
  containerregistry.googleapis.com `
  artifactregistry.googleapis.com

# ── Step 3: Build & Push backend Docker image ──────────────────
Write-Host ""
Write-Host "🐳 Step 3/6 — Building & pushing Docker image..." -ForegroundColor Cyan

$ImageTag = "gcr.io/$ProjectId/$ServiceName`:latest"

Set-Location "backend"
gcloud builds submit --tag $ImageTag .
Set-Location ".."

Write-Host "✅ Image pushed: $ImageTag" -ForegroundColor Green

# ── Step 4: Deploy to Cloud Run ────────────────────────────────
Write-Host ""
Write-Host "🚀 Step 4/6 — Deploying to Cloud Run ($Region)..." -ForegroundColor Cyan

gcloud run deploy $ServiceName `
  --image $ImageTag `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --set-env-vars "NODE_ENV=production,MONGO_URI=$MongoUri,JWT_SECRET=$JwtSecret,PORT=8080"

# Get the Cloud Run URL
$BackendUrl = gcloud run services describe $ServiceName `
  --platform managed `
  --region $Region `
  --format "value(status.url)"

Write-Host ""
Write-Host "✅ Backend live at: $BackendUrl" -ForegroundColor Green

# ── Step 5: Build frontend ─────────────────────────────────────
Write-Host ""
Write-Host "⚡ Step 5/6 — Building frontend with production API URL..." -ForegroundColor Cyan

Set-Location "frontend"

# Write the real backend URL into .env.production
"VITE_API_BASE_URL=$BackendUrl" | Set-Content .env.production

npm run build

Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# ── Step 6: Deploy frontend to Firebase Hosting ────────────────
Write-Host ""
Write-Host "🌐 Step 6/6 — Deploying frontend to Firebase Hosting..." -ForegroundColor Cyan

firebase use $ProjectId
firebase deploy --only hosting

Set-Location ".."

# ── Done ───────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║        🎉  DEPLOY COMPLETE!              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend  → https://$ProjectId.web.app" -ForegroundColor Cyan
Write-Host "⚙️  Backend   → $BackendUrl" -ForegroundColor Cyan
Write-Host "📊 GCP Console → https://console.cloud.google.com/run?project=$ProjectId" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Connect custom domain: Firebase Console → Hosting → Add custom domain"
Write-Host "  • Update CORS in backend/src/index.ts with your Firebase URL"
Write-Host "  • Set up MongoDB Atlas IP whitelist: 0.0.0.0/0 for Cloud Run"
