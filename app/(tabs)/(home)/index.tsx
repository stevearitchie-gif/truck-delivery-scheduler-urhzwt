
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { Pressable, StyleSheet, View, Text, Alert, Platform, ScrollView } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import DeliveryCard, { Delivery } from "@/components/DeliveryCard";
import DeliveryDetailsModal from "@/components/DeliveryDetailsModal";
import AddDeliveryModal from "@/components/AddDeliveryModal";

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
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);

  useEffect(() => {
    console.log('HomeScreen mounted');
    console.log('Deliveries loaded:', deliveries.length);
  }, []);

  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    console.log('Updating delivery status:', deliveryId, newStatus);
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: newStatus }
          : delivery
      )
    );
    Alert.alert('Status Updated', `Delivery status updated to ${newStatus}!`);
    setSelectedDelivery(null);
  };

  const handleAddDelivery = (newDeliveryData: Omit<Delivery, 'id'>) => {
    console.log('Adding new delivery:', newDeliveryData);
    
    // Generate a unique ID (in a real app, this would come from your backend)
    const newId = (Math.max(...deliveries.map(d => parseInt(d.id))) + 1).toString();
    
    const newDelivery: Delivery = {
      ...newDeliveryData,
      id: newId,
    };

    setDeliveries(prev => [...prev, newDelivery]);
    console.log('New delivery added successfully:', newDelivery);
  };

  const handleDeliveryPress = (delivery: Delivery) => {
    console.log('Delivery pressed:', delivery.id, delivery.customerName);
    setSelectedDelivery(delivery);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {
        console.log('Add delivery button pressed');
        setShowAddDeliveryModal(true);
      }}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => {
        console.log('Settings button pressed');
        Alert.alert("Settings", "Driver settings and preferences");
      }}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} />
    </Pressable>
  );

  // Filter deliveries for today and upcoming
  const todayDeliveries = deliveries.filter(d => d.scheduledDate === '2024-01-15');
  const upcomingDeliveries = deliveries.filter(d => d.scheduledDate > '2024-01-15');

  console.log('Rendering HomeScreen - Today:', todayDeliveries.length, 'Upcoming:', upcomingDeliveries.length);

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
          {todayDeliveries.length > 0 ? (
            todayDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onPress={handleDeliveryPress}
              />
            ))
          ) : (
            <View style={[commonStyles.card, commonStyles.centerContent, { padding: 40 }]}>
              <IconSymbol name="checkmark.circle" color={colors.secondary} size={48} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No deliveries scheduled for today
              </Text>
            </View>
          )}

          {/* Upcoming Deliveries */}
          {upcomingDeliveries.length > 0 && (
            <>
              <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 16 }]}>
                Upcoming Deliveries
              </Text>
              {upcomingDeliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onPress={handleDeliveryPress}
                />
              ))}
            </>
          )}

          {/* Quick Stats */}
          <View style={[commonStyles.card, styles.statsCard]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Delivery Statistics
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{deliveries.length}</Text>
                <Text style={commonStyles.textSecondary}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {deliveries.filter(d => d.status === 'scheduled').length}
                </Text>
                <Text style={commonStyles.textSecondary}>Scheduled</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {deliveries.filter(d => d.status === 'delivered').length}
                </Text>
                <Text style={commonStyles.textSecondary}>Delivered</Text>
              </View>
            </View>
          </View>

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

          {/* Test Section - Remove this after confirming app works */}
          <View style={[commonStyles.card, { backgroundColor: '#e8f5e8', marginTop: 20 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.secondary }]}>
              ✅ App Status: Working
            </Text>
            <Text style={commonStyles.textSecondary}>
              • {deliveries.length} deliveries loaded
            </Text>
            <Text style={commonStyles.textSecondary}>
              • Modal state: {selectedDelivery ? 'Open' : 'Closed'}
            </Text>
            <Text style={commonStyles.textSecondary}>
              • Add delivery modal: {showAddDeliveryModal ? 'Open' : 'Closed'}
            </Text>
            <Text style={commonStyles.textSecondary}>
              • Platform: {Platform.OS}
            </Text>
          </View>
        </ScrollView>

        {/* Delivery Details Modal */}
        <DeliveryDetailsModal
          delivery={selectedDelivery}
          onClose={() => {
            console.log('Details modal closed');
            setSelectedDelivery(null);
          }}
          onUpdateStatus={updateDeliveryStatus}
        />

        {/* Add Delivery Modal */}
        <AddDeliveryModal
          visible={showAddDeliveryModal}
          onClose={() => {
            console.log('Add delivery modal closed');
            setShowAddDeliveryModal(false);
          }}
          onAddDelivery={handleAddDelivery}
        />
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
  headerButtonContainer: {
    padding: 6,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginTop: 20,
  },
  statsCard: {
    marginTop: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
});
