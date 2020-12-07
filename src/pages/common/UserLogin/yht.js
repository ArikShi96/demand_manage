let yhtService = process.env.YHT_SERVICE;

let locationHref = encodeURIComponent(location.origin + location.pathname);

function getService(type) {
  if (typeof yhtService === "string") {
    return yhtService;
  } else {
    return yhtService[type] || yhtService.login;
  }
}

export const loginHref =
  getService("login") +
  "/cas/login?sysid=open-platform&multiCas=true&service=" +
  locationHref;

export const registerHref =
  getService("register") + "/register?service=" + locationHref;

export const logoutHref =
  getService("logout") + "/cas/logout?SAMLRequest=true&service=" + locationHref;

export const userInfoHref = getService("user") + "/usercenter/user";
