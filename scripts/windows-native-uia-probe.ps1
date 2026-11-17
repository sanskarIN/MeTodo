# CI-only Windows UI Automation probe. Never reads user task content.
[CmdletBinding()]
param([Parameter(Mandatory=$true)][ValidateRange(1,2147483647)][int]$TargetProcessId)
$ErrorActionPreference="Stop"
$r=@{ method="Windows UI Automation"; status="NOT VERIFIED"; windowFound=$false; homeHeaderVisible=$false; reason="unknown" }
try {
  Add-Type -AssemblyName UIAutomationClient
  Add-Type -AssemblyName UIAutomationTypes
  $p=Get-Process -Id $TargetProcessId -ErrorAction Stop
  $hwnd=[IntPtr]::Zero
  for($i=0;$i -lt 15;$i++) {
    $p.Refresh()
    $hwnd=$p.MainWindowHandle
    if($hwnd -ne [IntPtr]::Zero) {break}
    Start-Sleep -Milliseconds 600
  }
  if($hwnd -eq [IntPtr]::Zero) {
    $r.reason="no_native_window_handle"
  } else {
    $w=[System.Windows.Automation.AutomationElement]::FromHandle($hwnd)
    if($null -eq $w) {
      $r.reason="native_window_missing_in_accessibility_tree"
    } else {
      $bounds=$w.Current.BoundingRectangle
      $r.windowFound=($bounds.Width -ge 300 -and $bounds.Height -ge 200)
      $cond=[System.Windows.Automation.PropertyCondition]::new(
        [System.Windows.Automation.AutomationElement]::NameProperty, "Stay productive")
      $h=$w.FindFirst([System.Windows.Automation.TreeScope]::Descendants,$cond)
      if($null -ne $h) {
        $rect=$h.Current.BoundingRectangle
        $r.homeHeaderVisible=($rect.Width -ge 20 -and $rect.Height -ge 8 -and -not $h.Current.IsOffscreen)
      }
      if($r.windowFound -and $r.homeHeaderVisible) {
        $r.status="PASS"
        $r.reason="native_home_header_visible"
      } elseif($r.windowFound) {
        $r.reason="home_header_not_exposed_or_invisible"
      } else {
        $r.reason="native_window_without_visible_bounds"
      }
    }
  }
} catch {
  # Only an exception type; no user paths, task names or command lines.
  $r.reason="uia_"+$_.Exception.GetType().Name
}
$r | ConvertTo-Json -Compress
