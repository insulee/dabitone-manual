# DabitOne Manual — auto-deploy watcher
# Watches site source changes and runs deploy.sh.
# Usage: pwsh -ExecutionPolicy Bypass -File scripts/auto-deploy.ps1

$repoRoot      = "D:\GitHub\dabitone-manual"
$deployScript  = Join-Path $repoRoot "scripts\deploy.sh"
$logFile       = Join-Path $repoRoot "scripts\auto-deploy-log.txt"
$pollSeconds     = 30
$debounceSeconds = 60

$watchPaths = @(
    "content",
    "tour",
    "quartz",
    "scripts",
    ".github\workflows",
    "package.json",
    "package-lock.json",
    "quartz.config.ts",
    "quartz.layout.ts",
    "README.md"
)

$excludePathParts = @(
    "\.git\",
    "\node_modules\",
    "\public\",
    "\quartz\static\",
    "\verify-compare\",
    "\verify-hotspots\",
    "\verify-links\",
    "\verify-routes\",
    "\verify-scroll\"
)

$excludeFiles = @(
    (Join-Path $repoRoot "scripts\auto-deploy-log.txt"),
    (Join-Path $repoRoot "tsconfig.tsbuildinfo")
)

$script:lastDeploy   = [datetime]::MinValue
$script:lastSnapshot = @{}

function Write-Log($msg) {
    $entry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $msg"
    Add-Content -Path $logFile -Value $entry -Encoding UTF8
}

function Test-WatchedFile($path) {
    $full = [System.IO.Path]::GetFullPath($path)
    if ($excludeFiles -contains $full) {
        return $false
    }
    foreach ($part in $excludePathParts) {
        if ($full -like "*$part*") {
            return $false
        }
    }
    return $true
}

function Add-FileToSnapshot($snapshot, $file) {
    if (-not (Test-WatchedFile $file.FullName)) {
        return
    }
    $snapshot[$file.FullName] = "$($file.LastWriteTimeUtc.ToString("o"))|$($file.Length)"
}

function Get-FileSnapshot {
    $snapshot = @{}
    foreach ($watchPath in $watchPaths) {
        $resolved = Join-Path $repoRoot $watchPath
        if (-not (Test-Path $resolved)) {
            continue
        }
        $item = Get-Item -LiteralPath $resolved -ErrorAction SilentlyContinue
        if ($null -eq $item) {
            continue
        }
        if ($item.PSIsContainer) {
            Get-ChildItem -LiteralPath $item.FullName -File -Recurse -ErrorAction SilentlyContinue |
                ForEach-Object { Add-FileToSnapshot $snapshot $_ }
        } else {
            Add-FileToSnapshot $snapshot $item
        }
    }
    return $snapshot
}

function Invoke-Deploy {
    $script:lastDeploy = Get-Date
    Write-Log "Deploy started"
    try {
        $result = & "C:\Program Files\Git\bin\bash.exe" $deployScript 2>&1
        $output = $result -join "`n"
        if ($output -match "배포 완료" -or $output -match "변경 없음") {
            Write-Log "Deploy completed: $($output.Substring(0, [Math]::Min(200, $output.Length)))"
        } else {
            Write-Log "Deploy result: $($output.Substring(0, [Math]::Min(400, $output.Length)))"
        }
    } catch {
        Write-Log "Deploy error: $_"
    }
}

$script:lastSnapshot = Get-FileSnapshot
Write-Log "Auto-deploy watcher started: $repoRoot"

while ($true) {
    Start-Sleep -Seconds $pollSeconds
    $currentSnapshot = Get-FileSnapshot
    $changed = $false

    foreach ($key in $currentSnapshot.Keys) {
        if (-not $script:lastSnapshot.ContainsKey($key) -or $script:lastSnapshot[$key] -ne $currentSnapshot[$key]) {
            $changed = $true
            Write-Log "Change detected: $key"
            break
        }
    }
    if (-not $changed) {
        foreach ($key in $script:lastSnapshot.Keys) {
            if (-not $currentSnapshot.ContainsKey($key)) {
                $changed = $true
                Write-Log "Deleted: $key"
                break
            }
        }
    }

    if ($changed) {
        $elapsed = (Get-Date) - $script:lastDeploy
        $script:lastSnapshot = $currentSnapshot
        if ($elapsed.TotalSeconds -ge $debounceSeconds) {
            Invoke-Deploy
        }
    }
}
