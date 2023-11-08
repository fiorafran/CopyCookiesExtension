const URL = "https://app.janisdev.in/";
const urlPattern = /http:\/\/janis\.localhost:3001\//;

document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("copyCookiesButton");

  const copyCookiesToLocalStorage = async () => {
    const saveText = copyButton.textContent;

    copyButton.classList.remove("copyButton");
    copyButton.classList.add("loading");
    copyButton.textContent = "";

    const idCookie = await getCookie("JANIS_ID_TOKEN");
    const accCookie = await getCookie("JANIS_ACCESS_TOKEN");

    const cookies = idCookie && accCookie ? [idCookie, accCookie] : [];

    if (!cookies.length) {
      copyButton.classList.remove("loading");
      copyButton.classList.add("error");
      copyButton.textContent = "Cookies no encontradas";

      removeClass("error", saveText, copyButton)

      return;
    }

    if (cookies.length) {
      cookies.forEach(async (cookie) => {
        const response = await chrome.cookies.set(cookie);
        console.log("response :", response);
      });
      copyButton.classList.remove("loading");
      copyButton.classList.add("ok");
      copyButton.textContent = "¡Cookies copiadas!";

      chrome.tabs.query({}, function (tabs) {
        const matchingTabs = tabs.filter((tab) => urlPattern.test(tab.url));
        if (matchingTabs.length > 0) {
          matchingTabs.forEach((tab) => {
            chrome.tabs.reload(tab.id);
          });
        }
      });

      removeClass("ok", saveText, copyButton)
    }
  };

  if (copyButton)
    copyButton.addEventListener("click", copyCookiesToLocalStorage);
});

const getCookie = async (name) => {
  const cookie = await chrome.cookies.get({ name, url: URL });
  if (!cookie) return;
  return {
    name: cookie.name,
    value: cookie.value,
    domain: "janis.localhost",
    path: "/",
    url: "http://janis.localhost:3001/",
  };
};

const removeClass = (className, textContent, buttonRef) => {
  setTimeout(() => {
    buttonRef.classList.remove(className);
    buttonRef.classList.add("copyButton");
    buttonRef.textContent = textContent;
  }, 5000);
}