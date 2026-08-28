param(
  [string]$TaskName = "Arun KS - Refresh Substack posts"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$cygwinBash = "C:\cygwin64\bin\bash.exe"
$cygwinPath = "C:\cygwin64\bin\cygpath.exe"

if (-not (Test-Path -LiteralPath $cygwinBash) -or -not (Test-Path -LiteralPath $cygwinPath)) {
  throw "Cygwin was not found at C:\cygwin64."
}

$windowsScript = Join-Path $PSScriptRoot "sync-substack-and-push.sh"
$cygwinScript = (& $cygwinPath -u $windowsScript).Trim()
if (-not $cygwinScript) {
  throw "Could not convert the updater path for Cygwin."
}

$action = New-ScheduledTaskAction `
  -Execute $cygwinBash `
  -Argument "--login -c `"'$cygwinScript'`"" `
  -WorkingDirectory $repoRoot
$trigger = New-ScheduledTaskTrigger -Daily -At "18:17"
$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Hours 1)

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Refresh the local Substack cache and push a changed cache to GitHub." `
  -Force | Out-Null

Write-Output "Registered '$TaskName' to run daily at 6:17 PM in the Windows account's local time."
Write-Output "The task runs only while this Windows account is logged on."
