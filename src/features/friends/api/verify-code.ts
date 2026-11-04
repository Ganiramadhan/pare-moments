import { useMutation } from '@tanstack/react-query'
import { friendsApi } from './friends-api'

export const useVerifyCode = () => useMutation({ mutationFn: friendsApi.verifyCode })
