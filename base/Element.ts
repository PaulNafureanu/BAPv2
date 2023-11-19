import { By, Locator, WebDriver, WebElement, until } from "selenium-webdriver";

export interface WebLocator {
  Slocator?: Locator;
  IDLocator?: string;
  CSSLocator: string;
  CSSLocator2?: string;
  CSSLocator3?: string;
  XPath: string;
}
/**
 * Optional Condition is a function that returns a promise that resolve itself
 * to a condition function used in a wait operation.
 * The condition function it is a function that returns a promise that resolves itself to a boolean,
 * true if the condition is passed, false otherwise. Therefore the wait operation retries this
 * function until it is true or wait has timed out.
 * The locatorFunction is used to update the WebElement if it becomes stale data inside the condition function.
 */
export type OptionalCondition = (
  element: WebElement
) => Promise<() => Promise<boolean>>;

export interface ElementOptions {
  timeout: number;
  maxRetries: number;
  throwError: boolean;
  logErrors: boolean;
  label: string;
  conditions?: OptionalCondition[];
}

export default class Element {
  public static readonly DefaultElementOptions: ElementOptions = {
    timeout: 200,
    maxRetries: 3,
    throwError: true,
    logErrors: false,
    label: "[No label]",
  };

  public static readonly NullWebLocator: WebLocator = {
    IDLocator: "",
    CSSLocator: "",
    CSSLocator2: "",
    CSSLocator3: "",
    XPath: "",
  };

  protected constructor() {}

  private static checkFn = async (
    driver: WebDriver,
    locator: Locator,
    timeout: number,
    label?: string,
    conditions?: OptionalCondition[]
  ) => {
    // Function to retry in case of stale errors
    const checks = async (rechecks: number): Promise<WebElement> => {
      try {
        const el = await driver.wait(until.elementLocated(locator), timeout);
        await driver.wait(until.elementIsVisible(el), timeout);
        await driver.wait(until.elementIsEnabled(el), timeout);

        // Check additional conditions
        if (conditions) {
          for (let condition of conditions) {
            await driver.wait(await condition(el), timeout);
          }
        }

        return el;
      } catch (error) {
        if (
          (error as Error).name === "StaleElementReferenceError" &&
          rechecks >= 0
        )
          return await checks(rechecks - 1);
        throw error;
      }
    };

    const element = await checks(3);
    const scrollScript =
      "arguments[0].scrollIntoView({behavior:'instant', block: 'center'})";
    await driver.executeScript(scrollScript, element);
    return element;
  };

  static readonly construct: {
    (
      driver: WebDriver,
      webLocator: WebLocator,
      options?: { throwError?: true } & Partial<ElementOptions>
    ): Promise<WebElement>;
    (
      driver: WebDriver,
      webLocator: WebLocator,
      options: { throwError: false } & Partial<ElementOptions>
    ): Promise<WebElement | undefined>;
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

    let { maxRetries, timeout, throwError, logErrors, label, conditions } =
      options;
    const d = Element.DefaultElementOptions;
    if (maxRetries !== 0 && !maxRetries) maxRetries = d.maxRetries;
    if (!timeout) timeout = d.timeout;
    if (throwError === undefined) throwError = d.throwError;
    if (logErrors === undefined) logErrors = d.logErrors;
    if (!label) label = d.label;

    for (let retry = -1; retry < maxRetries; retry++) {
      for (let locator of locatorsToCheck) {
        try {
          return await Element.checkFn(
            driver,
            locator,
            timeout,
            label,
            conditions
          );
        } catch (error) {
          if (logErrors) console.error(error);
        }
      }
    }

    if (throwError)
      throw new Error(
        `Element '${label}' could not be found using the provided locators: ${locatorsToCheck}`
      );
    return undefined as unknown as WebElement;
  };
}
