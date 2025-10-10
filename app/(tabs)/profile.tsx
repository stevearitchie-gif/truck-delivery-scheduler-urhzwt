
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";
import SpacesStorageLogo from "@/components/SpacesStorageLogo";

// Mock driver data
const driverData = {
  name: 'Mike Johnson',
  employeeId: 'DRV001',
  licenseClass: 'AZ',
  phone: '(613) 555-0123',
  email: 'mike.johnson@trucking.com',
  homeBase: 'Gananoque, ON',
  yearsExperience: 8,
  totalDeliveries: 1247,
  onTimeRate: 98.5,
  safetyRating: 'Excellent'
};

export default function ProfileScreen() {
  const theme = useTheme();

  const ProfileItem = ({ icon, label, value, onPress }: {
    icon: string;
    label: string;
    value: string;
    onPress?: () => void;
  }) => (
    <Pressable 
      style={[commonStyles.card, styles.profileItem]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={commonStyles.row}>
        <IconSymbol name={icon as any} color={colors.primary} size={20} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemValue}>{value}</Text>
        </View>
        {onPress && (
          <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={commonStyles.content}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Branding */}
        <View style={[commonStyles.card, styles.brandingCard]}>
          <SpacesStorageLogo size="large" />
          <Text style={styles.companyName}>Spaces Storage Group</Text>
          <Text style={commonStyles.textSecondary}>
            Eastern Ontario & Upper New York State
          </Text>
        </View>

        {/* Driver Header */}
        <View style={[commonStyles.card, styles.headerCard]}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={commonStyles.title}>{driverData.name}</Text>
          <Text style={commonStyles.textSecondary}>
            Employee ID: {driverData.employeeId}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {driverData.homeBase}
          </Text>
        </View>

        {/* Contact Information */}
        <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
          Contact Information
        </Text>
        <ProfileItem
          icon="phone.fill"
          label="Phone"
          value={driverData.phone}
          onPress={() => Alert.alert('Call', `Calling ${driverData.phone}`)}
        />
        <ProfileItem
          icon="envelope.fill"
          label="Email"
          value={driverData.email}
          onPress={() => Alert.alert('Email', `Opening email to ${driverData.email}`)}
        />

        {/* Driver Information */}
        <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 12 }]}>
          Driver Information
        </Text>
        <ProfileItem
          icon="car.fill"
          label="License Class"
          value={driverData.licenseClass}
        />
        <ProfileItem
          icon="calendar"
          label="Years of Experience"
          value={`${driverData.yearsExperience} years`}
        />

        {/* Performance Stats */}
        <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 12 }]}>
          Performance Statistics
        </Text>
        <ProfileItem
          icon="cube.box.fill"
          label="Total Deliveries"
          value={driverData.totalDeliveries.toLocaleString()}
        />
        <ProfileItem
          icon="clock.fill"
          label="On-Time Rate"
          value={`${driverData.onTimeRate}%`}
        />
        <ProfileItem
          icon="shield.checkered"
          label="Safety Rating"
          value={driverData.safetyRating}
        />

        {/* Settings */}
        <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 12 }]}>
          Settings
        </Text>
        <ProfileItem
          icon="bell.fill"
          label="Notifications"
          value="Enabled"
          onPress={() => Alert.alert('Notifications', 'Notification settings')}
        />
        <ProfileItem
          icon="location.fill"
          label="Location Services"
          value="Enabled"
          onPress={() => Alert.alert('Location', 'Location settings')}
        />
        <ProfileItem
          icon="gear"
          label="App Settings"
          value="Configure"
          onPress={() => Alert.alert('Settings', 'App settings and preferences')}
        />

        {/* Emergency Contact */}
        <View style={[commonStyles.card, styles.emergencyCard]}>
          <View style={[commonStyles.row, { marginBottom: 12 }]}>
            <IconSymbol name="exclamationmark.triangle.fill" color="#ff3b30" size={24} />
            <Text style={[styles.emergencyTitle, { marginLeft: 12 }]}>
              Emergency Contact
            </Text>
          </View>
          <Pressable 
            style={[buttonStyles.accent, { backgroundColor: '#ff3b30' }]}
            onPress={() => Alert.alert('Emergency', 'Calling dispatch emergency line...')}
          >
            <Text style={[buttonStyles.primaryText]}>
              Call Dispatch Emergency
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  brandingCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 24,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileItem: {
    marginBottom: 2,
  },
  itemLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  emergencyCard: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
    marginTop: 24,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
});
