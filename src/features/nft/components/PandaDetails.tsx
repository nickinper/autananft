import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Divider,
  LinearProgress,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { PandaNFT } from '../../../types';

interface PandaDetailsProps {
  panda: PandaNFT | null;
  open: boolean;
  onClose: () => void;
}

export const PandaDetails: React.FC<PandaDetailsProps> = ({ panda, open, onClose }) => {
  if (!panda) return null;

  const getSanitizedSVG = () => {
    if (!panda.svgData) return '';
    return `data:image/svg+xml;base64,${btoa(DOMPurify.sanitize(panda.svgData))}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{panda.metadata.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={getSanitizedSVG()}
              alt={panda.metadata.name}
              sx={{
                width: '100%',
                height: 'auto',
                backgroundColor: '#0a0a0a',
                borderRadius: 2,
                p: 2,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Backstory
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {panda.metadata.backstory}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Traits
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2">Power Domain</Typography>
                <Chip label={panda.traits.powerDomain} color="primary" />
              </Box>
              
              <Box>
                <Typography variant="subtitle2">Consciousness Level</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(panda.traits.consciousnessLevel / 7) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="caption">
                  Level {panda.traits.consciousnessLevel} of 7
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Geometric Form</Typography>
                <Chip
                  label={panda.traits.geometricForm.shape}
                  sx={{ backgroundColor: panda.traits.geometricForm.color, color: '#fff' }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2">Emotional Profile</Typography>
                <Typography variant="body2">
                  {panda.traits.emotionalProfile.dominantEmotion} 
                  (Intensity: {Math.round(panda.traits.emotionalProfile.intensity * 100)}%)
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Energy Signature</Typography>
                <Typography variant="body2">
                  {panda.traits.energySignature.frequency}Hz - {panda.traits.energySignature.vibration}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Evolution Potential</Typography>
                <LinearProgress
                  variant="determinate"
                  value={panda.traits.evolutionPotential * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                  color="secondary"
                />
                <Typography variant="caption">
                  {Math.round(panda.traits.evolutionPotential * 100)}% potential for growth
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Attributes
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {panda.metadata.attributes.map((attr, index) => (
                <Chip
                  key={index}
                  label={`${attr.trait_type}: ${attr.value}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};