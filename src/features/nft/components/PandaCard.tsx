import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import DOMPurify from 'dompurify';
import { PandaNFT } from '../../../types';

interface PandaCardProps {
  panda: PandaNFT;
  onViewDetails?: (panda: PandaNFT) => void;
}

export const PandaCard: React.FC<PandaCardProps> = ({ panda, onViewDetails }) => {
  const handleDownload = () => {
    if (!panda.svgData) return;

    const blob = new Blob([panda.svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${panda.metadata.name.replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSanitizedSVG = () => {
    if (!panda.svgData) return '';
    return `data:image/svg+xml;base64,${btoa(DOMPurify.sanitize(panda.svgData))}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={getSanitizedSVG()}
        alt={panda.metadata.name}
        sx={{
          objectFit: 'contain',
          backgroundColor: '#0a0a0a',
          p: 2,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {panda.metadata.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {panda.metadata.description}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip
            label={panda.traits.powerDomain}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Level ${panda.traits.consciousnessLevel}`}
            size="small"
            sx={{
              backgroundColor: `hsl(${panda.traits.consciousnessLevel * 50}, 70%, 50%)`,
              color: '#fff',
            }}
          />
          <Chip
            label={panda.traits.geometricForm.shape}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Evolution Potential: {Math.round(panda.traits.evolutionPotential * 100)}%
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>
            {onViewDetails && (
              <IconButton size="small" onClick={() => onViewDetails(panda)}>
                <InfoIcon />
              </IconButton>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};