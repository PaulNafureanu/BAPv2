import { By, Locator, WebDriver, WebElement, until } from "selenium-webdriver";
import ChromeDriver from "./../base/ChromeDriver";
import untilImageSize from "../lib/conditions/untilImageSize";
import Element, { ElementOptions, WebLocator } from "../base/Element";
import deepAiLoc from "../locators/deepAiLoc";

export default class DeepAI {
  private static url = "https://deepai.org/machine-learning-model/text2img";
  private static email = process.env.DEEPAI_EMAIL || "";
  private static password = process.env.DEEPAI_PASSWORD || "";
  private static options = {
    maxRetries: 0,
    timeout: 15 * 1000,
  };

  static isLogIn = async (chrome: WebDriver) => {
    const { loginLoc } = deepAiLoc;
    const options = DeepAI.options;
    options.timeout = 5 * 1000;
    return !(await Element.construct(chrome, loginLoc, options));
  };

  static login = async (chrome: WebDriver) => {
    const { loginLoc, switch2EmailLoc, userLoc, passLoc, authLoc } = deepAiLoc;
    (await Element.construct(chrome, loginLoc, DeepAI.options)).click();
    (await Element.construct(chrome, switch2EmailLoc, DeepAI.options)).click();
    const userField = await Element.construct(chrome, userLoc, DeepAI.options);
    await userField.clear();
    await userField.sendKeys(DeepAI.email);
    const passField = await Element.construct(chrome, passLoc, DeepAI.options);
    await passField.clear();
    await passField.sendKeys(DeepAI.password);
    (await Element.construct(chrome, authLoc, DeepAI.options)).click();
  };

  static getElement = async (
    chrome: WebDriver,
    locator: Locator,
    label: string,
    timeout: number = 15000
  ) => {
    const element = await chrome.wait(until.elementLocated(locator), timeout);
    console.timeLog("process", `${label} - located.`);
    await chrome.wait(until.elementIsVisible(element), timeout);
    console.timeLog("process", `${label} - visible.`);
    await chrome.wait(until.elementIsEnabled(element), timeout);
    console.timeLog("process", `${label} - enabled.`);
    await chrome.executeScript(
      "arguments[0].scrollIntoView({behavior:'instant', block: 'center', inline: 'nearest'})",
      element
    );
    return element;
  };

  static txt2Img = async (prompt: string) => {
    // Start boot time
    console.time("boot");

    // Start chrome
    const chrome = await ChromeDriver.construct();
    await chrome.get(DeepAI.url);

    // End boot time and start process time
    console.timeEnd("boot");
    console.time("process");

    // Check login
    const isLogin = await DeepAI.isLogIn(chrome);
    console.log("IsLogIn: ", isLogin);

    // TODO: need work
    if (!isLogin) await DeepAI.login(chrome);
    console.log("Done");

    // Send keys to textarea
    const txtLoc = By.css("textarea.model-input-text-input");
    let textarea: WebElement;
    try {
      textarea = await DeepAI.getElement(
        chrome,
        By.css("txt.model-in.s"),
        "Textarea"
      );
    } catch (error) {
      console.log("Error: ", error);
    }
    textarea = await DeepAI.getElement(chrome, txtLoc, "Textarea");

    await textarea.clear();
    await textarea.sendKeys(prompt);
    console.log("process", "Textarea - clear and sent keys.");

    await chrome.sleep(300 * 1000);

    //Click generate
    const genLoc = By.id("modelSubmitButton");
    const generateBtn = await DeepAI.getElement(chrome, genLoc, "Generate Btn");
    await generateBtn.click();

    // Click enhance
    const enhLoc = By.id("enhance-model-image");
    const enhanceBtn = await DeepAI.getElement(chrome, enhLoc, "Enhance Btn");
    await enhanceBtn.click();

    // Wait for getting the enhanced image
    const imgLoc = By.xpath('//*[@id="place_holder_picture_model"]/img');
    const img = await DeepAI.getElement(chrome, imgLoc, "Image");
    await chrome.wait(
      untilImageSize(img, (width) => (width || 0) > 1024),
      15000
    );
    console.timeLog("process", "Image - enhanced located");

    // Click to download it
    const downLoc = By.id("download-model-image");
    const downloadBtn = await DeepAI.getElement(
      chrome,
      downLoc,
      "Download Btn"
    );
    // await downloadBtn.click();

    // Wait to finish downloading the image
    await chrome.sleep(15 * 1000); //1 min

    // Close chrome and end process after downloading
    await chrome.quit();
    console.timeEnd("process");
  };
}
