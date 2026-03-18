const mockLowlight = {
  highlight: () => ({ value: [] }),
  highlightAuto: () => ({ value: [] }),
  listLanguages: () => [],
  registered: () => false,
  register: () => {},
}

export const createLowlight = () => mockLowlight
export const common = {}
export const all = {}
