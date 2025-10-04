export const getAuthHeader = () => {
  const sessionUser = sessionStorage.getItem("user");
  const localUser = localStorage.getItem("user");
  const user = JSON.parse(sessionUser || localUser || "{}");
  
  return {
    Authorization: user?.token ? `Bearer ${user.token}` : "",
  };
};

export default getAuthHeader;