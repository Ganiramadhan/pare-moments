// Word forms of a verb, used to write wrong choices and to build sentences.

// Short verbs that double their last letter before -ing / -ed (run -> running, stop -> stopped).
const DOUBLING = [
  'sit',
  'run',
  'get',
  'put',
  'cut',
  'swim',
  'win',
  'let',
  'begin',
  'forget',
  'stop',
  'plan',
]

const stem = (base: string) => (DOUBLING.includes(base) ? `${base}${base.slice(-1)}` : base)

// "go" -> "goed": the mistake people make with irregular verbs.
export const regularized = (base: string) =>
  base.endsWith('e')
    ? `${base}d`
    : base.endsWith('y')
      ? `${base.slice(0, -1)}ied`
      : `${stem(base)}ed`

export const withIng = (base: string) =>
  /[^e]e$/.test(base) ? `${base.slice(0, -1)}ing` : `${stem(base)}ing`

// he / she form: watch -> watches, study -> studies, go -> goes.
export const withS = (base: string) =>
  /(s|sh|ch|x|o)$/.test(base)
    ? `${base}es`
    : /[^aeiou]y$/.test(base)
      ? `${base.slice(0, -1)}ies`
      : `${base}s`
