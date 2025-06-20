import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PandaCard } from '../features/nft/components/PandaCard';
import { PandaDetails } from '../features/nft/components/PandaDetails';
import { PandaNFT, PowerDomain } from '../types';
import { storage } from '../services/storage';

export const Gallery: React.FC = () => {
  const [pandas, setPandas] = useState<PandaNFT[]>([]);
  const [filteredPandas, setFilteredPandas] = useState<PandaNFT[]>([]);
  const [selectedPanda, setSelectedPanda] = useState<PandaNFT | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState<PowerDomain | 'ALL'>('ALL');
  const [filterLevel, setFilterLevel] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    loadPandas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pandas, searchQuery, filterDomain, filterLevel]);

  const loadPandas = () => {
    const storedPandas = storage.getItem<PandaNFT[]>('generated_pandas') || [];
    
    const generatedPanda = localStorage.getItem('autana:generated_panda');
    if (generatedPanda) {
      const newPanda = JSON.parse(generatedPanda);
      const exists = storedPandas.some(p => p.id === newPanda.id);
      if (!exists) {
        storedPandas.push(newPanda);
        storage.setItem('generated_pandas', storedPandas);
      }
      localStorage.removeItem('autana:generated_panda');
    }
    
    setPandas(storedPandas);
  };

  const applyFilters = () => {
    let filtered = [...pandas];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(panda =>
        panda.metadata.name.toLowerCase().includes(query) ||
        panda.metadata.backstory.toLowerCase().includes(query) ||
        panda.traits.powerDomain.toLowerCase().includes(query)
      );
    }

    if (filterDomain !== 'ALL') {
      filtered = filtered.filter(panda => panda.traits.powerDomain === filterDomain);
    }

    if (filterLevel !== 'ALL') {
      filtered = filtered.filter(panda => panda.traits.consciousnessLevel === filterLevel);
    }

    setFilteredPandas(filtered);
  };

  const handleViewDetails = (panda: PandaNFT) => {
    setSelectedPanda(panda);
    setDetailsOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panda NFT Gallery
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your collection of consciousness-infused panda NFTs, each uniquely generated from your journal entries.
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search pandas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Power Domain</InputLabel>
          <Select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value as PowerDomain | 'ALL')}
            label="Power Domain"
          >
            <MenuItem value="ALL">All Domains</MenuItem>
            {Object.values(PowerDomain).map(domain => (
              <MenuItem key={domain} value={domain}>{domain}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Consciousness Level</InputLabel>
          <Select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as number | 'ALL')}
            label="Consciousness Level"
          >
            <MenuItem value="ALL">All Levels</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7].map(level => (
              <MenuItem key={level} value={level}>Level {level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredPandas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {pandas.length === 0 
              ? 'No pandas generated yet.' 
              : 'No pandas match your filters.'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {pandas.length === 0 && 'Generate your first panda from a journal entry!'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPandas.map((panda) => (
            <Grid item xs={12} sm={6} md={4} key={panda.id}>
              <PandaCard panda={panda} onViewDetails={handleViewDetails} />
            </Grid>
          ))}
        </Grid>
      )}

      <PandaDetails
        panda={selectedPanda}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </Container>
  );
};