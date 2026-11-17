# CI-only Windows UI Automation probe. Never reads user task content.
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][ValidateRange(1,2147483647)][int]$TargetProcessId,
  [string]$ScreenshotPath = ""
)
$ErrorActionPreference="Stop"
$r=@{
  method="Windows UI Automation"; status="NOT VERIFIED"
  windowFound=$false; homeHeaderVisible=$false
  homeTabFound=$false; tasksTabFound=$false; settingsTabFound=$false
  tasksTabVisible=$false; settingsTabVisible=$false; desktopWorkAreaBottom=0
  tasksTabBottom=0; settingsTabBottom=0
  documentControlPresent=$false; windowWidth=0; windowHeight=0
  snapshot="not_requested"; reason="unknown"; paintSummary="unavailable"; layerSummary="unavailable"
  sceneSummary="unavailable"
  chainSummary="unavailable"
}
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
      $r.windowWidth=[int]$bounds.Width
      $r.windowHeight=[int]$bounds.Height
      $r.homeTabFound=($null -ne $w.FindFirst(
        [System.Windows.Automation.TreeScope]::Descendants,
        [System.Windows.Automation.PropertyCondition]::new(
          [System.Windows.Automation.AutomationElement]::NameProperty,"Home")))
      $tasksElement=$w.FindFirst(
        [System.Windows.Automation.TreeScope]::Descendants,
        [System.Windows.Automation.PropertyCondition]::new(
          [System.Windows.Automation.AutomationElement]::NameProperty,"Tasks"))
      $settingsElement=$w.FindFirst(
        [System.Windows.Automation.TreeScope]::Descendants,
        [System.Windows.Automation.PropertyCondition]::new(
          [System.Windows.Automation.AutomationElement]::NameProperty,"Settings"))
      $r.tasksTabFound=($null -ne $tasksElement)
      $r.settingsTabFound=($null -ne $settingsElement)
      Add-Type -AssemblyName System.Windows.Forms
      $workArea=[System.Windows.Forms.Screen]::FromHandle($hwnd).WorkingArea
      $r.desktopWorkAreaBottom=[int]$workArea.Bottom
      if($null -ne $tasksElement) {
        $tasksBounds=$tasksElement.Current.BoundingRectangle
        $r.tasksTabBottom=[int]$tasksBounds.Bottom
        $r.tasksTabVisible=($tasksBounds.Width -ge 15 -and
          $tasksBounds.Height -ge 8 -and
          $tasksBounds.Top -ge $workArea.Top -and
          $tasksBounds.Bottom -le $workArea.Bottom -and
          -not $tasksElement.Current.IsOffscreen)
      }
      if($null -ne $settingsElement) {
        $settingsBounds=$settingsElement.Current.BoundingRectangle
        $r.settingsTabBottom=[int]$settingsBounds.Bottom
        $r.settingsTabVisible=($settingsBounds.Width -ge 15 -and
          $settingsBounds.Height -ge 8 -and
          $settingsBounds.Top -ge $workArea.Top -and
          $settingsBounds.Bottom -le $workArea.Bottom -and
          -not $settingsElement.Current.IsOffscreen)
      }
      $r.documentControlPresent=($null -ne $w.FindFirst(
        [System.Windows.Automation.TreeScope]::Descendants,
        [System.Windows.Automation.PropertyCondition]::new(
          [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
          [System.Windows.Automation.ControlType]::Document)))
      $cond=[System.Windows.Automation.PropertyCondition]::new(
        [System.Windows.Automation.AutomationElement]::NameProperty, "Stay productive")
      $h=$w.FindFirst([System.Windows.Automation.TreeScope]::Descendants,$cond)
      if($null -ne $h) {
        $rect=$h.Current.BoundingRectangle
        $r.homeHeaderVisible=($rect.Width -ge 20 -and $rect.Height -ge 8 -and -not $h.Current.IsOffscreen)
      }
      # Query button accessibility names only in this fresh CI profile and
      # retain only the single fixed-prefix technical summary.
      $buttonCondition=[System.Windows.Automation.PropertyCondition]::new(
        [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
        [System.Windows.Automation.ControlType]::Button)
      $buttons=$w.FindAll([System.Windows.Automation.TreeScope]::Descendants,$buttonCondition)
      for($i=0;$i -lt [Math]::Min($buttons.Count,160);$i++) {
        $candidate=$buttons.Item($i).Current.Name
        if($candidate -and $candidate.StartsWith("METODO-PAINT ")) {
          $r.paintSummary=$candidate.Substring(0,[Math]::Min($candidate.Length,300))
          continue
        }
        if($candidate -and $candidate.StartsWith("METODO-LAYER ")) {
          $r.layerSummary=$candidate.Substring(0,[Math]::Min($candidate.Length,300))
          continue
        }
        if($candidate -and $candidate.StartsWith("METODO-SCENE ")) {
          $r.sceneSummary=$candidate.Substring(0,[Math]::Min($candidate.Length,400))
          continue
        }
        if($candidate -and $candidate.StartsWith("METODO-CHAIN ")) {
          $r.chainSummary=$candidate.Substring(0,[Math]::Min($candidate.Length,500))
        }
      }

      # CI runner uses a fresh empty profile. Capture only its native test window
      # when content is not verified; never capture a developer's existing tasks.
      if($ScreenshotPath -and $env:GITHUB_ACTIONS -eq "true" -and
         $r.windowFound) {
        try {
          Add-Type -AssemblyName System.Drawing
          $captureWidth=[Math]::Min([int]$bounds.Width,1400)
          $captureHeight=[Math]::Min([int]$bounds.Height,1000)
          $bitmap=[System.Drawing.Bitmap]::new($captureWidth,$captureHeight)
          $graphics=[System.Drawing.Graphics]::FromImage($bitmap)
          try {
            $graphics.CopyFromScreen([int]$bounds.Left,[int]$bounds.Top,0,0,$bitmap.Size)
            $bitmap.Save($ScreenshotPath,[System.Drawing.Imaging.ImageFormat]::Png)
            $r.snapshot="saved_in_ephemeral_ci"
          } finally {
            $graphics.Dispose()
            $bitmap.Dispose()
          }
        } catch {
          $r.snapshot="capture_unavailable"
        }
      }
      if($r.windowFound -and $r.homeHeaderVisible -and
         $r.tasksTabVisible -and $r.settingsTabVisible) {
        $r.status="PASS"
        $r.reason="native_home_and_tabs_visible"
      } elseif($r.windowFound -and $r.homeHeaderVisible) {
        $r.reason="home_visible_but_tabs_outside_work_area"
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
