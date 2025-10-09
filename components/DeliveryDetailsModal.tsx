
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Delivery, getStatusColor, getStatusText } from './DeliveryCard';

interface DeliveryDetailsModalProps {
  delivery: Delivery | null;
  onClose: () => void;
  onUpdateStatus: (deliveryId: string, newStatus: Delivery['status']) => void;
}

export default function DeliveryDetailsModal({ 
  delivery, 
  onClose, 
  onUpdateStatus 
}: DeliveryDetailsModalProps) {
  if (!delivery) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
          <Text style={commonStyles.title}>Delivery Details</Text>
          <Pressable onPress={onClose}>
            <IconSymbol name="xmark" color={colors.textSecondary} size={24} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyles.card, { marginBottom: 0 }]}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <Text style={commonStyles.text}>{delivery.customerName}</Text>
            <Text style={commonStyles.textSecondary}>
              {delivery.address}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {delivery.city}, {delivery.province}
            </Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <IconSymbol name="cube.box" color={colors.primary} size={20} />
              <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                {delivery.containerSize}&apos; Container
              </Text>
            </View>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <IconSymbol name="calendar" color={colors.primary} size={20} />
              <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                {delivery.scheduledDate} at {delivery.scheduledTime}
              </Text>
            </View>
            <View style={commonStyles.row}>
              <IconSymbol name="person.circle" color={colors.primary} size={20} />
              <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                Driver: {delivery.driverName}
              </Text>
            </View>
          </View>

          {delivery.specialInstructions && (
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <Text style={commonStyles.text}>{delivery.specialInstructions}</Text>
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
                    delivery.status === status && styles.activeStatusButton
                  ]}
                  onPress={() => onUpdateStatus(delivery.id, status)}
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
                Alert.alert('Navigation', 'Opening maps for navigation...\n\nNote: Interactive maps are not supported in Natively. This would normally open your device\'s default maps app.');
              }}
            >
              <Text style={buttonStyles.secondaryText}>Navigate</Text>
            </Pressable>
            <Pressable 
              style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
              onPress={() => {
                Alert.alert('Contact', `Calling customer: ${delivery.customerName}\n\nThis would normally open your phone app to call the customer.`);
              }}
            >
              <Text style={buttonStyles.primaryText}>Call Customer</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
});
