// src/components/modals/AllocationModal.tsx
import React from 'react';
import Modal from '../common/Modal';
import AllocationForm from '../forms/AllocationForm';

// Define the interface for the bill event data
interface BillEvent {
  id: string;
  payee: string;
  due_date: string;
  amount_due: number;
  description?: string | null;
}

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  billEvent: BillEvent | null;
}

const AllocationModal: React.FC<AllocationModalProps> = ({
  isOpen,
  onClose,
  billEvent
}) => {
  // Safety check - only render if we have bill event data
  if (!billEvent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Allocate Funds for ${billEvent.payee}`}
      size="md"
    >
      <AllocationForm
        billEvent={billEvent}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AllocationModal;