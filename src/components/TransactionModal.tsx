import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

interface TransactionModalProps {
  visible: boolean;
  status: TransactionStatus;
  txHash: string | null;
  error: string | null;
  onDismiss: () => void;
  onRetry: () => void;
}

const VOYAGER_BASE_URL = 'https://sepolia.voyager.online/tx';

const truncateHash = (hash: string) =>
  `${hash.slice(0, 10)}...${hash.slice(-8)}`;

export function TransactionModal({
  visible,
  status,
  txHash,
  error,
  onDismiss,
  onRetry,
}: TransactionModalProps) {
  const handleViewOnVoyager = () => {
    if (txHash) {
      Linking.openURL(`${VOYAGER_BASE_URL}/${txHash}`);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'pending':
        return (
          <View style={styles.content}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.statusText}>Transaction pending...</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={onDismiss}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );

      case 'success':
        return (
          <View style={styles.content}>
            <Text style={styles.successIcon}>{'\u2714'}</Text>
            <Text style={styles.statusText}>Transaction confirmed</Text>
            {txHash && (
              <>
                <Text style={styles.hashText}>{truncateHash(txHash)}</Text>
                <TouchableOpacity
                  style={styles.voyagerButton}
                  onPress={handleViewOnVoyager}
                >
                  <Text style={styles.voyagerButtonText}>View on Voyager</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.doneButton} onPress={onDismiss}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        );

      case 'error':
        return (
          <View style={styles.content}>
            <Text style={styles.errorIcon}>{'\u2716'}</Text>
            <Text style={styles.statusText}>Transaction failed</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>{renderContent()}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: '85%',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  successIcon: {
    fontSize: 48,
    color: '#28a745',
  },
  errorIcon: {
    fontSize: 48,
    color: '#dc3545',
  },
  hashText: {
    fontSize: 14,
    fontFamily: 'Courier',
    color: '#666',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 240,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  voyagerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    marginBottom: 12,
  },
  voyagerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0066cc',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
