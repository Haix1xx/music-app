export interface Register {
  email: string | boolean
  password: string | boolean
  passwordConfirm: string | boolean
  firstname: string | boolean
  lastname: string | boolean
  gender: boolean | string
  bio?: string | boolean
  avatar?: string | boolean
  birthday?: Date | boolean | null
}
