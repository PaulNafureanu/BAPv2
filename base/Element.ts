import {
  By,
  Condition,
  WebDriver,
  WebElement,
  WebElementCondition,
  until,
} from "selenium-webdriver";

export interface WebLocator {
  IDLocator?: string;
  CSSLocator: string;
  CSSLocator2: string;
  CSSLocator3?: string;
  XPath: string;
}

export default class Element {
  private static defaultWaitTime: number = 200;
  public static NullWebLocator: WebLocator = {
    IDLocator: "",
    CSSLocator: "",
    CSSLocator2: "",
    CSSLocator3: "",
    XPath: "",
  };

  /* States of an web element:
   * (WebElement) - there is a defined web element on the webpage.
   * (undefined) - there was no check done yet to test if there is such a web element.
   * (null) - there is no defined web element on the webpage, throw error.
   */
  protected webElement: WebElement | undefined = undefined;
  private webLocator: WebLocator;
  private chrome: WebDriver;

  constructor(chrome: WebDriver, webLocator: WebLocator) {
    this.chrome = chrome;
    this.webLocator = webLocator;
  }

  /**
   * Methods for waiting strategies
   */
  private readonly wait = {
    forElement: async (condition: WebElementCondition, timeout: number) =>
      await this.chrome.wait(condition, timeout),
    forElements: async (
      condition:
        | Function
        | Condition<WebElement[]>
        | PromiseLike<WebElement[]>
        | ((driver: WebDriver) => WebElement[]),
      timeout: number
    ) => await this.chrome.wait(condition, timeout),
  };

  /**
   * Schedule a command to search for the web element defined by its web locator on the current webpage.
   * @param timeout How long to wait to find the element for each locator in ms.
   * The total wait time is the number of locators checked multiplied by the timeout number in ms.
   * @returns  A promise that will resolve to an WebElement if found or
   * throws error if such element does not exist.
   */
  private async find(timeout: number) {
    let webElements: WebElement[] = [];

    // Check by ID
    if (this.webLocator.IDLocator) {
      try {
        webElements = await this.wait.forElements(
          until.elementsLocated(By.id(this.webLocator.IDLocator)),
          timeout
        );

        if (webElements.length > 0) {
          this.webElement = webElements[0];
          return webElements[0];
        }
      } catch (error) {}
    }

    // Check by CSS 1
    try {
      webElements = await this.wait.forElements(
        until.elementsLocated(By.css(this.webLocator.CSSLocator)),
        timeout
      );
      if (webElements.length > 0) {
        this.webElement = webElements[0];
        return webElements[0];
      }
    } catch (error) {}

    // Check by CSS 2
    try {
      webElements = await this.wait.forElements(
        until.elementsLocated(By.css(this.webLocator.CSSLocator2)),
        timeout
      );
      if (webElements.length > 0) {
        this.webElement = webElements[0];
        return webElements[0];
      }
    } catch (error) {}

    // Check by CSS 3
    if (this.webLocator.CSSLocator3) {
      try {
        webElements = await this.wait.forElements(
          until.elementsLocated(By.css(this.webLocator.CSSLocator3)),
          timeout
        );
        if (webElements.length > 0) {
          this.webElement = webElements[0];
          return webElements[0];
        }
      } catch (error) {}
    }

    // Check by XPath
    try {
      webElements = await this.wait.forElements(
        until.elementsLocated(By.xpath(this.webLocator.XPath)),
        timeout
      );
      if (webElements.length > 0) {
        this.webElement = webElements[0];
        return webElements[0];
      }
    } catch (error) {
      throw new Error(
        "There is no such web element with this web locator on the current webpage."
      );
    }
  }

  // Methods to define actions using the web element found.

  public async click(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).click();
    }
  }

  public async clickByLinkText(
    linkText: string,
    timeout: number = Element.defaultWaitTime
  ) {
    const webElements = await this.wait.forElements(
      until.elementsLocated(By.linkText(linkText)),
      timeout
    );
    if (webElements.length > 0) {
      return await webElements[0].click();
    }
  }

  public async getText(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).getText();
    }
  }
  public async clear(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).clear();
    }
  }
  public async clearAndSendKeys(
    str: string,
    timeout: number = Element.defaultWaitTime
  ) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).clear();
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).sendKeys(str);
    }
  }
  public async sendKeys(
    str: string,
    timeout: number = Element.defaultWaitTime
  ) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).sendKeys(str);
    }
  }
  public async submit(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).submit();
    }
  }
  public async isDisplayed(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).isDisplayed();
    }
  }
  public async isEnabled(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).isEnabled();
    }
  }
  public async isSelected(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).isSelected();
    }
  }
  public async takeScreenshot(timeout: number = Element.defaultWaitTime) {
    let webElement = this.webElement;
    if (!webElement) webElement = await this.find(timeout);
    if (webElement) {
      return (
        await this.wait.forElement(until.elementIsVisible(webElement), timeout)
      ).takeScreenshot(true);
    }
  }
}
