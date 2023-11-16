import { WebLocator } from "../base/Element";

const promptLocator: WebLocator = {
  CSSLocator: "textarea.model-input-text-input",
  CSSLocator2: ".model-input-col .model-input-text-input",
  XPath: "/html/body/main/div[2]/div/div/div[1]/span/textarea",
};

const generateLocator: WebLocator = {
  IDLocator: "modelSubmitButton",
  CSSLocator: ".edit-buttons-container #modelSubmitButton",
  CSSLocator2: ".edit-buttons-container button:last-of-type",
  XPath: '//*[@id="modelSubmitButton"]',
};

const enhanceLocator: WebLocator = {
  IDLocator: "enhance-model-image",
  CSSLocator: ".edit-buttons-container #enhance-model-image",
  CSSLocator2: ".edit-buttons-container:last-of-type button:last-of-type",
  XPath: '//*[@id="enhance-model-image"]',
};

const downloadLocator: WebLocator = {
  IDLocator: "download-model-image",
  CSSLocator: ".edit-buttons-container #download-model-image",
  CSSLocator2: ".edit-buttons-container:last-of-type button",
  XPath: '//*[@id="download-model-image"]',
};

const deepAiLoc = {
  loginLoc: {
    IDLocator: "headerLoginButton",
    CSSLocator: "",
    XPath: "",
  },
  switch2EmailLoc: {
    IDLocator: "switch-to-email",
    CSSLocator: "",
    XPath: "",
  },
  userLoc: {
    IDLocator: "user-email",
    CSSLocator: "",
    XPath: "",
  },
  passLoc: {
    IDLocator: "user-password",
    CSSLocator: "",
    XPath: "",
  },
  authLoc: {
    IDLocator: "login-via-email-id",
    CSSLocator: "",
    XPath: "",
  },
};

export default deepAiLoc;
