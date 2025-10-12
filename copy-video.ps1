# Video File Copy Helper
# Usage: .\copy-video.ps1 "path\to\your\video.mp4" "desired-filename.mp4"

param(
    [Parameter(Mandatory=$true)]
    [string]$SourceVideo,
    
    [Parameter(Mandatory=$true)]
    [string]$TargetFilename
)

$publicVideosPath = ".\public\videos"
$targetPath = Join-Path $publicVideosPath $TargetFilename

# Create videos directory if it doesn't exist
if (!(Test-Path $publicVideosPath)) {
    New-Item -ItemType Directory -Path $publicVideosPath -Force
    Write-Host "Created videos directory: $publicVideosPath" -ForegroundColor Green
}

# Check if source file exists
if (!(Test-Path $SourceVideo)) {
    Write-Host "Error: Source video file not found: $SourceVideo" -ForegroundColor Red
    exit 1
}

# Copy the file
try {
    Copy-Item -Path $SourceVideo -Destination $targetPath -Force
    Write-Host "✅ Video copied successfully!" -ForegroundColor Green
    Write-Host "   From: $SourceVideo" -ForegroundColor Cyan
    Write-Host "   To:   $targetPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run: firebase deploy --only hosting" -ForegroundColor White
    Write-Host "2. Your video will be live at: /videos/$TargetFilename" -ForegroundColor White
} catch {
    Write-Host "Error copying file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}