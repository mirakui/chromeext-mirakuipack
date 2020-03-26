window.onload = () => {
  const url = window.location.toString().split("?")[0];
  window.history.pushState({}, "", url);
};
