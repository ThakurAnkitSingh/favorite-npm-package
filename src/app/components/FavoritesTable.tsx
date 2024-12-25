"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Favorite {
  name: string;
  reason: string;
}

interface FavoritesTableProps {
  favorites: Favorite[];
  onRemoveFavorite: (favorite: Favorite) => void;
  onEditFavorite: (name: string, newReason: string) => void;
}

const FavoritesTable = ({ favorites, onRemoveFavorite, onEditFavorite }: FavoritesTableProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite | null>(null);
  const [editedReason, setEditedReason] = useState('');

  const handleEditClick = (favorite: Favorite) => {
    setSelectedFavorite(favorite);
    setEditedReason(favorite.reason);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedFavorite && editedReason.trim()) {
      onEditFavorite(selectedFavorite.name, editedReason);
      setEditModalOpen(false);
    }
  };

  const handleDeleteClick = (favorite: Favorite) => {
    setSelectedFavorite(favorite);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFavorite) {
      onRemoveFavorite(selectedFavorite);
      setDeleteDialogOpen(false);
      setSelectedFavorite(null);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#2196F3' }}>
              <TableCell style={{ color: '#fff' }}>Package Name</TableCell>
              <TableCell style={{ color: '#fff' }}>Reason</TableCell>
              <TableCell style={{ color: '#fff' }}>Edit</TableCell>
              <TableCell style={{ color: '#fff' }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favorites.map((favorite) => (
              <TableRow key={favorite.name}>
                <TableCell>{favorite.name}</TableCell>
                <TableCell>{favorite.reason}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(favorite)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteClick(favorite)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Reason for {selectedFavorite?.name}
          </Typography>
          <TextField
            label="Reason"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={editedReason}
            onChange={(e) => setEditedReason(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{selectedFavorite?.name}&quot; from your favorites?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FavoritesTable; 