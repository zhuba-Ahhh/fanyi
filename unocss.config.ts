import { defineConfig, presetIcons, presetUno, presetAttributify } from 'unocss';

export const theme = {
  colors: {
    primary: 'var(--adm-color-primary)',
    text: 'var(--adm-color-text)',
    sed: 'var(--adm-color-text-secondary)',
    light: 'var(--adm-color-light)',
  },
};

export const unocssPresets = [presetUno(), presetAttributify(), presetIcons()];

export default defineConfig({
  presets: unocssPresets,
  rules: [
    [/^w-(\d+)$/, ([, d]: any) => ({ width: `${d / 4}rem` })],
    [/^h-(\d+)$/, ([, d]: any) => ({ height: `${d / 4}rem` })],
    // m-1 => margin: 1px; m-100 => margin: 100px
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    // p-1 => padding: 1px; m-100 => padding: 100px
    [/^p-(\d+)$/, (match) => ({ padding: `${match[1]}px` })],
  ],
  theme: theme,
});
