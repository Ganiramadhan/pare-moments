export const friendKeys = {
  all: ['friend-moments'] as const,
  list: () => [...friendKeys.all, 'list'] as const,
}
