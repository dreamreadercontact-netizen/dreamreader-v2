export type UserRole = 'reader' | 'admin'

export interface Profile {
  id: string
  name: string
  role: UserRole
  subscribed: boolean
  avatar: string
  created_at: string
}

export interface Novel {
  id: number
  author_id: string | null
  title: string
  genre: string
  description: string
  cover: string
  status: 'live' | 'soon' | 'finished'
  followers: number
  created_at: string
  chapters?: Chapter[]
}

export interface Chapter {
  id: number
  novel_id: number
  num: number
  title: string
  content?: string
  free: boolean
  published_at: string
  vote_open: boolean
  vote_closed: boolean
  winner_option_id: number | null
  vote_options?: VoteOption[]
  comments?: Comment[]
}

export interface VoteOption {
  id: number
  chapter_id: number
  text: string
  votes: number
}

export interface Comment {
  id: number
  chapter_id: number
  user_id: string
  text: string
  likes: number
  created_at: string
  profile?: Profile
}

export interface Candidature {
  id: number
  name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
