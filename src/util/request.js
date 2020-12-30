const API = require("../api");

export default async function makeAjaxRequest(
  url,
  method,
  query,
  body,
  options,
  headers
) {
  const reqHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": "no-cache",
  };
  const params = {
    method: method || "get",
    headers: { ...reqHeaders, ...(headers || {}) },
    credentials: "include",
    ...(options || {}),
  };

  if (method.toLowerCase() !== "get") {
    params.body = JSON.stringify(body || {});
  }

  const response = await fetch(
    encodeUrlWithQuery(`/market${url}`, query),
    params
  );

  if (response.ok) {
    const contentType = response.headers.get("Content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.status !== undefined && data.status !== 1) {
        throw new Error(data.msg);
      }
      return data;
    } else {
      return response.text();
    }
  } else {
    const data = await response.json();
    const error = new Error(data.msg);
    error.response = response;
    throw error;
  }
}

function encodeUrlWithQuery(url, query) {
  Object.keys(query || {}).forEach((key, index) => {
    url += `${index ? "" : "?"}`;
    if (query[key] || query[key] === 0) {
      url += `${index ? "&" : ""}${key}=${encodeURIComponent(query[key])}`;
    }
  });

  return `${API.BASE_URL}${url}`;
}
