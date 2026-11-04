export type Moment = {
  id: string
  title: string
  // The day it happened, as YYYY-MM-DD.
  date: string
  caption: string
  location?: string
  // Photos and videos in public/images, e.g. '/images/day-1.jpeg'. Videos are told apart by their
  // file extension. The first photo is the cover.
  photos: string[]
  milestone?: boolean
}

export type Slide = {
  src: string
  // Day 1, Day 2... counted from the first day of the story.
  day: number
  momentId: string
  title: string
  caption: string
  date: string
  location?: string
}
