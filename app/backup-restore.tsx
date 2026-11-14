import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Share, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useTaskContext } from "@/lib/task-context";
import { createLocalBackup, parseLocalBackup } from "@/lib/local-backup";
import { useColors } from "@/hooks/use-colors";

export default function BackupRestoreScreen() {
  const router = useRouter();
  const colors = useColors();
  const { tasks, categories, settings, avatar, restoreBackup } = useTaskContext();
  const [backupContent, setBackupContent] = useState("");
  const [busy, setBusy] = useState(false);

  const shareBackup = async () => {
    try {
      setBusy(true);
      const backup = createLocalBackup({ tasks, categories, settings, avatar });
      if (Platform.OS === "web") {
        const blob = new Blob([backup], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "MeTodo-backup-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        await Share.share({
          title: "Private MeTodo backup",
          message: backup,
        });
      }
    } catch (error) {
      Alert.alert("Backup failed", error instanceof Error ? error.message : "Unable to prepare backup.");
    } finally {
      setBusy(false);
    }
  };

  const requestShare = () => {
    if (Platform.OS === "web") {
      void shareBackup();
      return;
    }
    Alert.alert(
      "Private backup",
      "This backup includes task titles, notes and settings. Share it only to a private, secure destination.",
      [{ text: "Cancel", style: "cancel" },
        { text: "Share backup", onPress: () => { void shareBackup(); } }],
    );
  };

  const chooseBackupFile = () => {
    if (Platform.OS !== "web") return;
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = ".json,application/json";
    picker.onchange = async () => {
      const selected = picker.files?.[0];
      if (!selected) return;
      try {
        if (selected.size > 8 * 1024 * 1024) {
          window.alert("Backup file exceeds the 8 MiB safety limit.");
          return;
        }
        setBackupContent(await selected.text());
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Could not read backup.");
      }
    };
    picker.click();
  };

  const pasteBackup = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      setBackupContent(text);
    } catch {
      Alert.alert("Clipboard unavailable", "Paste the JSON backup into the field manually.");
    }
  };

  const restore = async () => {
    try {
      setBusy(true);
      await restoreBackup(backupContent);
      if (Platform.OS === "web") {
        window.alert("Backup restored. All saved local data has been updated.");
      } else {
        Alert.alert("Backup restored", "Your local tasks and preferences were restored.");
      }
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to restore backup.";
      const detail = message + " If a storage write failed, keep the backup and restart the app to retry recovery.";
      if (Platform.OS === "web") window.alert(detail);
      else Alert.alert("Restore failed", detail);
    } finally {
      setBusy(false);
    }
  };

  const requestRestore = () => {
    try {
      const candidate = parseLocalBackup(backupContent);
      const confirmation = "Replace local data with " + candidate.tasks.length +
        " tasks? This overwrites the current tasks and preferences. Keep a separate backup first.";
      if (Platform.OS === "web") {
        if (window.confirm(confirmation)) void restore();
      } else {
        Alert.alert("Replace local data?", confirmation,
          [{ text: "Cancel", style: "cancel" },
            { text: "Restore", style: "destructive", onPress: () => { void restore(); } }]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Backup is invalid.";
      if (Platform.OS === "web") window.alert(message);
      else Alert.alert("Invalid backup", message);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text className="text-primary">Back to settings</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">Local Backup & Restore</Text>
        <Text className="text-muted">
          Your tasks are stored on this device. A backup is important before resetting,
          reinstalling or changing devices. Backups contain private task information.
        </Text>
        <View style={{ padding: 16, borderRadius: 12, backgroundColor: colors.surface, gap: 10 }}>
          <Text className="font-semibold text-foreground">Create a backup</Text>
          <Text className="text-muted">Includes {tasks.length} tasks, categories, themes, settings and avatar.</Text>
          <Pressable disabled={busy} onPress={requestShare}
            accessibilityRole="button" style={{ backgroundColor: colors.primary, padding: 13, borderRadius: 9 }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {Platform.OS === "web" ? "Download JSON backup" : "Share private JSON backup"}
            </Text>
          </Pressable>
        </View>
        <View style={{ padding: 16, borderRadius: 12, backgroundColor: colors.surface, gap: 10 }}>
          <Text className="font-semibold text-foreground">Restore a backup</Text>
          <Text className="text-muted">
            Paste the JSON backup below. Restoring replaces local data after confirmation.
            Pending recovery automatically retries if a write is interrupted.
          </Text>
          {Platform.OS === "web" && (
            <Pressable disabled={busy} onPress={chooseBackupFile}
              accessibilityRole="button" style={{ padding: 10, borderRadius: 9, borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-foreground">Choose a JSON backup file</Text>
            </Pressable>
          )}
          <Pressable disabled={busy} onPress={() => { void pasteBackup(); }}
            accessibilityRole="button" style={{ padding: 10, borderRadius: 9, borderWidth: 1, borderColor: colors.border }}>
            <Text className="text-foreground">Paste from clipboard</Text>
          </Pressable>
          <TextInput multiline value={backupContent} onChangeText={setBackupContent}
            accessibilityLabel="JSON backup content" placeholder="Paste your MeTodo JSON backup here"
            placeholderTextColor={colors.muted} textAlignVertical="top"
            style={{ height: 150, borderWidth: 1, borderColor: colors.border,
              backgroundColor: colors.background, color: colors.foreground, borderRadius: 9, padding: 12 }} />
          <Pressable disabled={busy || !backupContent.trim()} onPress={requestRestore}
            accessibilityRole="button" style={{ backgroundColor: colors.primary, opacity: busy || !backupContent.trim() ? 0.5 : 1,
              padding: 13, borderRadius: 9 }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Validate and restore backup</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
