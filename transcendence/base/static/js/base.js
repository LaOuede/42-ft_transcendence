function setToLocalStorage(name, data) {
  try {
    localStorage.setItem(name, JSON.stringify(data));
  } catch (e) {
    console.log("FAILED TO STORE", e);
  }
}
window.setToLocalStorage =  setToLocalStorage;