const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getSenders = async () => {
  const response = await fetch(`${API_BASE_URL}/senders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch senders");
  }

  return data;
};

export const getSenderEmails = async (senderId) => {
  const response = await fetch(`${API_BASE_URL}/senders/${senderId}/emails`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sender emails");
  }

  return data;
};


export const getEmailAccounts = async () => {
  const response = await fetch(`${API_BASE_URL}/email-accounts`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch email accounts");
  }

  return data;
};

export const syncEmailAccount = async (emailAccountId) => {
  const response = await fetch(`${API_BASE_URL}/email-accounts/${emailAccountId}/sync`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Email sync failed");
  }

  return data;
};
