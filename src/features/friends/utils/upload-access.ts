// The access token from a correct class code, kept only for this browser tab.
const KEY = 'pare-moments:upload-token'

export const getUploadToken = () => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

export const saveUploadToken = (token: string) => {
  try {
    sessionStorage.setItem(KEY, token)
  } catch {
    // Without storage the person will be asked for the code again next time.
  }
}

export const clearUploadToken = () => {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}
