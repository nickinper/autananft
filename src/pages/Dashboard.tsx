import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  LinearProgress,
} from '@mui/material';
import { useJournal } from '../features/journal/hooks/useJournal';
import { storage } from '../services/storage';
import { PandaNFT } from '../types';

export const Dashboard: React.FC = () => {
  const { entries } = useJournal();
  const pandas = storage.getItem<PandaNFT[]>('generated_pandas') || [];

  const getConsciousnessDistribution = () => {
    const distribution = Array(7).fill(0);
    entries.forEach(entry => {
      if (entry.consciousnessLevel) {
        distribution[entry.consciousnessLevel - 1]++;
      }
    });
    return distribution;
  };

  const getPowerDomainDistribution = () => {
    const domainCounts: { [key: string]: number } = {};
    pandas.forEach(panda => {
      domainCounts[panda.traits.powerDomain] = (domainCounts[panda.traits.powerDomain] || 0) + 1;
    });
    return domainCounts;
  };

  const consciousnessData = getConsciousnessDistribution();
  const domainData = getPowerDomainDistribution();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Metatronic Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Sacred geometry visualization and consciousness metrics (Coming Soon)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Journal Statistics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Entries: {entries.length}
              </Typography>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Consciousness Level Distribution
            </Typography>
            {consciousnessData.map((count, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Level {index + 1}</Typography>
                  <Typography variant="caption">{count} entries</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={entries.length > 0 ? (count / entries.length) * 100 : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Panda Collection
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Pandas: {pandas.length}
              </Typography>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Power Domain Distribution
            </Typography>
            {Object.entries(domainData).map(([domain, count]) => (
              <Box key={domain} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">{domain}</Typography>
                  <Typography variant="caption">{count} pandas</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pandas.length > 0 ? (count / pandas.length) * 100 : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="secondary"
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Sacred Geometry Visualization
            </Typography>
            <Box
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0a0a0a',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Golden spiral, Metatron's cube, and consciousness mapping visualization coming soon...
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};