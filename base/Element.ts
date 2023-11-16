import { By, Locator, WebDriver, WebElement, until } from "selenium-webdriver";

export interface WebLocator {
  Slocator?: Locator;
  IDLocator?: string;
  CSSLocator: string;
  CSSLocator2?: string;
  CSSLocator3?: string;
  XPath: string;
}

export type Checkfunction = (
  driver: WebDriver,
  locator: Locator,
  timeout: number
) => Promise<WebElement>;

export interface ElementOptions {
  timeout: number;
  maxRetries: number;
  throwError: boolean;
  checkFn: Checkfunction;
}

type R<T> = T extends false | undefined ? WebElement | undefined : WebElement;

export default class Element {
  public static readonly DefaultElementOptions: ElementOptions = {
    timeout: 200,
    maxRetries: 3,
    throwError: true,
    checkFn: async (driver: WebDriver, locator: Locator, timeout: number) => {
      const element = await driver.wait(until.elementLocated(locator), timeout);
      await driver.wait(until.elementIsVisible(element), timeout);
      await driver.wait(until.elementIsEnabled(element), timeout);
      return element;
    },
  };

  public static readonly NullWebLocator: WebLocator = {
    IDLocator: "",
    CSSLocator: "",
    CSSLocator2: "",
    CSSLocator3: "",
    XPath: "",
  };

  protected constructor() {}

  static readonly construct: {
    (
      driver: WebDriver,
      webLocator: WebLocator,
      options?: { throwError?: true } & Partial<ElementOptions>
    ): Promise<WebElement>;
    (
      driver: WebDriver,
      webLocator: WebLocator,
      options?: Partial<ElementOptions>
    ): Promise<WebElement | undefined>;
  } = async (
    driver: WebDriver,
    webLocator: WebLocator,
    options: Partial<ElementOptions> = Element.DefaultElementOptions
  ): Promise<
    typeof options.throwError extends false
      ? WebElement | undefined
      : WebElement
  > => {
    const locatorsToCheck: Locator[] = [];
    const { Slocator, IDLocator, CSSLocator, CSSLocator2, CSSLocator3, XPath } =
      webLocator;
    if (Slocator) locatorsToCheck.push(Slocator);
    if (IDLocator) locatorsToCheck.push(By.id(IDLocator));
    if (CSSLocator) locatorsToCheck.push(By.css(CSSLocator));
    if (CSSLocator2) locatorsToCheck.push(By.css(CSSLocator2));
    if (CSSLocator3) locatorsToCheck.push(By.css(CSSLocator3));
    if (XPath) locatorsToCheck.push(By.xpath(XPath));

    let { checkFn, maxRetries, timeout, throwError } = options;
    const d = Element.DefaultElementOptions;
    if (!checkFn) checkFn = d.checkFn;
    if (!maxRetries) maxRetries = d.maxRetries;
    if (!timeout) timeout = d.timeout;
    if (throwError === undefined) throwError = d.throwError;

    for (let retry = -1; retry < maxRetries; retry) {
      for (let locator of locatorsToCheck) {
        try {
          return await checkFn(driver, locator, timeout);
        } catch (error) {}
      }
    }

    if (throwError)
      throw new Error(
        `Element could not be found using the provided locators.`
      );
    return undefined as unknown as WebElement;
  };
}
