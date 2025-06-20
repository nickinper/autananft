import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { format } from 'date-fns';
import { JournalEntry } from '../../../types';

interface JournalListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onGenerateNFT: (entry: JournalEntry) => void;
}

export const JournalList: React.FC<JournalListProps> = ({
  entries,
  onEdit,
  onDelete,
  onGenerateNFT,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;

  const filteredEntries = entries.filter((entry) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Search in both formats
    let searchableText = '';
    if (entry.sections) {
      searchableText = JSON.stringify(entry.sections).toLowerCase();
    }
    if (entry.entries) {
      searchableText += JSON.stringify(entry.entries).toLowerCase();
    }
    
    return (
      searchableText.includes(searchLower) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredEntries.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const getPreviewText = (entry: JournalEntry): string => {
    // Handle flexible format
    if (entry.entries && entry.entries.length > 0) {
      const previews = entry.entries
        .filter(e => e.type || e.details)
        .slice(0, 2)
        .map(e => {
          const type = e.type ? `${e.type}: ` : '';
          const details = e.details.length > 50 ? e.details.substring(0, 50) + '...' : e.details;
          return type + details;
        });
      return previews.join(' • ') || 'No content';
    }
    
    // Handle legacy format
    if (entry.sections) {
      const { emotionalSummary, streamOfConsciousness } = entry.sections.personalReflections;
      const preview = emotionalSummary || streamOfConsciousness || 'No content';
      return preview.length > 150 ? preview.substring(0, 150) + '...' : preview;
    }
    
    return 'No content';
  };

  const getConsciousnessColor = (level: number = 1): string => {
    const colors = ['#FF6B6B', '#FFA500', '#FFD700', '#90EE90', '#87CEEB', '#9370DB', '#FF1493'];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search journal entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {paginatedEntries.map((entry) => (
          <Grid item xs={12} md={6} key={entry.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  {entry.consciousnessLevel && (
                    <Chip
                      label={`Level ${entry.consciousnessLevel}`}
                      size="small"
                      sx={{
                        backgroundColor: getConsciousnessColor(entry.consciousnessLevel),
                        color: '#fff',
                      }}
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {getPreviewText(entry)}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {entry.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </CardContent>

              <CardActions>
                <IconButton size="small" onClick={() => onEdit(entry)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(entry.id)}>
                  <DeleteIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  size="small"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={() => onGenerateNFT(entry)}
                  sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                  }}
                >
                  Generate Panda
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {filteredEntries.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No entries found matching your search.' : 'No journal entries yet.'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {!searchQuery && 'Start by creating your first journal entry!'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};