type Text = {da: string, en: string}
type Texts = {[key: string]: Text}

export const TEXTS: Texts = Object.freeze({
  'header': {
    da: 'Maiken Vibe Bauer',
    en: 'Maiken Vibe Bauer'
  },
  'footer': {
    da: 'Rum for Radikal Lytning',
    en: 'Space for Radical Listening'
  },
})