import React, { useState } from "react";
import { Stack } from "expo-router";
import { Pressable, StyleSheet, View, Text, Alert, Platform, ScrollView } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import DeliveryCard, { Delivery } from "@/components/DeliveryCard";
import DeliveryDetailsModal from "@/components/DeliveryDetailsModal";

// Mock data for deliveries
const mockDeliveries: Delivery[] = [
  {
    id: '1',
    customerName: 'Kingston Industrial Supply',
    address: '123 Industrial Blvd',
    city: 'Kingston',
    province: 'ON',
    containerSize: '40',
    scheduledDate: '2024-01-15',
    scheduledTime: '09:00',
    status: 'scheduled',
    specialInstructions: 'Use loading dock B. Contact supervisor on arrival.',
    driverId: 'driver1',
    driverName: 'Mike Johnson'
  },
  {
    id: '2',
    customerName: 'Ottawa Logistics Center',
    address: '456 Commerce Way',
    city: 'Ottawa',
    province: 'ON',
    containerSize: '20',
    scheduledDate: '2024-01-15',
    scheduledTime: '14:30',
    status: 'en-route',
    specialInstructions: 'Call 30 minutes before arrival.',
    driverId: 'driver1',
    driverName: 'Mike Johnson'
  },
  {
    id: '3',
    customerName: 'Syracuse Distribution',
    address: '789 Warehouse Dr',
    city: 'Syracuse',
    province: 'NY',
    containerSize: '40',
    scheduledDate: '2024-01-16',
    scheduledTime: '11:00',
    status: 'scheduled',
    driverId: 'driver2',
    driverName: 'Sarah Chen'
  },
  {
    id: '4',
    customerName: 'Brockville Manufacturing',
    address: '321 Factory St',
    city: 'Brockville',
    province: 'ON',
    containerSize: '20',
    scheduledDate: '2024-01-16',
    scheduledTime: '08:00',
    status: 'delivered',
    specialInstructions: 'Completed delivery - signed by J. Smith',
    driverId: 'driver3',
    driverName: 'Tom Wilson'
  }
];

export default function HomeScreen() {
  const theme = useTheme();
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: newStatus }
          : delivery
      )
    );
    Alert.alert('Status Updated', `Delivery status updated successfully!`);
    setSelectedDelivery(null);
  };

  const renderDeliveryDetails = () => {
    if (!selectedDelivery) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
            <Text style={commonStyles.title}>Delivery Details</Text>
            <Pressable onPress={() => setSelectedDelivery(null)}>
              <IconSymbol name="xmark" color={colors.textSecondary} size={24} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[commonStyles.card, { marginBottom: 0 }]}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <Text style={commonStyles.text}>{selectedDelivery.customerName}</Text>
              <Text style={commonStyles.textSecondary}>
                {selectedDelivery.address}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {selectedDelivery.city}, {selectedDelivery.province}
              </Text>
            </View>

            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
              <View style={[commonStyles.row, { marginBottom: 8 }]}>
                <IconSymbol name="cube.box" color={colors.primary} size={20} />
                <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                  {selectedDelivery.containerSize}&apos; Container
                </Text>
              </View>
              <View style={[commonStyles.row, { marginBottom: 8 }]}>
                <IconSymbol name="calendar" color={colors.primary} size={20} />
                <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                  {selectedDelivery.scheduledDate} at {selectedDelivery.scheduledTime}
                </Text>
              </View>
              <View style={commonStyles.row}>
                <IconSymbol name="person.circle" color={colors.primary} size={20} />
                <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                  Driver: {selectedDelivery.driverName}
                </Text>
              </View>
            </View>

            {selectedDelivery.specialInstructions && (
              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Special Instructions</Text>
                <Text style={commonStyles.text}>{selectedDelivery.specialInstructions}</Text>
              </View>
            )}

            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Update Status</Text>
              <View style={styles.statusButtons}>
                {(['scheduled', 'en-route', 'arrived', 'delivered', 'delayed'] as const).map((status) => (
                  <Pressable
                    key={status}
                    style={[
                      styles.statusButton,
                      { backgroundColor: getStatusColor(status) },
                      selectedDelivery.status === status && styles.activeStatusButton
                    ]}
                    onPress={() => updateDeliveryStatus(selectedDelivery.id, status)}
                  >
                    <Text style={styles.statusButtonText}>
                      {getStatusText(status)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable 
                style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
                onPress={() => {
                  Alert.alert('Navigation', 'Opening maps for navigation...');
                  // Note: react-native-maps is not supported in Natively
                  // In a real app, you would use Linking.openURL with maps URL
                }}
              >
                <Text style={buttonStyles.secondaryText}>Navigate</Text>
              </Pressable>
              <Pressable 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={() => {
                  Alert.alert('Contact', `Calling customer: ${selectedDelivery.customerName}`);
                  // In a real app, you would use Linking.openURL with tel: URL
                }}
              >
                <Text style={buttonStyles.primaryText}>Call Customer</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Add Delivery", "This feature will allow dispatchers to add new deliveries")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => Alert.alert("Settings", "Driver settings and preferences")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} />
    </Pressable>
  );

  // Filter deliveries for today and upcoming
  const todayDeliveries = deliveries.filter(d => d.scheduledDate === '2024-01-15');
  const upcomingDeliveries = deliveries.filter(d => d.scheduledDate > '2024-01-15');

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Delivery Schedule",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <ScrollView 
          style={commonStyles.content}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={commonStyles.title}>Today&apos;s Deliveries</Text>
            <Text style={commonStyles.textSecondary}>
              {todayDeliveries.length} deliveries scheduled for January 15, 2024
            </Text>
          </View>

          {/* Today's Deliveries */}
          {todayDeliveries.map((delivery) => (
            <View key={delivery.id}>
              {renderDeliveryCard({ item: delivery })}
            </View>
          ))}

          {/* Upcoming Deliveries */}
          {upcomingDeliveries.length > 0 && (
            <>
              <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 16 }]}>
                Upcoming Deliveries
              </Text>
              {upcomingDeliveries.map((delivery) => (
                <View key={delivery.id}>
                  {renderDeliveryCard({ item: delivery })}
                </View>
              ))}
            </>
          )}

          {/* Maps Notice */}
          <View style={[commonStyles.card, styles.noticeCard]}>
            <IconSymbol name="info.circle" color={colors.accent} size={24} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                Navigation Notice
              </Text>
              <Text style={commonStyles.textSecondary}>
                Interactive maps are not supported in Natively. Use the &quot;Navigate&quot; button to open your device&apos;s default maps app for turn-by-turn directions.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Delivery Details Modal */}
        {renderDeliveryDetails()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  headerInfo: {
    marginBottom: 20,
  },
  deliveryCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  headerButtonContainer: {
    padding: 6,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
    elevation: 10,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  activeStatusButton: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  statusButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginTop: 20,
  },
});
