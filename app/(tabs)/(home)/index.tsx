
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { Pressable, StyleSheet, View, Text, Alert, Platform, ScrollView } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import DeliveryCard, { Delivery } from "@/components/DeliveryCard";
import DeliveryDetailsModal from "@/components/DeliveryDetailsModal";
import AddDeliveryModal from "@/components/AddDeliveryModal";
import SpacesStorageLogo from "@/components/SpacesStorageLogo";

// Mock current driver - in a real app this would come from authentication
const CURRENT_DRIVER_ID = 'driver1';
const CURRENT_DRIVER_NAME = 'Mike Johnson';

// Mock data for deliveries
const mockDeliveries: Delivery[] = [
  {
    id: '1',
    customerName: 'Kingston Industrial Supply',
    address: '123 Industrial Blvd',
    city: 'Kingston',
    province: 'ON',
    containerSize: "40' new",
    deliveryType: 'sales',
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
    containerSize: "20' used",
    deliveryType: 'rental',
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
    containerSize: "40' HC new",
    deliveryType: 'sales',
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
    containerSize: "20' reconditioned",
    deliveryType: 'rental',
    scheduledDate: '2024-01-16',
    scheduledTime: '08:00',
    status: 'delivered',
    specialInstructions: 'Completed delivery - signed by J. Smith',
    driverId: 'driver3',
    driverName: 'Tom Wilson'
  },
  {
    id: '5',
    customerName: 'Rochester Warehouse Co',
    address: '555 Storage Lane',
    city: 'Rochester',
    province: 'NY',
    containerSize: "40' modified",
    deliveryType: 'sales',
    scheduledDate: '2024-01-17',
    scheduledTime: '10:30',
    status: 'scheduled',
    driverId: 'driver1',
    driverName: 'Mike Johnson'
  },
  {
    id: '6',
    customerName: 'Watertown Supply',
    address: '888 Industrial Park',
    city: 'Watertown',
    province: 'NY',
    containerSize: "10' container",
    deliveryType: 'rental',
    scheduledDate: '2024-01-17',
    scheduledTime: '15:00',
    status: 'scheduled',
    driverId: 'driver2',
    driverName: 'Sarah Chen'
  }
];

export default function HomeScreen() {
  const theme = useTheme();
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [filterMyDeliveries, setFilterMyDeliveries] = useState(false);

  useEffect(() => {
    console.log('HomeScreen mounted');
    console.log('Deliveries loaded:', deliveries.length);
    console.log('Current driver:', CURRENT_DRIVER_NAME, '(ID:', CURRENT_DRIVER_ID + ')');
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

  const toggleFilter = () => {
    const newFilterState = !filterMyDeliveries;
    setFilterMyDeliveries(newFilterState);
    console.log('Filter toggled:', newFilterState ? 'Showing only my deliveries' : 'Showing all deliveries');
    
    Alert.alert(
      'Filter ' + (newFilterState ? 'Enabled' : 'Disabled'),
      newFilterState 
        ? `Now showing only deliveries assigned to ${CURRENT_DRIVER_NAME}`
        : 'Now showing all deliveries'
    );
  };

  const renderHeaderRight = () => (
    <View style={commonStyles.row}>
      <Pressable
        onPress={toggleFilter}
        style={[styles.headerButtonContainer, filterMyDeliveries && styles.filterActiveButton]}
      >
        <IconSymbol 
          name={filterMyDeliveries ? "line.3.horizontal.decrease.circle.fill" : "line.3.horizontal.decrease.circle"} 
          color={filterMyDeliveries ? colors.secondary : colors.primary} 
        />
      </Pressable>
      <Pressable
        onPress={() => {
          console.log('Add delivery button pressed');
          setShowAddDeliveryModal(true);
        }}
        style={styles.headerButtonContainer}
      >
        <IconSymbol name="plus" color={colors.primary} />
      </Pressable>
    </View>
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

  // Apply filter if enabled
  const filteredDeliveries = filterMyDeliveries 
    ? deliveries.filter(d => d.driverId === CURRENT_DRIVER_ID)
    : deliveries;

  console.log('Filter active:', filterMyDeliveries);
  console.log('Total deliveries:', deliveries.length, 'Filtered deliveries:', filteredDeliveries.length);

  // Filter deliveries for today and upcoming
  const todayDeliveries = filteredDeliveries.filter(d => d.scheduledDate === '2024-01-15');
  const upcomingDeliveries = filteredDeliveries.filter(d => d.scheduledDate > '2024-01-15');

  // Count sales vs rental (from filtered deliveries)
  const salesCount = filteredDeliveries.filter(d => d.deliveryType === 'sales').length;
  const rentalCount = filteredDeliveries.filter(d => d.deliveryType === 'rental').length;

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
          {/* Company Logo Header */}
          <View style={styles.logoHeader}>
            <SpacesStorageLogo size="medium" />
            <Text style={styles.companyTagline}>
              Professional Container Delivery Services
            </Text>
          </View>

          {/* Filter Status Banner */}
          {filterMyDeliveries && (
            <View style={styles.filterBanner}>
              <View style={commonStyles.row}>
                <IconSymbol name="person.circle.fill" color={colors.secondary} size={20} />
                <Text style={styles.filterBannerText}>
                  Showing only your deliveries ({CURRENT_DRIVER_NAME})
                </Text>
              </View>
              <Pressable onPress={toggleFilter} style={styles.clearFilterButton}>
                <Text style={styles.clearFilterText}>Show All</Text>
              </Pressable>
            </View>
          )}

          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={commonStyles.title}>
              {filterMyDeliveries ? 'My Deliveries' : "Today's Deliveries"}
            </Text>
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
              <IconSymbol 
                name={filterMyDeliveries ? "tray" : "checkmark.circle"} 
                color={colors.secondary} 
                size={48} 
              />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                {filterMyDeliveries 
                  ? 'You have no deliveries scheduled for today'
                  : 'No deliveries scheduled for today'
                }
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
              {filterMyDeliveries ? 'My Statistics' : 'Delivery Statistics'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{filteredDeliveries.length}</Text>
                <Text style={commonStyles.textSecondary}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#34C759' }]}>
                  {salesCount}
                </Text>
                <Text style={commonStyles.textSecondary}>Sales</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#007AFF' }]}>
                  {rentalCount}
                </Text>
                <Text style={commonStyles.textSecondary}>Rentals</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.secondary }]}>
                  {filteredDeliveries.filter(d => d.status === 'delivered').length}
                </Text>
                <Text style={commonStyles.textSecondary}>Delivered</Text>
              </View>
            </View>
          </View>

          {/* Delivery Type Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <IconSymbol name="info.circle.fill" color={colors.primary} size={24} />
              <Text style={[commonStyles.text, { fontWeight: '600', marginLeft: 8 }]}>
                Sales & Rental Deliveries
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Our drivers handle both sales and rental deliveries. Each delivery is clearly marked with its type to ensure proper handling and documentation.
            </Text>
          </View>

          {/* Filter Info Card */}
          {!filterMyDeliveries && (
            <View style={[commonStyles.card, styles.filterInfoCard]}>
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <IconSymbol name="line.3.horizontal.decrease.circle" color={colors.accent} size={24} />
                <Text style={[commonStyles.text, { fontWeight: '600', marginLeft: 8 }]}>
                  Driver Filter Available
                </Text>
              </View>
              <Text style={commonStyles.textSecondary}>
                Tap the filter icon in the header to view only your assigned deliveries. This helps you focus on your schedule without distractions.
              </Text>
            </View>
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
  logoHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  companyTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerInfo: {
    marginBottom: 20,
  },
  headerButtonContainer: {
    padding: 6,
    marginLeft: 8,
  },
  filterActiveButton: {
    backgroundColor: colors.secondary + '20',
    borderRadius: 8,
  },
  filterBanner: {
    backgroundColor: colors.secondary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  filterBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  clearFilterButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: '#e8f5ff',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginTop: 20,
  },
  filterInfoCard: {
    backgroundColor: '#f0f9ff',
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
