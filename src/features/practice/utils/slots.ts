import { pick, type Random } from './random'

const GIRLS = ['Ayu', 'Citra', 'Dewi', 'Fitri', 'Maya', 'Putri', 'Rina', 'Sari', 'Wulan', 'Nadia']
const BOYS = ['Adi', 'Budi', 'Dimas', 'Eko', 'Fajar', 'Gilang', 'Hadi', 'Rizky', 'Yoga', 'Bayu']

export type Slots = { name: string; f: string; m: string }

// One random name of each kind, chosen once per question so the sentence and its explanation agree.
export const makeSlots = (random: Random): Slots => ({
  name: pick([...GIRLS, ...BOYS], 1, random)[0]!,
  f: pick(GIRLS, 1, random)[0]!,
  m: pick(BOYS, 1, random)[0]!,
})

// {name} is any name, {f} a girl's name (use with she / her), {m} a boy's name (use with he / him).
export const fillSlots = (text: string, slots: Slots) =>
  text.replace(/\{(name|f|m)\}/g, (_, key: keyof Slots) => slots[key])
