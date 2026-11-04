import { useQuery } from '@tanstack/react-query'
import { friendsApi } from './friends-api'
import { friendKeys } from './keys'

export const useFriendMoments = () =>
  useQuery({ queryKey: friendKeys.list(), queryFn: friendsApi.listFriendMoments })
