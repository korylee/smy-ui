module.exports = {
  name: 'Smy',
  namespace: 'smy',
  host: 'localhost',
  port: 8080,
  title: 'SMY UI',
  themesKey: 'SMY_THEMES',
  highlight: {
    /**
     * @see https://highlightjs.org/
     */
    style: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.2/styles/nord.min.css',
  },
  pc: {
    redirect: '/index',
    menu: [],
    title: 'Smy h5',
  },
  mobile: {
    redirect: '/home',
  },
  themes: {
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
    'color-hl-background': '#fafafa',
    'color-hl-code': '#58727e',
  },
}
