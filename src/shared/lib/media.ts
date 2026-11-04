const VIDEO_PATTERN = /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i

// Photos and videos share one list; the file extension tells them apart.
export const isVideoSource = (src: string) => VIDEO_PATTERN.test(src)
