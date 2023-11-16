import { WebElement } from "selenium-webdriver";
import Element, { ElementOptions, WebLocator } from "../base/Element";
import untilImageSize from "../lib/conditions/untilImageSize";
import deepAiLoc from "../locators/deepAiLoc";
import ChromeDriver from "./../base/ChromeDriver";

type getElementFn = (
  webLocator: WebLocator,
  options?: { throwError?: true } & Partial<ElementOptions>
) => Promise<WebElement>;

export default class DeepAI {
  private static url = "https://deepai.org/machine-learning-model/text2img";
  private static email = process.env.DEEPAI_EMAIL || "";
  private static password = process.env.DEEPAI_PASSWORD || "";
  private static options = {
    maxRetries: 0,
    timeout: 15 * 1000,
  };

  static isLogIn = async (getElement: getElementFn) => {
    const { login } = deepAiLoc;
    const options = DeepAI.options;
    options.timeout = 5 * 1000;
    return !(await getElement(login, options));
  };

  static login = async (getElement: getElementFn) => {
    const { login, switch2Email, username, password, auth } = deepAiLoc;
    (await getElement(login)).click();
    (await getElement(switch2Email)).click();
    const userField = await getElement(username);
    await userField.clear();
    await userField.sendKeys(DeepAI.email);
    const passField = await getElement(password);
    await passField.clear();
    await passField.sendKeys(DeepAI.password);
    (await getElement(auth)).click();
  };

  static txt2Img = async (prompt: string) => {
    const chrome = await ChromeDriver.construct();
    await chrome.get(DeepAI.url);

    const getElement: getElementFn = async (
      webLocator: WebLocator,
      options = DeepAI.options
    ) => await Element.construct(chrome, webLocator, options);

    const isLogin = await DeepAI.isLogIn(getElement);
    if (!isLogin) await DeepAI.login(getElement);
    const { text, generate, enhance, image, download } = deepAiLoc;
    const textarea = await getElement(text);
    await textarea.clear();
    await textarea.sendKeys(prompt);
    (await getElement(generate)).click();
    (await getElement(enhance)).click();
    const img = await getElement(image);
    await chrome.wait(
      untilImageSize(img, (width) => (width || 0) > 1024),
      15000
    );
    (await getElement(download)).click();
    await chrome.sleep(30 * 1000);
    await chrome.quit();
  };
}
