export type FriendMoment = {
  id: string
  // Who shared it. Free text; there are no accounts.
  name: string
  caption: string
  photos: string[]
  createdAt: string
}

export type NewFriendMoment = {
  name: string
  caption: string
  // Already compressed in the browser.
  photos: File[]
}
