module.exports = {
  name: 'Smy',
  namespace: 'smy',
  host: 'localhost',
  port: 8080,
  title: 'SMY UI',
  themeKey: 'SMY_THEMES',
  pc: {
    redirect: '/index',
    menu: [],
    title: 'Smy',
    fold: {
      height: 50,
      default: false,
    },
  },
  mobile: {
    redirect: '/home',
  },
  lightTheme: {
    'color-body': '#fff',
    'color-bar': '#fff',
    'color-home-page-background': '#fff',
    'color-home-page-slash': '#ccc',
    'color-home-page-primary-button-background': '#3a7afe',
    'color-home-page-extra-button-background': '#f5f5f5',
    'color-home-page-github-button-background': '#212121',
    'color-sub-bar': '#f5f5f5',
    'color-text': '#555',
    'color-sub-text': '#888',
    'color-border': 'rgba(0, 0, 0, 0.12)',
    'color-shadow': '#eee',
    'color-introduce-border': '#2196f3',
    'color-primary': '#2196f3',
    'color-link': '#00c48f',
    'color-progress': '#1d92e9',
    'color-progress-track': '#fff',
    'color-sidebar': '#3a7afe',
    'color-sidebar-active-background': '#3a7afe1a',
    'hl-border': '#f3f3f3',
    'hl-background': 'rgb(250, 250, 252)',
    'hl-font-size': '14px',
    'hl-font-family': 'SFMono-Regular, Menlo, Consolas, Courier, monospace',
    'hl-text-color': 'rgb(51, 54, 57)',
    'hl-mono-3': '#a0a1a7',
    'hl-hue-1': '#0184bb',
    'hl-hue-2': '#4078f2',
    'hl-hue-3': '#a626a4',
    'hl-hue-4': '#50a14f',
    'hl-hue-5': '#e45649',
    'hl-hue-5-2': '#c91243',
    'hl-hue-6': '#986801',
    'hl-hue-6-2': '#c18401',
  },
  icons: {
    name: 'smy-h5-icons',
    namespace: 'smy-icon',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamilyClassName: 'smy-icon--set',
    base64: true,
  },
}
