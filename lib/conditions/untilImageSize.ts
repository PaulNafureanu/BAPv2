import { Locator, WebDriver, WebElement, until } from "selenium-webdriver";
import { OptionalCondition } from "../../base/Element";

/**
 * A condition constructor that returns an additional conditional function.
 * @param expression a function that returns a boolean value used to define the conditional function.
 * @returns a additional condtion function to be checked.
 */
const untilImageSize = (
  expression: (width: number, height: number) => boolean
): OptionalCondition => {
  return async (image: WebElement) => {
    return async () => {
      const width = await image.getAttribute("naturalWidth");
      const height = await image.getAttribute("naturalHeight");
      console.log("Inside width: ", width);
      return expression(Number(width || 0), Number(height || 0));
    };
  };
};

export default untilImageSize;
