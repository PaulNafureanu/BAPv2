import Element, { WebLocator } from "../base/Element";
import ChromeDriver from "./../base/ChromeDriver";

export default class DeepAI {
  private static url = "https://deepai.org/machine-learning-model/text2img";
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

  static txt2Img = async (prompt: string) => {
    const chrome = await ChromeDriver.construct();

    await chrome.get(DeepAI.url);

    const textarea = new Element(chrome, DeepAI.promptLocator);
    await textarea.clearAndSendKeys("Test this string from Paul.");

    const generateBtn = new Element(chrome, DeepAI.generateLocator);
    await generateBtn.click();

    ChromeDriver.quitAfter(30000, chrome);
  };
}
