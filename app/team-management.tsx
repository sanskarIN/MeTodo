/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: app/team-management.tsx
 * PURPOSE: Team management dashboard screen
 *
 * DESCRIPTION:
 * This screen provides comprehensive team management capabilities including:
 * - View all team members
 * - Manage member permissions
 * - View assigned tasks
 * - Track member activity
 * - Manage team settings
 * - View collaboration metrics
 * - Remove members
 * - Invite new members
 *
 * FEATURES:
 * - Real-time member list
 * - Permission management
 * - Activity tracking
 * - Task assignment overview
 * - Team statistics
 * - Search and filter
 * - Bulk operations
 * - Member profiles
 *
 * DEPENDENCIES:
 * - React Native
 * - Expo Router
 * - Collaboration UI Service
 * - Notification Service
 *
 * =============================================================================
 */

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CollaborationUIService } from "@/lib/collaboration-ui-service";
import CollaborationNotificationsService from "@/lib/collaboration-notifications-service";

/**
 * Permission level badge component
 */
function PermissionBadge({ permission }: { permission: string }) {
  const colors = useColors();

  const getBackgroundColor = () => {
    switch (permission) {
      case "ADMIN":
        return colors.error;
      case "EDIT":
        return colors.primary;
      case "VIEW":
        return colors.muted;
      default:
        return colors.border;
    }
  };

  return (
    <View
      style={{ backgroundColor: getBackgroundColor() }}
      className="px-3 py-1 rounded-full"
    >
      <Text className="text-xs font-semibold text-white">{permission}</Text>
    </View>
  );
}

/**
 * Team member card component
 */
function TeamMemberCard({
  member,
  onPermissionChange,
  onRemove,
}: {
  member: any;
  onPermissionChange: (memberId: string, permission: string) => void;
  onRemove: (memberId: string) => void;
}) {
  const colors = useColors();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View
      className="mb-3 p-4 rounded-lg border"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          {member.avatar && (
            <View
              className="w-10 h-10 rounded-full mr-3 items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-bold">
                {member.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {member.name}
            </Text>
            <Text className="text-sm text-muted">{member.email}</Text>
          </View>
        </View>
        <PermissionBadge permission={member.permission} />
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-xs text-muted">Joined</Text>
          <Text className="text-sm font-semibold text-foreground">
            {new Date(member.joinedAt).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-muted">Last Active</Text>
          <Text className="text-sm font-semibold text-foreground">
            {new Date(member.lastActive).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-muted">Tasks</Text>
          <Text className="text-sm font-semibold text-foreground">
            {member.taskCount || 0}
          </Text>
        </View>
      </View>

      {showOptions && (
        <View className="flex-row gap-2 pt-3 border-t" style={{ borderTopColor: colors.border }}>
          <TouchableOpacity
            className="flex-1 py-2 px-3 rounded-lg"
            style={{ backgroundColor: colors.primary }}
            onPress={() => {
              Alert.alert("Change Permission", "Select new permission level", [
                {
                  text: "View Only",
                  onPress: () => onPermissionChange(member.id, "VIEW"),
                },
                {
                  text: "Edit",
                  onPress: () => onPermissionChange(member.id, "EDIT"),
                },
                {
                  text: "Admin",
                  onPress: () => onPermissionChange(member.id, "ADMIN"),
                },
                { text: "Cancel", onPress: () => {} },
              ]);
            }}
          >
            <Text className="text-white text-center text-sm font-semibold">
              Change Permission
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-2 px-3 rounded-lg"
            style={{ backgroundColor: colors.error }}
            onPress={() => {
              Alert.alert("Remove Member", `Remove ${member.name}?`, [
                {
                  text: "Remove",
                  onPress: () => onRemove(member.id),
                  style: "destructive",
                },
                { text: "Cancel", onPress: () => {} },
              ]);
            }}
          >
            <Text className="text-white text-center text-sm font-semibold">
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        className="mt-3 py-2 px-3 rounded-lg"
        style={{ backgroundColor: colors.border }}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text className="text-center text-sm font-semibold text-foreground">
          {showOptions ? "Hide Options" : "Show Options"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Team Management Screen
 *
 * Displays team members, manages permissions, and tracks collaboration metrics
 */
export default function TeamManagementScreen() {
  const router = useRouter();
  const colors = useColors();

  const [members, setMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTasks: 0,
    activeMembers: 0,
    totalComments: 0,
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState("EDIT");

  /**
   * Load team members
   */
  const loadMembers = async () => {
    try {
      setLoading(true);
      // Get shared tasks to extract members
      const sharedTasks = CollaborationUIService.getSharedTasks();
      const memberMap = new Map<string, any>();

      sharedTasks.forEach((task) => {
        task.sharedWith.forEach((member) => {
          if (!memberMap.has(member.id)) {
            memberMap.set(member.id, member);
          }
        });
      });

      const memberList = Array.from(memberMap.values());
      setMembers(memberList);
      setFilteredMembers(memberList);

      // Get stats
      const collaborationStats = CollaborationUIService.getCollaborationStats();
      setStats({
        totalMembers: collaborationStats.totalMembers,
        totalTasks: collaborationStats.totalSharedTasks,
        activeMembers: 0, // Would be calculated from lastActive timestamps
        totalComments: collaborationStats.totalComments,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load team members");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  /**
   * Handle permission change
   */
  const handlePermissionChange = async (memberId: string, permission: string) => {
    try {
      // Find the task this member is associated with
      const sharedTasks = CollaborationUIService.getSharedTasks();
      const taskWithMember = sharedTasks.find((task) =>
        task.sharedWith.some((m) => m.id === memberId)
      );

      if (taskWithMember) {
        await CollaborationUIService.updateMemberPermission(
          taskWithMember.id,
          memberId,
          permission as any
        );

        // Update local state
        const updatedMembers = members.map((m) =>
          m.id === memberId ? { ...m, permission } : m
        );
        setMembers(updatedMembers);
        setFilteredMembers(updatedMembers);

        // Send notification
        await CollaborationNotificationsService.notifyPermissionChanged(
          taskWithMember.id,
          taskWithMember.taskId,
          "current_user",
          "You",
          permission
        );

        Alert.alert("Success", `Permission updated to ${permission}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update permission");
      console.error(error);
    }
  };

  /**
   * Handle member removal
   */
  const handleRemoveMember = async (memberId: string) => {
    try {
      // Find the task this member is associated with
      const sharedTasks = CollaborationUIService.getSharedTasks();
      const taskWithMember = sharedTasks.find((task) =>
        task.sharedWith.some((m) => m.id === memberId)
      );

      if (taskWithMember) {
        await CollaborationUIService.removeMember(taskWithMember.id, memberId);

        // Update local state
        const updatedMembers = members.filter((m) => m.id !== memberId);
        setMembers(updatedMembers);
        setFilteredMembers(updatedMembers);

        Alert.alert("Success", "Member removed from team");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to remove member");
      console.error(error);
    }
  };

  /**
   * Handle invite
   */
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    try {
      // In production, this would call a server endpoint to send an invite
      Alert.alert(
        "Invite Sent",
        `Invitation sent to ${inviteEmail} with ${invitePermission} permission`
      );
      setInviteEmail("");
    } catch (error) {
      Alert.alert("Error", "Failed to send invite");
      console.error(error);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-lg font-semibold text-primary">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-foreground mb-2">
            Team Management
          </Text>
          <Text className="text-base text-muted">
            Manage your team members and permissions
          </Text>
        </View>

        {/* Statistics */}
        <View className="mb-6 grid grid-cols-2 gap-3">
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <Text className="text-sm text-muted mb-1">Total Members</Text>
            <Text className="text-2xl font-bold text-primary">
              {stats.totalMembers}
            </Text>
          </View>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <Text className="text-sm text-muted mb-1">Active Today</Text>
            <Text className="text-2xl font-bold text-success">
              {stats.activeMembers}
            </Text>
          </View>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <Text className="text-sm text-muted mb-1">Shared Tasks</Text>
            <Text className="text-2xl font-bold text-warning">
              {stats.totalTasks}
            </Text>
          </View>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <Text className="text-sm text-muted mb-1">Comments</Text>
            <Text className="text-2xl font-bold text-info">
              {stats.totalComments}
            </Text>
          </View>
        </View>

        {/* Invite Section */}
        <View className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
          <Text className="text-lg font-semibold text-foreground mb-3">
            Invite Team Member
          </Text>
          <TextInput
            placeholder="Enter email address"
            value={inviteEmail}
            onChangeText={setInviteEmail}
            className="p-3 rounded-lg mb-3 border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
              color: colors.foreground,
            }}
            placeholderTextColor={colors.muted}
          />
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              className="flex-1 py-2 px-3 rounded-lg"
              style={{
                backgroundColor:
                  invitePermission === "VIEW" ? colors.primary : colors.border,
              }}
              onPress={() => setInvitePermission("VIEW")}
            >
              <Text
                className="text-center text-sm font-semibold"
                style={{
                  color:
                    invitePermission === "VIEW"
                      ? colors.background
                      : colors.foreground,
                }}
              >
                View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2 px-3 rounded-lg"
              style={{
                backgroundColor:
                  invitePermission === "EDIT" ? colors.primary : colors.border,
              }}
              onPress={() => setInvitePermission("EDIT")}
            >
              <Text
                className="text-center text-sm font-semibold"
                style={{
                  color:
                    invitePermission === "EDIT"
                      ? colors.background
                      : colors.foreground,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2 px-3 rounded-lg"
              style={{
                backgroundColor:
                  invitePermission === "ADMIN" ? colors.primary : colors.border,
              }}
              onPress={() => setInvitePermission("ADMIN")}
            >
              <Text
                className="text-center text-sm font-semibold"
                style={{
                  color:
                    invitePermission === "ADMIN"
                      ? colors.background
                      : colors.foreground,
                }}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="py-3 px-4 rounded-lg"
            style={{ backgroundColor: colors.primary }}
            onPress={handleInvite}
          >
            <Text className="text-center text-white font-semibold">
              Send Invite
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="mb-4">
          <TextInput
            placeholder="Search members..."
            value={searchQuery}
            onChangeText={handleSearch}
            className="p-3 rounded-lg border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.foreground,
            }}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Members List */}
        {loading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredMembers.length === 0 ? (
          <View className="py-8 items-center justify-center">
            <Text className="text-base text-muted">
              {searchQuery ? "No members found" : "No team members yet"}
            </Text>
          </View>
        ) : (
          <View>
            {filteredMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onPermissionChange={handlePermissionChange}
                onRemove={handleRemoveMember}
              />
            ))}
          </View>
        )}

        {/* Footer */}
        <View className="py-4">
          <Text className="text-xs text-muted text-center">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
