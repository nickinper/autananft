import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Tabs,
  Tab,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import { JournalEntry, JournalSections } from '../../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`journal-tabpanel-${index}`}
      aria-labelledby={`journal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface JournalFormProps {
  initialData?: JournalEntry;
  onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [date, setDate] = useState<Date | null>(
    initialData ? new Date(initialData.date) : new Date()
  );
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  
  const [sections, setSections] = useState<JournalSections>(
    initialData?.sections || {
      personalReflections: {
        emotionalSummary: '',
        streamOfConsciousness: '',
        spiritualInsights: '',
      },
      progressTracking: {
        learning: '',
        business: '',
        physicalActivity: '',
      },
      lessonsInsights: {
        lessonsLearned: '',
        devilsAdvocate: '',
        standoutMoments: '',
      },
      experiences: {
        places: '',
        people: '',
        memorableMoments: '',
        patternRecognition: '',
      },
      planning: {
        tomorrowsPlan: '',
        futureInspiration: '',
        reminders: '',
      },
      contextMedia: {
        worldEvents: '',
        stockMarket: '',
        tags: [],
      },
    }
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const updateSection = (section: keyof JournalSections, field: string, value: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
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

    const updatedSections = {
      ...sections,
      contextMedia: {
        ...sections.contextMedia,
        tags,
      },
    };

    onSubmit({
      date: date.toISOString(),
      sections: updatedSections,
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab label="Personal Reflections" />
          <Tab label="Progress Tracking" />
          <Tab label="Lessons & Insights" />
          <Tab label="Experiences" />
          <Tab label="Planning" />
          <Tab label="Context & Media" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Stack spacing={3}>
          <TextField
            label="Emotional Summary"
            multiline
            rows={3}
            fullWidth
            value={sections.personalReflections.emotionalSummary}
            onChange={(e) =>
              updateSection('personalReflections', 'emotionalSummary', e.target.value)
            }
          />
          <TextField
            label="Stream of Consciousness"
            multiline
            rows={4}
            fullWidth
            value={sections.personalReflections.streamOfConsciousness}
            onChange={(e) =>
              updateSection('personalReflections', 'streamOfConsciousness', e.target.value)
            }
          />
          <TextField
            label="Spiritual Insights"
            multiline
            rows={3}
            fullWidth
            value={sections.personalReflections.spiritualInsights}
            onChange={(e) =>
              updateSection('personalReflections', 'spiritualInsights', e.target.value)
            }
          />
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Stack spacing={3}>
          <TextField
            label="Learning Progress"
            multiline
            rows={3}
            fullWidth
            value={sections.progressTracking.learning}
            onChange={(e) =>
              updateSection('progressTracking', 'learning', e.target.value)
            }
          />
          <TextField
            label="Business Progress"
            multiline
            rows={3}
            fullWidth
            value={sections.progressTracking.business}
            onChange={(e) =>
              updateSection('progressTracking', 'business', e.target.value)
            }
          />
          <TextField
            label="Physical Activity"
            multiline
            rows={3}
            fullWidth
            value={sections.progressTracking.physicalActivity}
            onChange={(e) =>
              updateSection('progressTracking', 'physicalActivity', e.target.value)
            }
          />
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Stack spacing={3}>
          <TextField
            label="Lessons Learned"
            multiline
            rows={3}
            fullWidth
            value={sections.lessonsInsights.lessonsLearned}
            onChange={(e) =>
              updateSection('lessonsInsights', 'lessonsLearned', e.target.value)
            }
          />
          <TextField
            label="Devil's Advocate"
            multiline
            rows={3}
            fullWidth
            value={sections.lessonsInsights.devilsAdvocate}
            onChange={(e) =>
              updateSection('lessonsInsights', 'devilsAdvocate', e.target.value)
            }
          />
          <TextField
            label="Standout Moments"
            multiline
            rows={3}
            fullWidth
            value={sections.lessonsInsights.standoutMoments}
            onChange={(e) =>
              updateSection('lessonsInsights', 'standoutMoments', e.target.value)
            }
          />
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Stack spacing={3}>
          <TextField
            label="Places Visited"
            multiline
            rows={2}
            fullWidth
            value={sections.experiences.places}
            onChange={(e) =>
              updateSection('experiences', 'places', e.target.value)
            }
          />
          <TextField
            label="People Met"
            multiline
            rows={2}
            fullWidth
            value={sections.experiences.people}
            onChange={(e) =>
              updateSection('experiences', 'people', e.target.value)
            }
          />
          <TextField
            label="Memorable Moments"
            multiline
            rows={3}
            fullWidth
            value={sections.experiences.memorableMoments}
            onChange={(e) =>
              updateSection('experiences', 'memorableMoments', e.target.value)
            }
          />
          <TextField
            label="Pattern Recognition"
            multiline
            rows={3}
            fullWidth
            value={sections.experiences.patternRecognition}
            onChange={(e) =>
              updateSection('experiences', 'patternRecognition', e.target.value)
            }
          />
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Stack spacing={3}>
          <TextField
            label="Tomorrow's Plan"
            multiline
            rows={3}
            fullWidth
            value={sections.planning.tomorrowsPlan}
            onChange={(e) =>
              updateSection('planning', 'tomorrowsPlan', e.target.value)
            }
          />
          <TextField
            label="Future Inspiration"
            multiline
            rows={3}
            fullWidth
            value={sections.planning.futureInspiration}
            onChange={(e) =>
              updateSection('planning', 'futureInspiration', e.target.value)
            }
          />
          <TextField
            label="Reminders"
            multiline
            rows={3}
            fullWidth
            value={sections.planning.reminders}
            onChange={(e) =>
              updateSection('planning', 'reminders', e.target.value)
            }
          />
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Stack spacing={3}>
          <TextField
            label="World Events"
            multiline
            rows={3}
            fullWidth
            value={sections.contextMedia.worldEvents}
            onChange={(e) =>
              updateSection('contextMedia', 'worldEvents', e.target.value)
            }
          />
          <TextField
            label="Stock Market Notes"
            multiline
            rows={3}
            fullWidth
            value={sections.contextMedia.stockMarket}
            onChange={(e) =>
              updateSection('contextMedia', 'stockMarket', e.target.value)
            }
          />
          <Box>
            <Typography variant="subtitle1" gutterBottom>
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
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </TabPanel>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? 'Update' : 'Create'} Entry
        </Button>
      </Box>
    </Paper>
  );
};