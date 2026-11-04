import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { NewFriendMoment } from '../types/friend-moment'
import { friendsApi } from './friends-api'
import { friendKeys } from './keys'

type CreateInput = {
  moment: NewFriendMoment
  token: string
}

export const useCreateFriendMoment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ moment, token }: CreateInput) => friendsApi.createFriendMoment(moment, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.all }),
  })
}
