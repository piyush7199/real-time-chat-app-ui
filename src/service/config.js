export const API_MESSAGE = {
  loading: { title: "loading...", message: "Data is loading" },
  success: { title: "success", message: "Data loaded" },
  responeFailure: { title: "Error", message: "Internal Server Error" },
  requestFailure: { title: "Error", message: "Request Failure" },
  otherError: { title: "Error", message: "Something went wrong" },
};

export const SERVICE_URLS = {
  getChats: { url: "/api/chats", method: "GET" },
};

export const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};
