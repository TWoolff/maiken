type Text = {'da-DK': string, 'en-US': string}
type Texts = {[key: string]: Text}

export const TEXTS: Texts = Object.freeze({
  'header': {
    'da-DK': 'Maiken Vibe Bauer | Rum for Radikal Lytning',
    'en-US': 'Maiken Vibe Bauer | Space for Radical Listening'
  },
  'footer': {
    'da-DK': 'Kontakt',
    'en-US': 'Contact'
  },
})