const TOKEN_KEY = localStorage.getItem("token");

export const login = () => {
  localStorage.setItem("token", TOKEN_KEY);
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isLogin = () => {
  if (localStorage.getItem("token")) {
    return true;
  }

  return false;
};
