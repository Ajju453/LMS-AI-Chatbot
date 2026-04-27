# ============================================================
# setup_scheduler.ps1
# Registers a Windows Task Scheduler job to run daily_update.py
# every day at a specified time.
# Run once as Administrator:  .\setup_scheduler.ps1
# ============================================================

$ScriptDir    = Split-Path -Parent $MyInvocation.MyCommand.Path
$PsScript     = Join-Path $ScriptDir "daily_update_excel.ps1"
$PowerShellExe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"

# ── Change this to your preferred run time ─────────────────
$RunAt      = "08:00"    # 24-hour format, e.g. "09:00" for 9 AM
# ───────────────────────────────────────────────────────────

$TaskName    = "DailyUpdateExcelReport"
$Description = "Runs daily_update_excel.ps1 to generate today's Excel report"

# Remove old task if it exists
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "[INFO] Old task removed."
}

$Action  = New-ScheduledTaskAction  -Execute $PowerShellExe `
               -Argument "-ExecutionPolicy Bypass -NonInteractive -File `"$PsScript`""
$Trigger = New-ScheduledTaskTrigger -Daily -At $RunAt
$Settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
                                          -StartWhenAvailable `
                                          -RunOnlyIfNetworkAvailable:$false

Register-ScheduledTask `
    -TaskName    $TaskName `
    -Description $Description `
    -Action      $Action `
    -Trigger     $Trigger `
    -Settings    $Settings `
    -RunLevel    Highest `
    -Force

Write-Host ""
Write-Host "[SUCCESS] Task '$TaskName' scheduled to run daily at $RunAt"
Write-Host "          Script : $PsScript"
Write-Host ""
Write-Host "To run immediately:  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "To remove task:      Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
