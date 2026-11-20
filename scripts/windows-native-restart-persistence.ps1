# CI-only native Windows app relaunch check.
# Reads only a fixed synthetic test label in a disposable GitHub Actions profile.
[CmdletBinding()]
param([Parameter(Mandatory=$true)][ValidateRange(1,2147483647)][int]$TargetProcessId)

$ErrorActionPreference="Stop"
$r=@{
  method="Windows UI Automation restart persistence"; status="NOT VERIFIED"
  reason="not_started"; phase="initializing"
  windowFoundAfterRestart=$false; homeVisibleAfterRestart=$false
  tasksTabVisibleAfterRestart=$false; tasksScreenVisibleAfterRestart=$false
  syntheticTaskPersistedAfterRestart=$false
}
try {
  if ($env:GITHUB_ACTIONS -ne "true") {
    $r.reason="disposable_ci_only"
  } else {
    Add-Type -AssemblyName UIAutomationClient
    Add-Type -AssemblyName UIAutomationTypes
    Add-Type -AssemblyName System.Windows.Forms
    $p=Get-Process -Id $TargetProcessId -ErrorAction Stop
    $hwnd=[IntPtr]::Zero
    for($i=0;$i -lt 20;$i++) {
      $p.Refresh()
      $hwnd=$p.MainWindowHandle
      if($hwnd -ne [IntPtr]::Zero) { break }
      Start-Sleep -Milliseconds 500
    }
    if($hwnd -eq [IntPtr]::Zero) {
      $r.reason="restarted_process_without_window"
    } else {
      $w=[System.Windows.Automation.AutomationElement]::FromHandle($hwnd)
      if($null -eq $w) { throw [InvalidOperationException]::new("window_missing") }
      $windowBounds=$w.Current.BoundingRectangle
      $r.windowFoundAfterRestart=(
        $windowBounds.Width -ge 300 -and $windowBounds.Height -ge 200)
      $workArea=[System.Windows.Forms.Screen]::FromHandle($hwnd).WorkingArea
      function Get-CIVisibleLabel([string]$label) {
        $condition=[System.Windows.Automation.PropertyCondition]::new(
          [System.Windows.Automation.AutomationElement]::NameProperty,$label)
        $element=$w.FindFirst(
          [System.Windows.Automation.TreeScope]::Descendants,$condition)
        if($null -eq $element) { return $false }
        $bounds=$element.Current.BoundingRectangle
        return ($bounds.Width -ge 20 -and $bounds.Height -ge 8 -and
          $bounds.Top -ge $workArea.Top -and
          $bounds.Bottom -le $workArea.Bottom -and
          -not $element.Current.IsOffscreen)
      }
      $r.phase="restarted_home"
      for($i=0;$i -lt 16;$i++) {
        if(Get-CIVisibleLabel "Stay productive") {
          $r.homeVisibleAfterRestart=$true
          break
        }
        Start-Sleep -Milliseconds 500
      }

      if($r.windowFoundAfterRestart -and $r.homeVisibleAfterRestart) {
        $taskCondition=[System.Windows.Automation.PropertyCondition]::new(
          [System.Windows.Automation.AutomationElement]::NameProperty,"Tasks")
        $taskTab=$w.FindFirst(
          [System.Windows.Automation.TreeScope]::Descendants,$taskCondition)
        if($null -ne $taskTab) {
          $bounds=$taskTab.Current.BoundingRectangle
          $r.tasksTabVisibleAfterRestart=(
            $bounds.Width -ge 15 -and $bounds.Height -ge 8 -and
            $bounds.Top -ge $workArea.Top -and
            $bounds.Bottom -le $workArea.Bottom -and
            -not $taskTab.Current.IsOffscreen)
          if($r.tasksTabVisibleAfterRestart) {
            $mouseSource=@'
using System;
using System.Runtime.InteropServices;
public static class MeTodoCIRestartMouse {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hwnd);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(
    uint flags, uint x, uint y, uint data, UIntPtr extraInfo);
}
'@
            Add-Type -TypeDefinition $mouseSource -Language CSharp
            $r.phase="restarted_tasks"
            $x=[int][Math]::Round($bounds.Left+$bounds.Width/2)
            $y=[int][Math]::Round($bounds.Top+$bounds.Height/2)
            [MeTodoCIRestartMouse]::SetForegroundWindow($hwnd) | Out-Null
            [MeTodoCIRestartMouse]::SetCursorPos($x,$y) | Out-Null
            Start-Sleep -Milliseconds 120
            [MeTodoCIRestartMouse]::mouse_event([uint32]2,0,0,0,[UIntPtr]::Zero)
            Start-Sleep -Milliseconds 100
            [MeTodoCIRestartMouse]::mouse_event([uint32]4,0,0,0,[UIntPtr]::Zero)
            for($i=0;$i -lt 20;$i++) {
              Start-Sleep -Milliseconds 500
              if(Get-CIVisibleLabel "Manage your tasks") {
                $r.tasksScreenVisibleAfterRestart=$true
                # Only compare with a fixed, nonpersonal synthetic title.
                # Never enumerate, log, export, or read other task values.
                if(Get-CIVisibleLabel "MeTodo CI Smoke Task") {
                  $r.syntheticTaskPersistedAfterRestart=$true
                  break
                }
              }
            }
          }
        }
      }
      if($r.windowFoundAfterRestart -and $r.homeVisibleAfterRestart -and
         $r.tasksTabVisibleAfterRestart -and $r.tasksScreenVisibleAfterRestart -and
         $r.syntheticTaskPersistedAfterRestart) {
        $r.status="PASS"
        $r.reason="synthetic_task_survived_native_relaunch"
        $r.phase="complete"
      } elseif(-not $r.homeVisibleAfterRestart) {
        $r.reason="restarted_home_not_visible"
      } elseif(-not $r.tasksTabVisibleAfterRestart) {
        $r.reason="restarted_tasks_tab_not_visible"
      } elseif(-not $r.tasksScreenVisibleAfterRestart) {
        $r.reason="restarted_tasks_screen_not_visible"
      } else {
        $r.reason="synthetic_task_not_visible_after_relaunch"
      }
    }
  }
} catch {
  # Emit a fixed error category without leaking task contents, paths or exceptions.
  $r.reason="restart_uia_"+$_.Exception.GetType().Name
}
$r | ConvertTo-Json -Compress
