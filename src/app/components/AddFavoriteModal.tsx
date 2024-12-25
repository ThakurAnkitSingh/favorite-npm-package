"use client";

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from 'react-toastify';

interface AddFavoriteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (favorite: { name: string; reason: string }) => void;
  selectedPackage: { name: string } | null;
}

const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  open,
  onClose,
  onSave,
  selectedPackage,
}) => {
  const [reason, setReason] = useState("");

  const handleSave = () => {
    if (!reason.trim()) {
      toast.warn("Please provide a reason");
      return;
    }
    if (selectedPackage) {
      onSave({ name: selectedPackage.name, reason });
    }
    setReason("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="p-8 bg-white rounded-lg shadow-lg"
        style={{
          margin: "auto",
          maxWidth: 600,
          width: '90%',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6">Add to Favorites</h2>
        <p className="text-lg mb-4">Package Name: <span className="font-semibold">{selectedPackage?.name}</span></p>
        <TextField
          label="Why is this your favorite?"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-6"
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outlined" size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" size="large" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddFavoriteModal;