export const getHeadersConfig = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  return config;
};

export const getSender = (loggerUser, users) => {
  return users[0]._id === loggerUser._id ? users[1].name : users[0].name;
};

export const getFullSenderObject = (loggerUser, users) => {
  return users[0]._id === loggerUser._id ? users[1] : users[0];
};
