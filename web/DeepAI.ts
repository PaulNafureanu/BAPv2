import { WebDriver, WebElement } from "selenium-webdriver";
import Element, { WebLocator } from "../base/Element";
import untilImageSize from "../lib/conditions/untilImageSize";
import deepAiLoc from "../locators/deepAiLoc";
import ChromeDriver from "./../base/ChromeDriver";

export default class DeepAI {
  private static url = "https://deepai.org/machine-learning-model/text2img";
  private static email = process.env.DEEPAI_EMAIL || "";
  private static password = process.env.DEEPAI_PASSWORD || "";
  private static options = {
    maxRetries: 0,
    timeout: 15 * 1000,
    throwError: true,
  } as const;

  static isLogIn = async (chrome: WebDriver) => {
    const { login } = deepAiLoc;
    const isLogin = !(await Element.construct(chrome, login, {
      timeout: 5 * 1000,
      throwError: false,
      maxRetries: 0,
      label: "Check login",
    }));
    return isLogin;
  };

  static login = async (
    getElement: (
      loc: WebLocator,
      label?: string,
      logErrors?: boolean
    ) => Promise<WebElement>
  ) => {
    const { login, switch2Email, username, password, auth } = deepAiLoc;
    (await getElement(login, "Login Btn")).click();
    (await getElement(switch2Email, "Switch2Email Btn")).click();
    const userField = await getElement(username, "Username field");
    await userField.clear();
    await userField.sendKeys(DeepAI.email);
    const passField = await getElement(password, "Password field");
    await passField.clear();
    await passField.sendKeys(DeepAI.password);
    (await getElement(auth, "Auth Btn")).click();
  };

  static txt2Img = async (prompt: string) => {
    const chrome = await ChromeDriver.construct();
    await chrome.get(DeepAI.url);

    const getElement = async (
      webLocator: WebLocator,
      label?: string,
      logErrors?: boolean
    ) => {
      let options = { ...DeepAI.options, label, logErrors };
      return await Element.construct(chrome, webLocator, options);
    };

    const isLogin = await DeepAI.isLogIn(chrome);
    if (!isLogin) await DeepAI.login(getElement);

    const { text, generate, enhance, image, download, subscription } =
      deepAiLoc;
    const textarea = await getElement(text, "Textarea field");
    await textarea.clear();
    await textarea.sendKeys(prompt);
    (await getElement(generate, "Generate Btn")).click();

    // Check if the subscription modal is open
    const isSubOpen = !!(await Element.construct(chrome, subscription, {
      throwError: false,
      maxRetries: 0,
      label: "Subscription",
    }));

    if (isSubOpen) {
      await chrome.quit();
    }

    (await getElement(enhance, "Enhance Btn")).click();

    // Wait until the width is over 1024 px (the enhanced image is returned).
    await Element.construct(chrome, image, {
      ...DeepAI.options,
      label: "Image",
      logErrors: true,
      conditions: [untilImageSize((width: number) => width > 1024)],
    });

    (await getElement(download, "Download Btn")).click();
    await chrome.sleep(30 * 1000);
    await chrome.quit();
  };
}
