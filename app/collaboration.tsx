/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: app/collaboration.tsx
 * PURPOSE: Task sharing and real-time collaboration interface
 *
 * DESCRIPTION:
 * Provides UI for sharing tasks, managing permissions, assigning tasks,
 * and collaborating with team members in real-time.
 *
 * FEATURES:
 * - Share tasks with team members
 * - Manage permissions
 * - Assign tasks
 * - View activity logs
 * - Add comments and replies
 * - Real-time updates
 *
 * DEPENDENCIES:
 * - React Native components
 * - Expo Router
 * - Collaboration UI Service
 * - Custom hooks
 *
 * =============================================================================
 */

import { ScrollView, Text, View, TouchableOpacity, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  CollaborationUIService,
  PermissionLevel,
  CollaborationMember,
  ActivityLog,
  TaskComment,
} from "@/lib/collaboration-ui-service";

/**
 * CollaborationScreen Component
 *
 * Manages task sharing and collaboration features
 */
export default function CollaborationScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  const colors = useColors();

  const [activeTab, setActiveTab] = useState<"members" | "activity" | "comments">("members");
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<PermissionLevel>(PermissionLevel.EDIT);
  const [commentText, setCommentText] = useState("");
  const [members, setMembers] = useState<CollaborationMember[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);

  const handleShareTask = async () => {
    if (!shareEmail.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    try {
      await CollaborationUIService.shareTask(
        taskId as string,
        [shareEmail],
        sharePermission
      );

      setMembers(CollaborationUIService.getSharedTaskMembers(taskId as string));
      setShareEmail("");
      Alert.alert("Success", `Task shared with ${shareEmail}`);
    } catch {
      Alert.alert("Error", "Failed to share task");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    Alert.alert("Remove Member", "Are you sure you want to remove this member?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Remove",
        onPress: async () => {
          try {
            await CollaborationUIService.removeMember(taskId as string, memberId);
            setMembers(CollaborationUIService.getSharedTaskMembers(taskId as string));
          } catch {
            Alert.alert("Error", "Failed to remove member");
          }
        },
      },
    ]);
  };

  const handleUpdatePermission = async (memberId: string, permission: PermissionLevel) => {
    try {
      await CollaborationUIService.updateMemberPermission(taskId as string, memberId, permission);
      setMembers(CollaborationUIService.getSharedTaskMembers(taskId as string));
    } catch {
      Alert.alert("Error", "Failed to update permission");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      await CollaborationUIService.addComment(
        taskId as string,
        "current_user",
        "You",
        commentText
      );
      setComments(CollaborationUIService.getTaskComments(taskId as string));
      setCommentText("");
    } catch {
      Alert.alert("Error", "Failed to add comment");
    }
  };

  const handleLoadData = () => {
    setMembers(CollaborationUIService.getSharedTaskMembers(taskId as string));
    setActivityLogs(CollaborationUIService.getActivityLog(taskId as string));
    setComments(CollaborationUIService.getTaskComments(taskId as string));
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">Collaboration</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Share Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Share Task</Text>
          <View className="gap-3">
            <TextInput
              placeholder="Enter email address"
              value={shareEmail}
              onChangeText={setShareEmail}
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
              }}
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
            />

            <View className="flex-row gap-2">
              {(Object.values(PermissionLevel) as PermissionLevel[]).map((perm) => (
                <Pressable
                  key={perm}
                  onPress={() => setSharePermission(perm)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: sharePermission === perm ? colors.primary : colors.surface,
                      flex: 1,
                    },
                  ]}
                  className="py-2 rounded-lg items-center"
                >
                  <Text
                    className="font-semibold capitalize"
                    style={{ color: sharePermission === perm ? "#fff" : colors.foreground }}
                  >
                    {perm}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleShareTask}
              style={{ backgroundColor: colors.primary }}
              className="rounded-xl py-3 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Share Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="px-4 mb-6 flex-row gap-2">
          {(["members", "activity", "comments"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                handleLoadData();
              }}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: activeTab === tab ? colors.primary : colors.surface,
                  flex: 1,
                },
              ]}
              className="py-2 rounded-lg items-center"
            >
              <Text
                className="font-semibold capitalize"
                style={{ color: activeTab === tab ? "#fff" : colors.foreground }}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Members Tab */}
        {activeTab === "members" && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">Shared With</Text>
            {members.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-muted">No members yet</Text>
              </View>
            ) : (
              members.map((member) => (
                <View
                  key={member.id}
                  className="flex-row items-center justify-between p-4 rounded-xl mb-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{member.name}</Text>
                    <Text className="text-sm text-muted">{member.email}</Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      const nextPerm =
                        member.permission === PermissionLevel.VIEW
                          ? PermissionLevel.EDIT
                          : PermissionLevel.ADMIN;
                      handleUpdatePermission(member.id, nextPerm);
                    }}
                    className="px-3 py-1 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white text-xs font-semibold capitalize">
                      {member.permission}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleRemoveMember(member.id)}
                    className="ml-2 px-2 py-1"
                  >
                    <Text className="text-error font-bold">✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">Activity</Text>
            {activityLogs.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-muted">No activity yet</Text>
              </View>
            ) : (
              activityLogs.map((log) => (
                <View
                  key={log.id}
                  className="p-4 rounded-xl mb-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row justify-between mb-1">
                    <Text className="font-semibold text-foreground">{log.userName}</Text>
                    <Text className="text-xs text-muted">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted capitalize">{log.action}</Text>
                  <Text className="text-sm text-foreground mt-1">{log.details}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">Comments</Text>

            {/* Add Comment */}
            <View className="mb-4 gap-2">
              <TextInput
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  textAlignVertical: "top",
                }}
                placeholderTextColor={colors.muted}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={{ backgroundColor: colors.primary }}
                className="rounded-lg py-2 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Post Comment</Text>
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {comments.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-muted">No comments yet</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  className="p-4 rounded-xl mb-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row justify-between mb-1">
                    <Text className="font-semibold text-foreground">{comment.userName}</Text>
                    <Text className="text-xs text-muted">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text className="text-sm text-foreground mt-1">{comment.content}</Text>
                  <View className="flex-row gap-4 mt-2">
                    <Pressable className="flex-row items-center gap-1">
                      <Text className="text-lg">👍</Text>
                      <Text className="text-xs text-muted">{comment.likes}</Text>
                    </Pressable>
                    <Pressable>
                      <Text className="text-xs text-primary">Reply</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
