import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    id: string
    user: JWT
  }

  interface User {
    _doc: {
      _id: string
      name: string
      email: string
      phonenumber: string
      role: string
      preferences: any
      createdAt: any
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _doc: {
      _id: string
      name: string
      email: string
      phonenumber: string
      role: string
      preferences: any
      createdAt: any
    }
  }
}
