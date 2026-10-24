const API_ENDPOINTS = {
  accounts: {
    register: "/accounts/register/",
    login: "/accounts/login/",
    logout: "/accounts/logout/",
    profile: "/accounts/profile/",
    changePassword: "/accounts/change-password/",
    updateProfile: "/accounts/profile/update/",
    passwordReset: "/accounts/password-reset/",
    passwordResetConfirm: "/accounts/password-reset/confirm/",
  },
  packages: {
    list: "/packages/",
    detail: (id: number) => `/packages/${id}/`,
  },
};

export default API_ENDPOINTS;
