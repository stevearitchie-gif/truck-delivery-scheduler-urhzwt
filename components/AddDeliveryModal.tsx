
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert, 
  Modal,
  Platform 
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Delivery } from './DeliveryCard';

interface AddDeliveryModalProps {
  visible: boolean;
  onClose: () => void;
  onAddDelivery: (delivery: Omit<Delivery, 'id'>) => void;
}

interface DeliveryFormData {
  customerName: string;
  address: string;
  city: string;
  province: string;
  containerSize: '20' | '40';
  deliveryType: 'sales' | 'rental';
  scheduledDate: string;
  scheduledTime: string;
  specialInstructions: string;
  driverId: string;
  driverName: string;
}

const initialFormData: DeliveryFormData = {
  customerName: '',
  address: '',
  city: '',
  province: 'ON',
  containerSize: '20',
  deliveryType: 'sales',
  scheduledDate: '',
  scheduledTime: '',
  specialInstructions: '',
  driverId: '',
  driverName: '',
};

// Mock driver data - in a real app this would come from your backend
const availableDrivers = [
  { id: 'driver1', name: 'Mike Johnson' },
  { id: 'driver2', name: 'Sarah Chen' },
  { id: 'driver3', name: 'Tom Wilson' },
  { id: 'driver4', name: 'Lisa Rodriguez' },
  { id: 'driver5', name: 'David Kim' },
  { id: 'driver6', name: 'Emma Thompson' },
];

const provinces = ['ON', 'QC', 'NY', 'VT', 'NH', 'ME'];

export default function AddDeliveryModal({ 
  visible, 
  onClose, 
  onAddDelivery 
}: AddDeliveryModalProps) {
  const [formData, setFormData] = useState<DeliveryFormData>(initialFormData);
  const [showDriverPicker, setShowDriverPicker] = useState(false);
  const [showProvincePicker, setShowProvincePicker] = useState(false);
  const [showContainerPicker, setShowContainerPicker] = useState(false);
  const [showDeliveryTypePicker, setShowDeliveryTypePicker] = useState(false);

  const updateFormData = (field: keyof DeliveryFormData, value: string) => {
    console.log('Updating form field:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required = [
      'customerName',
      'address', 
      'city',
      'scheduledDate',
      'scheduledTime',
      'driverId'
    ];
    
    for (const field of required) {
      if (!formData[field as keyof DeliveryFormData]) {
        Alert.alert('Validation Error', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate date format (basic check)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.scheduledDate)) {
      Alert.alert('Validation Error', 'Please enter date in YYYY-MM-DD format');
      return false;
    }

    // Validate time format (basic check)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(formData.scheduledTime)) {
      Alert.alert('Validation Error', 'Please enter time in HH:MM format');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    console.log('Form submission attempted');
    
    if (!validateForm()) {
      return;
    }

    const newDelivery: Omit<Delivery, 'id'> = {
      ...formData,
      status: 'scheduled',
    };

    console.log('Adding new delivery:', newDelivery);
    onAddDelivery(newDelivery);
    
    // Reset form
    setFormData(initialFormData);
    onClose();
    
    Alert.alert('Success', 'New delivery has been scheduled successfully!');
  };

  const handleClose = () => {
    console.log('Modal closed');
    setFormData(initialFormData);
    onClose();
  };

  const selectDriver = (driver: { id: string; name: string }) => {
    updateFormData('driverId', driver.id);
    updateFormData('driverName', driver.name);
    setShowDriverPicker(false);
  };

  const selectProvince = (province: string) => {
    updateFormData('province', province);
    setShowProvincePicker(false);
  };

  const selectContainerSize = (size: '20' | '40') => {
    updateFormData('containerSize', size);
    setShowContainerPicker(false);
  };

  const selectDeliveryType = (type: 'sales' | 'rental') => {
    updateFormData('deliveryType', type);
    setShowDeliveryTypePicker(false);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
            <Text style={commonStyles.title}>Add New Delivery</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name="xmark" color={colors.textSecondary} size={24} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Customer Information */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              
              <Text style={styles.fieldLabel}>Customer Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.customerName}
                onChangeText={(value) => updateFormData('customerName', value)}
                placeholder="Enter customer name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.fieldLabel}>Address *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.address}
                onChangeText={(value) => updateFormData('address', value)}
                placeholder="Enter street address"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.fieldLabel}>City *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.city}
                onChangeText={(value) => updateFormData('city', value)}
                placeholder="Enter city"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.fieldLabel}>Province/State *</Text>
              <Pressable 
                style={styles.pickerButton}
                onPress={() => setShowProvincePicker(true)}
              >
                <Text style={[styles.pickerText, !formData.province && styles.placeholderText]}>
                  {formData.province || 'Select province/state'}
                </Text>
                <IconSymbol name="chevron.down" color={colors.textSecondary} size={16} />
              </Pressable>
            </View>

            {/* Delivery Details */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Delivery Details</Text>
              
              <Text style={styles.fieldLabel}>Delivery Type *</Text>
              <Pressable 
                style={styles.pickerButton}
                onPress={() => setShowDeliveryTypePicker(true)}
              >
                <View style={commonStyles.row}>
                  <IconSymbol 
                    name={formData.deliveryType === 'sales' ? 'cart.fill' : 'arrow.triangle.2.circlepath'} 
                    color={formData.deliveryType === 'sales' ? '#34C759' : '#007AFF'} 
                    size={20} 
                  />
                  <Text style={[styles.pickerText, { marginLeft: 8 }]}>
                    {formData.deliveryType === 'sales' ? 'Sales Delivery' : 'Rental Delivery'}
                  </Text>
                </View>
                <IconSymbol name="chevron.down" color={colors.textSecondary} size={16} />
              </Pressable>

              <Text style={styles.fieldLabel}>Container Size *</Text>
              <Pressable 
                style={styles.pickerButton}
                onPress={() => setShowContainerPicker(true)}
              >
                <Text style={[styles.pickerText, !formData.containerSize && styles.placeholderText]}>
                  {formData.containerSize ? `${formData.containerSize}' Container` : 'Select container size'}
                </Text>
                <IconSymbol name="chevron.down" color={colors.textSecondary} size={16} />
              </Pressable>

              <Text style={styles.fieldLabel}>Scheduled Date *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.scheduledDate}
                onChangeText={(value) => updateFormData('scheduledDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.fieldLabel}>Scheduled Time *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.scheduledTime}
                onChangeText={(value) => updateFormData('scheduledTime', value)}
                placeholder="HH:MM (24-hour format)"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.fieldLabel}>Assigned Driver *</Text>
              <Pressable 
                style={styles.pickerButton}
                onPress={() => setShowDriverPicker(true)}
              >
                <Text style={[styles.pickerText, !formData.driverName && styles.placeholderText]}>
                  {formData.driverName || 'Select driver'}
                </Text>
                <IconSymbol name="chevron.down" color={colors.textSecondary} size={16} />
              </Pressable>
            </View>

            {/* Special Instructions */}
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.specialInstructions}
                onChangeText={(value) => updateFormData('specialInstructions', value)}
                placeholder="Enter any special delivery instructions..."
                placeholderTextColor={colors.textSecondary}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable 
                style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
                onPress={handleClose}
              >
                <Text style={buttonStyles.secondaryText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleSubmit}
              >
                <Text style={buttonStyles.primaryText}>Add Delivery</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Delivery Type Picker Modal */}
      {showDeliveryTypePicker && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerModal}>
              <Text style={styles.pickerTitle}>Select Delivery Type</Text>
              <ScrollView style={styles.pickerList}>
                <Pressable
                  style={styles.pickerItem}
                  onPress={() => selectDeliveryType('sales')}
                >
                  <View style={commonStyles.row}>
                    <IconSymbol name="cart.fill" color="#34C759" size={24} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.pickerItemText}>Sales Delivery</Text>
                      <Text style={styles.pickerItemSubtext}>
                        Container sold to customer
                      </Text>
                    </View>
                  </View>
                </Pressable>
                <Pressable
                  style={styles.pickerItem}
                  onPress={() => selectDeliveryType('rental')}
                >
                  <View style={commonStyles.row}>
                    <IconSymbol name="arrow.triangle.2.circlepath" color="#007AFF" size={24} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.pickerItemText}>Rental Delivery</Text>
                      <Text style={styles.pickerItemSubtext}>
                        Container rented to customer
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </ScrollView>
              <Pressable 
                style={styles.pickerCancel}
                onPress={() => setShowDeliveryTypePicker(false)}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Driver Picker Modal */}
      {showDriverPicker && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerModal}>
              <Text style={styles.pickerTitle}>Select Driver</Text>
              <ScrollView style={styles.pickerList}>
                {availableDrivers.map((driver) => (
                  <Pressable
                    key={driver.id}
                    style={styles.pickerItem}
                    onPress={() => selectDriver(driver)}
                  >
                    <Text style={styles.pickerItemText}>{driver.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable 
                style={styles.pickerCancel}
                onPress={() => setShowDriverPicker(false)}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Province Picker Modal */}
      {showProvincePicker && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerModal}>
              <Text style={styles.pickerTitle}>Select Province/State</Text>
              <ScrollView style={styles.pickerList}>
                {provinces.map((province) => (
                  <Pressable
                    key={province}
                    style={styles.pickerItem}
                    onPress={() => selectProvince(province)}
                  >
                    <Text style={styles.pickerItemText}>{province}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable 
                style={styles.pickerCancel}
                onPress={() => setShowProvincePicker(false)}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Container Size Picker Modal */}
      {showContainerPicker && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerModal}>
              <Text style={styles.pickerTitle}>Select Container Size</Text>
              <ScrollView style={styles.pickerList}>
                {(['20', '40'] as const).map((size) => (
                  <Pressable
                    key={size}
                    style={styles.pickerItem}
                    onPress={() => selectContainerSize(size)}
                  >
                    <Text style={styles.pickerItemText}>{size}' Container</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable 
                style={styles.pickerCancel}
                onPress={() => setShowContainerPicker(false)}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
    maxHeight: '95%',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
    elevation: 10,
  },
  scrollView: {
    maxHeight: 600,
  },
  closeButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerModal: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    maxHeight: 400,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerList: {
    maxHeight: 250,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '20',
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  pickerItemSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pickerCancel: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.textSecondary + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
