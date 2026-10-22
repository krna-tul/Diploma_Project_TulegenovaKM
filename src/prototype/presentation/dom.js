export const queryElement = (selector, root = document) => root.querySelector(selector);
export const readFormValues = (form) => Object.fromEntries(new FormData(form));
