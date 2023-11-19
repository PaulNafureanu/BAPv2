import "dotenv/config";
import DeepAI from "./web/DeepAI";
import DriverWrapper from "./base/WrapperDriver";

(async () => {
  // await DeepAI.txt2Img("Some beautiful flowers.");

  const googleURL = "https://www.google.com/";

  const driver = await DriverWrapper.construct("firefox");
  await driver.get(googleURL);
})();
