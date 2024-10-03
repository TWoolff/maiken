type Text = {da: string, en: string}
type Texts = {[key: string]: Text}

export const TEXTS: Texts = Object.freeze({
  'header': {
    da: 'Maiken Vibe Bauer | Rum for Radikal Lytning',
    en: 'Maiken Vibe Bauer | Space for Radical Listening'
  },
  'footer': {
    da: 'Kontakt',
    en: 'Contact'
  },
})