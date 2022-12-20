export const routes = {
  login: "/api/auth/login",
  register: "/api/auth/register",
}

export const login = async (credentials: {
  email: string
  passwordHash: string
}) => {
  const response = await fetch(routes.login, {
    method: "POST",
    body: JSON.stringify({ ...credentials }),
  })
  const data = await response.json()
  return data
}

export const logout = async () => {
  const response = await fetch(routes.login, {
    method: "DELETE",
  })
  const data = await response.json()
  return data
}

export const register = async (credentials: {
  email: string
  username: string
  passwordHash: string
}) => {
  const response = await fetch(routes.login, {
    method: "POST",
    body: JSON.stringify({ ...credentials }),
  })
  const data = await response.json()
  return data
}
