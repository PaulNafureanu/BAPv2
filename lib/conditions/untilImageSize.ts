import { WebElement } from "selenium-webdriver";

const untilImageSize = async (
  image: WebElement,
  condition: (width?: number, height?: number) => boolean
) => {
  const width = await image.getAttribute("naturalWidth");
  const height = await image.getAttribute("naturalHeight");
  return condition(Number(width), Number(height));
};

export default untilImageSize;
