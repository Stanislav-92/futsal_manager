import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { GB, PL, UA } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage, type AppLanguage, SUPPORTED_LANGUAGES } from '@/shared/i18n/i18n';

const LANGUAGE_OPTIONS: {
  code: AppLanguage;
  labelKey: 'language.english' | 'language.ukrainian' | 'language.polish';
  FlagIcon: React.ComponentType<{ width?: number }>;
}[] = [
  { code: 'en', labelKey: 'language.english', FlagIcon: GB },
  { code: 'uk', labelKey: 'language.ukrainian', FlagIcon: UA },
  { code: 'pl', labelKey: 'language.polish', FlagIcon: PL },
];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const currentLanguage = SUPPORTED_LANGUAGES.includes(i18n.language as AppLanguage)
    ? (i18n.language as AppLanguage)
    : 'en';

  return (
    <Select
      value={currentLanguage}
      onChange={(e) => changeAppLanguage(e.target.value as AppLanguage)}
      size="small"
      variant="outlined"
      MenuProps={{
        disableScrollLock: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        PaperProps: {
          sx: {
            mt: 1,
            width: 160,
            borderRadius: 2,
          },
        },
      }}
      sx={{
        width: 160,
        height: 40,
        color: 'white',

        '.MuiSelect-select': {
          py: 0.75,
          pr: '32px !important',
          display: 'flex',
          alignItems: 'center',
        },

        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255,255,255,0.6)',
        },

        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
          borderWidth: '1px',
        },

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
          borderWidth: '1px',
        },

        '.MuiSvgIcon-root': {
          color: 'white',
        },
      }}
      renderValue={(value) => {
        const option = LANGUAGE_OPTIONS.find((o) => o.code === value);

        if (!option) return value;

        const FlagIcon = option.FlagIcon;

        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2">{t(option.labelKey)}</Typography>
            <Box component={FlagIcon} sx={{ width: 20 }} />
          </Stack>
        );
      }}
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const FlagIcon = option.FlagIcon;

        return (
          <MenuItem key={option.code} value={option.code}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2">{t(option.labelKey)}</Typography>
              <Box component={FlagIcon} sx={{ width: 20 }} />
            </Stack>
          </MenuItem>
        );
      })}
    </Select>
  );
}
