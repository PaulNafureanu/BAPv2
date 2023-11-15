import { By, Locator, WebDriver, until } from "selenium-webdriver";
import Element, { WebLocator } from "../base/Element";
import ChromeDriver from "./../base/ChromeDriver";
import untilImageSize from "../lib/conditions/untilImageSize";

export default class DeepAI {
  private static url = "https://deepai.org/machine-learning-model/text2img";
  private static email = process.env.DEEPAI_EMAIL || "";
  private static password = process.env.DEEPAI_PASSWORD || "";

  private static promptLocator: WebLocator = {
    CSSLocator: "textarea.model-input-text-input",
    CSSLocator2: ".model-input-col .model-input-text-input",
    XPath: "/html/body/main/div[2]/div/div/div[1]/span/textarea",
  };

  private static generateLocator: WebLocator = {
    IDLocator: "modelSubmitButton",
    CSSLocator: ".edit-buttons-container #modelSubmitButton",
    CSSLocator2: ".edit-buttons-container button:last-of-type",
    XPath: '//*[@id="modelSubmitButton"]',
  };

  private static enhanceLocator: WebLocator = {
    IDLocator: "enhance-model-image",
    CSSLocator: ".edit-buttons-container #enhance-model-image",
    CSSLocator2: ".edit-buttons-container:last-of-type button:last-of-type",
    XPath: '//*[@id="enhance-model-image"]',
  };

  private static downloadLocator: WebLocator = {
    IDLocator: "download-model-image",
    CSSLocator: ".edit-buttons-container #download-model-image",
    CSSLocator2: ".edit-buttons-container:last-of-type button",
    XPath: '//*[@id="download-model-image"]',
  };

  static checkLogin = async (chrome: WebDriver) => {
    try {
      const loginLoc = By.id("headerLoginButton");
      await chrome.sleep(1000);
      await DeepAI.getElement(chrome, loginLoc, "Login Btn", 5000);
      return false;
    } catch (error) {
      return true;
    }
  };

  static login = async (chrome: WebDriver) => {
    const loginLoc = By.id("headerLoginButton");
    const loginBtn = await DeepAI.getElement(chrome, loginLoc, "Login Btn");
    await loginBtn.click();
    const emailLoc = By.id("switch-to-email");
    const emailBtn = await DeepAI.getElement(chrome, emailLoc, "Email Btn");
    await emailBtn.click();
    const userLoc = By.id("user-email");
    const userInput = await DeepAI.getElement(chrome, userLoc, "User Input");
    await userInput.clear();
    await userInput.sendKeys(DeepAI.email);
    const passLoc = By.id("user-password");
    const passInput = await DeepAI.getElement(
      chrome,
      passLoc,
      "Password Input"
    );
    await passInput.clear();
    await passInput.sendKeys(DeepAI.password);
    const logLoc = By.id("login-via-email-id");
    const logBtn = await DeepAI.getElement(chrome, logLoc, "Log Btn");
    await logBtn.click();
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
    const isLogin = await DeepAI.checkLogin(chrome);
    console.log("IsLogIn: ", isLogin);

    // TODO: need work
    if (!isLogin) await DeepAI.login(chrome);
    console.log("Done");

    await chrome.sleep(600 * 1000); //10min

    // Send keys to textarea
    const txtLoc = By.css("textarea.model-input-text-input");
    const textarea = await DeepAI.getElement(chrome, txtLoc, "Textarea");
    await textarea.clear();
    await textarea.sendKeys("Some beautiful flowers.");
    console.log("process", "Textarea - clear and sent keys.");

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
