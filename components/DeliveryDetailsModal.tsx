
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Delivery, getStatusColor, getStatusText, getDeliveryTypeColor, getDeliveryTypeText } from './DeliveryCard';

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

  const handleStatusUpdate = (status: Delivery['status']) => {
    console.log('Status update requested:', status);
    onUpdateStatus(delivery.id, status);
  };

  const handleNavigate = () => {
    Alert.alert(
      'Navigation', 
      'Opening maps for navigation...\n\nNote: Interactive maps are not supported in Natively. This would normally open your device\'s default maps app.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleCallCustomer = () => {
    Alert.alert(
      'Contact Customer', 
      `Calling ${delivery.customerName}\n\nThis would normally open your phone app to call the customer.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
            <Text style={commonStyles.title}>Delivery Details</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" color={colors.textSecondary} size={24} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Customer Information */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                {delivery.customerName}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {delivery.address}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {delivery.city}, {delivery.province}
              </Text>
            </View>

            {/* Delivery Information */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
              
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <IconSymbol 
                  name={delivery.deliveryType === 'sales' ? 'cart.fill' : 'arrow.triangle.2.circlepath'} 
                  color={getDeliveryTypeColor(delivery.deliveryType)} 
                  size={20} 
                />
                <View style={{ marginLeft: 8 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {getDeliveryTypeText(delivery.deliveryType)} Delivery
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 13 }]}>
                    {delivery.deliveryType === 'sales' 
                      ? 'Container sold to customer' 
                      : 'Container rented to customer'}
                  </Text>
                </View>
              </View>

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

            {/* Special Instructions */}
            {delivery.specialInstructions && (
              <View style={[commonStyles.card, { marginBottom: 16 }]}>
                <Text style={styles.sectionTitle}>Special Instructions</Text>
                <Text style={commonStyles.text}>{delivery.specialInstructions}</Text>
              </View>
            )}

            {/* Current Status */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              <View style={[commonStyles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
                <Text style={[commonStyles.statusText, { color: '#ffffff' }]}>
                  {getStatusText(delivery.status)}
                </Text>
              </View>
            </View>

            {/* Update Status */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
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
                    onPress={() => handleStatusUpdate(status)}
                  >
                    <Text style={styles.statusButtonText}>
                      {getStatusText(status)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable 
                style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
                onPress={handleNavigate}
              >
                <Text style={buttonStyles.secondaryText}>Navigate</Text>
              </Pressable>
              <Pressable 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleCallCustomer}
              >
                <Text style={buttonStyles.primaryText}>Call Customer</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
    elevation: 10,
  },
  scrollView: {
    maxHeight: 500,
  },
  closeButton: {
    padding: 4,
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
    marginBottom: 10,
  },
});
