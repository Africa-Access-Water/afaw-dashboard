export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    Authorization: user?.token ? `Bearer ${user.token}` : "",
  };
};

export default getAuthHeader;