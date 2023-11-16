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
  login: {
    IDLocator: "headerLoginButton",
    CSSLocator: "",
    XPath: "",
  },
  switch2Email: {
    IDLocator: "switch-to-email",
    CSSLocator: "",
    XPath: "",
  },
  username: {
    IDLocator: "user-email",
    CSSLocator: "",
    XPath: "",
  },
  password: {
    IDLocator: "user-password",
    CSSLocator: "",
    XPath: "",
  },
  auth: {
    IDLocator: "login-via-email-id",
    CSSLocator: "",
    XPath: "",
  },
  text: {
    CSSLocator: "textarea.model-input-text-input",
    XPath: "",
  },
  generate: {
    IDLocator: "modelSubmitButton",
    CSSLocator: "",
    XPath: "",
  },
  enhance: {
    IDLocator: "enhance-model-image",
    CSSLocator: "",
    XPath: "",
  },
  image: {
    CSSLocator: "",
    XPath: '//*[@id="place_holder_picture_model"]/img',
  },
  download: {
    IDLocator: "download-model-image",
    CSSLocator: "",
    XPath: "",
  },
};

export default deepAiLoc;
