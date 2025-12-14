"use client"

import type { User } from "./types"

const USERS_KEY = "sweet_shop_users"
const CURRENT_USER_KEY = "sweet_shop_current_user"

// Initialize with default admin user
const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: "1",
        email: "admin@sweetshop.com",
        password: "admin123", // In production, this would be hashed
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        email: "manager@sweetshop.com",
        password: "manager123",
        role: "manager",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    initializeUsers()
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  register: async (email: string, password: string, role: "manager" | "staff" = "staff"): Promise<User> => {
    initializeUsers()
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

    if (users.some((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return newUser
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  getAllUsers: (): User[] => {
    initializeUsers()
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  },

  updateUser: (userId: string, updates: Partial<User>): User => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const index = users.findIndex((u) => u.id === userId)

    if (index === -1) {
      throw new Error("User not found")
    }

    users[index] = { ...users[index], ...updates }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return users[index]
  },

  deleteUser: (userId: string): void => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    const filtered = users.filter((u) => u.id !== userId)
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered))
  },
}
