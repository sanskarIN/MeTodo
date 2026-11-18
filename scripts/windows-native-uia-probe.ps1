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
  tasksScreenVisible=$false; settingsScreenVisible=$false
  homeRoundtripVisible=$false; navigationAttempted=$false
  resizeAttempted=$false; resizeWindowChanged=$false
  resizeHomeVisible=$false; resizeTabsVisible=$false
  resizedWidth=0; resizedHeight=0
  createEntryVisible=$false; createScreenVisible=$false
  syntheticTaskInputFound=$false; syntheticTaskTyped=$false
  syntheticTaskSaveFound=$false; syntheticTaskSaveClicked=$false
  syntheticTaskReturnedHome=$false; syntheticTaskVisibleInTasks=$false
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
      # CI-only interaction against a fresh empty Windows profile. Clicking
      # fixed navigation labels never reads, mutates or exposes task content.
      if($env:GITHUB_ACTIONS -eq "true" -and
         $r.windowFound -and $r.homeHeaderVisible -and
         $r.tasksTabVisible -and $r.settingsTabVisible) {
        $r.navigationAttempted=$true
        $mouseSource = @'
using System;
using System.Runtime.InteropServices;
public static class MeTodoCIMouse {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hwnd);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern bool MoveWindow(
    IntPtr hwnd, int x, int y, int width, int height, bool repaint);
  [DllImport("user32.dll")] public static extern void mouse_event(
    uint flags, uint x, uint y, uint data, UIntPtr extraInfo);
}
'@
        Add-Type -TypeDefinition $mouseSource -Language CSharp
        function Click-CITab([int]$x,[int]$y) {
          [MeTodoCIMouse]::SetForegroundWindow($hwnd) | Out-Null
          [MeTodoCIMouse]::SetCursorPos($x,$y) | Out-Null
          Start-Sleep -Milliseconds 120
          [MeTodoCIMouse]::mouse_event([uint32]2,0,0,0,[UIntPtr]::Zero)
          Start-Sleep -Milliseconds 100
          [MeTodoCIMouse]::mouse_event([uint32]4,0,0,0,[UIntPtr]::Zero)
          Start-Sleep -Milliseconds 1300
        }
        function StaticHeadingVisible([string]$label) {
          $cond=[System.Windows.Automation.PropertyCondition]::new(
            [System.Windows.Automation.AutomationElement]::NameProperty,$label)
          $element=$w.FindFirst([System.Windows.Automation.TreeScope]::Descendants,$cond)
          if($null -eq $element) { return $false }
          $rect=$element.Current.BoundingRectangle
          return ($rect.Width -ge 20 -and $rect.Height -ge 8 -and
            -not $element.Current.IsOffscreen -and
            $rect.Bottom -le $workArea.Bottom)
        }
        # Resize the actual Tauri window before checking tab navigation. This
        # catches the collapsed-screen regression after a native size change.
        # Only fixed public headings, tab positions, and geometry are inspected.
        $r.resizeAttempted=$true
        $targetWidth=[int][Math]::Min(880,[int]$bounds.Width-70)
        $targetHeight=[int][Math]::Min(620,[int]$bounds.Height-45)
        if($targetWidth -ge 700 -and $targetHeight -ge 590) {
          if([MeTodoCIMouse]::MoveWindow($hwnd,[int]$bounds.Left,
               [int]$bounds.Top,$targetWidth,$targetHeight,$true)) {
            Start-Sleep -Milliseconds 1900
            $w=[System.Windows.Automation.AutomationElement]::FromHandle($hwnd)
            $resizedBounds=$w.Current.BoundingRectangle
            $r.resizedWidth=[int]$resizedBounds.Width
            $r.resizedHeight=[int]$resizedBounds.Height
            $r.resizeWindowChanged=(
              $resizedBounds.Width -le $bounds.Width-30 -and
              $resizedBounds.Height -le $bounds.Height-20)
            $r.resizeHomeVisible=StaticHeadingVisible "Stay productive"
            $tasksElement=$w.FindFirst(
              [System.Windows.Automation.TreeScope]::Descendants,
              [System.Windows.Automation.PropertyCondition]::new(
                [System.Windows.Automation.AutomationElement]::NameProperty,"Tasks"))
            $settingsElement=$w.FindFirst(
              [System.Windows.Automation.TreeScope]::Descendants,
              [System.Windows.Automation.PropertyCondition]::new(
                [System.Windows.Automation.AutomationElement]::NameProperty,"Settings"))
            if($null -ne $tasksElement -and $null -ne $settingsElement) {
              $tasksBounds=$tasksElement.Current.BoundingRectangle
              $settingsBounds=$settingsElement.Current.BoundingRectangle
              $r.resizeTabsVisible=(
                $tasksBounds.Width -ge 15 -and $tasksBounds.Height -ge 8 -and
                $settingsBounds.Width -ge 15 -and $settingsBounds.Height -ge 8 -and
                $tasksBounds.Bottom -le $workArea.Bottom -and
                $settingsBounds.Bottom -le $workArea.Bottom -and
                $tasksBounds.Top -ge $workArea.Top -and
                $settingsBounds.Top -ge $workArea.Top -and
                -not $tasksElement.Current.IsOffscreen -and
                -not $settingsElement.Current.IsOffscreen)
              $bounds=$resizedBounds
            }
          }
        }
        # Never click stale tab coordinates if the resize gate failed.
        if($r.resizeWindowChanged -and $r.resizeHomeVisible -and
           $r.resizeTabsVisible) {
        $tasksX=[int][Math]::Round($tasksBounds.Left+$tasksBounds.Width/2)
        $settingsX=[int][Math]::Round($settingsBounds.Left+$settingsBounds.Width/2)
        $tabsY=[int][Math]::Round($tasksBounds.Top+$tasksBounds.Height/2)
        $homeX=[int][Math]::Round($bounds.Left+$bounds.Width/8)
        Click-CITab $tasksX $tabsY
        $r.tasksScreenVisible=StaticHeadingVisible "Manage your tasks"
        Click-CITab $settingsX $tabsY
        $r.settingsScreenVisible=StaticHeadingVisible "Customize your experience"
        Click-CITab $homeX $tabsY
        $r.homeRoundtripVisible=StaticHeadingVisible "Stay productive"
        # Verify that task creation can be opened from the native Home
        # dashboard. This route-only test never creates a persistent task.
        if($r.homeRoundtripVisible) {
          $createCondition=[System.Windows.Automation.PropertyCondition]::new(
            [System.Windows.Automation.AutomationElement]::NameProperty,
            "+ Create New Task")
          $createEntry=$w.FindFirst(
            [System.Windows.Automation.TreeScope]::Descendants,$createCondition)
          if($null -ne $createEntry) {
            $createBounds=$createEntry.Current.BoundingRectangle
            $r.createEntryVisible=($createBounds.Width -ge 30 -and
              $createBounds.Height -ge 8 -and -not $createEntry.Current.IsOffscreen)
            if($r.createEntryVisible) {
              # Stay to the left of the temporary diagnostic overlay.
              $createX=[int][Math]::Min(
                [Math]::Round($createBounds.Left+10), $bounds.Left+440)
              $createY=[int][Math]::Round(
                $createBounds.Top+$createBounds.Height/2)
              Click-CITab $createX $createY
              $r.createScreenVisible=StaticHeadingVisible "Create Task"
              # Synthetic, fixed-content functional test in the disposable
              # GitHub Actions profile ONLY. Never enumerate task titles or
              # touch user backup files, storage keys, or task data.
              if($r.createScreenVisible) {
                $ciTitle="MeTodo CI Smoke Task"
                $inputCondition=[System.Windows.Automation.AndCondition]::new(
                  [System.Windows.Automation.PropertyCondition]::new(
                    [System.Windows.Automation.AutomationElement]::NameProperty,
                    "Task title"),
                  [System.Windows.Automation.PropertyCondition]::new(
                    [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
                    [System.Windows.Automation.ControlType]::Edit))
                $ciInput=$w.FindFirst(
                  [System.Windows.Automation.TreeScope]::Descendants,$inputCondition)
                if($null -ne $ciInput) {
                  $inputBounds=$ciInput.Current.BoundingRectangle
                  $r.syntheticTaskInputFound=(
                    $inputBounds.Width -ge 100 -and
                    $inputBounds.Height -ge 20 -and
                    -not $ciInput.Current.IsOffscreen)
                  if($r.syntheticTaskInputFound) {
                    $inputX=[int][Math]::Round(
                      $inputBounds.Left+$inputBounds.Width/2)
                    $inputY=[int][Math]::Round(
                      $inputBounds.Top+$inputBounds.Height/2)
                    Click-CITab $inputX $inputY
                    [System.Windows.Forms.SendKeys]::SendWait($ciTitle)
                    Start-Sleep -Milliseconds 400
                    $r.syntheticTaskTyped=$true
                    $saveCondition=[System.Windows.Automation.AndCondition]::new(
                      [System.Windows.Automation.PropertyCondition]::new(
                        [System.Windows.Automation.AutomationElement]::NameProperty,
                        "Save new task"),
                      [System.Windows.Automation.PropertyCondition]::new(
                        [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
                        [System.Windows.Automation.ControlType]::Button))
                    $ciSave=$w.FindFirst(
                      [System.Windows.Automation.TreeScope]::Descendants,
                      $saveCondition)
                    $r.syntheticTaskSaveFound=($null -ne $ciSave)
                    if($null -ne $ciSave) {
                      # Scroll the known save button into view using the
                      # accessibility provider; never guess hidden coordinates.
                      $scrollItem=$null
                      if($ciSave.TryGetCurrentPattern(
                          [System.Windows.Automation.ScrollItemPattern]::Pattern,
                          [ref]$scrollItem)) {
                        $scrollItem.ScrollIntoView()
                        Start-Sleep -Milliseconds 350
                      }
                      $saveBounds=$ciSave.Current.BoundingRectangle
                      $clickable=(
                        -not $ciSave.Current.IsOffscreen -and
                        $saveBounds.Width -ge 40 -and
                        $saveBounds.Height -ge 20 -and
                        $saveBounds.Top -ge $workArea.Top -and
                        $saveBounds.Bottom -le $workArea.Bottom)
                      if($clickable) {
                        $saveX=[int][Math]::Round(
                          $saveBounds.Left+$saveBounds.Width/2)
                        $saveY=[int][Math]::Round(
                          $saveBounds.Top+$saveBounds.Height/2)
                        Click-CITab $saveX $saveY
                        $r.syntheticTaskSaveClicked=$true
                        $r.syntheticTaskReturnedHome=StaticHeadingVisible "Stay productive"
                        if($r.syntheticTaskReturnedHome) {
                          Click-CITab $tasksX $tabsY
                          if(StaticHeadingVisible "Manage your tasks") {
                            $syntheticLabel=$w.FindFirst(
                              [System.Windows.Automation.TreeScope]::Descendants,
                              [System.Windows.Automation.PropertyCondition]::new(
                                [System.Windows.Automation.AutomationElement]::NameProperty,
                                $ciTitle))
                            if($null -ne $syntheticLabel) {
                              $labelBounds=$syntheticLabel.Current.BoundingRectangle
                              $r.syntheticTaskVisibleInTasks=(
                                $labelBounds.Width -ge 40 -and
                                $labelBounds.Height -ge 8 -and
                                -not $syntheticLabel.Current.IsOffscreen)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        }
      }
      if($r.windowFound -and $r.homeHeaderVisible -and
         $r.tasksTabVisible -and $r.settingsTabVisible -and
         $r.resizeAttempted -and $r.resizeWindowChanged -and
         $r.resizeHomeVisible -and $r.resizeTabsVisible -and
         $r.navigationAttempted -and $r.tasksScreenVisible -and
         $r.settingsScreenVisible -and $r.homeRoundtripVisible -and
         $r.createEntryVisible -and $r.createScreenVisible -and
         $r.syntheticTaskInputFound -and $r.syntheticTaskTyped -and
         $r.syntheticTaskSaveFound -and $r.syntheticTaskSaveClicked -and
         $r.syntheticTaskReturnedHome -and $r.syntheticTaskVisibleInTasks) {
        $r.status="PASS"
        $r.reason="native_resize_navigation_and_synthetic_task_saved"
      } elseif($r.createScreenVisible -and -not $r.syntheticTaskVisibleInTasks) {
        $r.reason="synthetic_task_create_and_save_not_verified"
      } elseif($r.resizeAttempted -and -not (
         $r.resizeWindowChanged -and $r.resizeHomeVisible -and
         $r.resizeTabsVisible)) {
        $r.reason="native_resize_not_verified"
      } elseif($r.windowFound -and $r.homeHeaderVisible -and
         $r.tasksTabVisible -and $r.settingsTabVisible -and
         $r.homeRoundtripVisible) {
        $r.reason="create_task_route_not_verified"
      } elseif($r.windowFound -and $r.homeHeaderVisible -and
         $r.tasksTabVisible -and $r.settingsTabVisible) {
        $r.reason="navigation_roundtrip_not_verified"
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
