export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}