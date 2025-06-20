import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { JournalEntry, FlexibleEntry } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

interface FlexibleJournalFormProps {
  initialData?: JournalEntry;
  onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const FlexibleJournalForm: React.FC<FlexibleJournalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [date, setDate] = useState<Date | null>(
    initialData ? new Date(initialData.date) : new Date()
  );
  const [entries, setEntries] = useState<FlexibleEntry[]>(
    initialData?.entries || [{ id: uuidv4(), type: '', details: '' }]
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleAddEntry = () => {
    setEntries([...entries, { id: uuidv4(), type: '', details: '' }]);
  };

  const handleUpdateEntry = (id: string, field: 'type' | 'details', value: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleRemoveEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!date) return;

    // Filter out empty entries
    const validEntries = entries.filter(entry => 
      entry.type.trim() || entry.details.trim()
    );

    if (validEntries.length === 0) {
      // Ensure at least one entry
      return;
    }

    onSubmit({
      date: date.toISOString(),
      entries: validEntries.map(entry => ({
        ...entry,
        timestamp: new Date().toISOString()
      })),
      tags,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Journal Entry' : 'New Journal Entry'}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Entry Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          sx={{ mb: 3, width: '100%' }}
        />
      </LocalizationProvider>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Journal Entries
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add different types of entries for your day. You can have multiple entries with different subjects.
      </Typography>

      <Stack spacing={2}>
        {entries.map((entry, index) => (
          <Card key={entry.id} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Entry Type/Subject"
                    placeholder="e.g., Work, Personal, Health, Ideas..."
                    fullWidth
                    value={entry.type}
                    onChange={(e) => handleUpdateEntry(entry.id, 'type', e.target.value)}
                  />
                  {entries.length > 1 && (
                    <IconButton 
                      onClick={() => handleRemoveEntry(entry.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
                <TextField
                  label="Details"
                  placeholder="Write your thoughts, experiences, or notes here..."
                  multiline
                  rows={4}
                  fullWidth
                  value={entry.details}
                  onChange={(e) => handleUpdateEntry(entry.id, 'details', e.target.value)}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddEntry}
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Add Another Entry
      </Button>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Tags
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <IconButton onClick={handleAddTag} size="small">
            <AddIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!entries.some(e => e.type.trim() || e.details.trim())}
        >
          {initialData ? 'Update' : 'Create'} Entry
        </Button>
      </Box>
    </Paper>
  );
};