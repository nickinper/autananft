import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import { JournalForm } from '../features/journal/components/JournalForm';
import { FlexibleJournalForm } from '../features/journal/components/FlexibleJournalForm';
import { JournalList } from '../features/journal/components/JournalList';
import { useJournal } from '../features/journal/hooks/useJournal';
import { JournalEntry } from '../types';
import { PandaGenerator } from '../features/nft/services/PandaGenerator';
import { useNavigate } from 'react-router-dom';

export const Journal: React.FC = () => {
  const navigate = useNavigate();
  const { entries, createEntry, updateEntry, deleteEntry } = useJournal();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'flexible' | 'structured'>('flexible');

  const handleCreate = async (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createEntry(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, data);
      setEditingEntry(null);
      setShowForm(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    // Detect format based on entry structure
    if (entry.entries && entry.entries.length > 0) {
      setFormMode('flexible');
    } else if (entry.sections) {
      setFormMode('structured');
    }
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteEntry(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleGenerateNFT = (entry: JournalEntry) => {
    const panda = PandaGenerator.generateFromJournal(entry);
    localStorage.setItem('autana:generated_panda', JSON.stringify(panda));
    navigate('/gallery');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Journal Entries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          size="large"
        >
          New Entry
        </Button>
      </Box>

      {showForm && (
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={formMode}
            exclusive
            onChange={(e, newMode) => newMode && setFormMode(newMode)}
            size="small"
          >
            <ToggleButton value="flexible">
              <ViewListIcon sx={{ mr: 1 }} />
              Flexible Format
            </ToggleButton>
            <ToggleButton value="structured">
              <GridViewIcon sx={{ mr: 1 }} />
              Structured Format
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {showForm ? (
        formMode === 'flexible' ? (
          <FlexibleJournalForm
            initialData={editingEntry || undefined}
            onSubmit={editingEntry ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        ) : (
          <JournalForm
            initialData={editingEntry || undefined}
            onSubmit={editingEntry ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        )
      ) : (
        <JournalList
          entries={entries}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          onGenerateNFT={handleGenerateNFT}
        />
      )}

      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
      >
        <DialogTitle>Delete Journal Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this journal entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};