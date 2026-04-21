# DabitOne Manual — auto-deploy watcher
# Polls content/ for .md changes and runs deploy.sh
# Usage: pwsh -ExecutionPolicy Bypass -File scripts/auto-deploy.ps1

$watchPath     = "D:\GitHub\dabitone-manual\content"
$deployScript  = "D:\GitHub\dabitone-manual\scripts\deploy.sh"
$logFile       = "D:\GitHub\dabitone-manual\scripts\auto-deploy-log.txt"
$pollSeconds     = 30
$debounceSeconds = 60

$script:lastDeploy   = [datetime]::MinValue
$script:lastSnapshot = @{}

function Write-Log($msg) {
    $entry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $msg"
    Add-Content -Path $logFile -Value $entry -Encoding UTF8
}

function Get-FileSnapshot {
    $snapshot = @{}
    Get-ChildItem -Path $watchPath -Filter "*.md" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
        $snapshot[$_.FullName] = $_.LastWriteTime.ToString("o")
    }
    return $snapshot
}

function Invoke-Deploy {
    $script:lastDeploy = Get-Date
    Write-Log "Deploy started"
    try {
        $result = & "C:\Program Files\Git\bin\bash.exe" $deployScript 2>&1
        $output = $result -join "`n"
        if ($output -match "Done" -or $output -match "완료") {
            Write-Log "Deploy completed"
        } else {
            Write-Log "Deploy result: $($output.Substring(0, [Math]::Min(200, $output.Length)))"
        }
    } catch {
        Write-Log "Deploy error: $_"
    }
}

$script:lastSnapshot = Get-FileSnapshot
Write-Log "Auto-deploy watcher started: $watchPath"

while ($true) {
    Start-Sleep -Seconds $pollSeconds
    $currentSnapshot = Get-FileSnapshot
    $changed = $false

    foreach ($key in $currentSnapshot.Keys) {
        if (-not $script:lastSnapshot.ContainsKey($key) -or $script:lastSnapshot[$key] -ne $currentSnapshot[$key]) {
            $changed = $true
            Write-Log "Change detected: $(Split-Path $key -Leaf)"
            break
        }
    }
    if (-not $changed) {
        foreach ($key in $script:lastSnapshot.Keys) {
            if (-not $currentSnapshot.ContainsKey($key)) {
                $changed = $true
                Write-Log "Deleted: $(Split-Path $key -Leaf)"
                break
            }
        }
    }

    if ($changed) {
        $elapsed = (Get-Date) - $script:lastDeploy
        if ($elapsed.TotalSeconds -ge $debounceSeconds) {
            $script:lastSnapshot = $currentSnapshot
            Invoke-Deploy
        } else {
            $script:lastSnapshot = $currentSnapshot
        }
    }
}

