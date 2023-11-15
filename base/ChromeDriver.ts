import path from "node:path";
import { Builder, ThenableWebDriver, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";

/**
 * Defines the options type for the constructor of the ChromeDriver class.
 */
export interface ChromeDriverOptions {
  isHeadless: boolean;
  userProfile: string;
  userdataDir: string;
  uploadDir: string;
  downloadDir: string;
  screenshotDir: string;
  sourceDir: string;
  width: number;
  height: number;
  resize: "max" | "min";
  implicitWait: number;
}

export default class ChromeDriver {
  public static readonly DefaultOptions: ChromeDriverOptions = {
    isHeadless: false,
    userProfile: "Default",
    userdataDir: path.resolve(__dirname, "./../userdata"),
    uploadDir: path.resolve(__dirname, "./../resources/upload"),
    downloadDir: path.resolve(__dirname, "./../resources/download"),
    screenshotDir: path.resolve(__dirname, "./../resources/screenshot"),
    sourceDir: path.resolve(__dirname, "./../resources/source"),
    width: 1366,
    height: 768,
    resize: "max",
    implicitWait: 0,
  };

  private readonly thenableDriver: ThenableWebDriver;

  private constructor(
    options: ChromeDriverOptions = ChromeDriver.DefaultOptions
  ) {
    // Define a Chrome builder instance
    const builder = new Builder().forBrowser("chrome");

    // Define the chrome builder options
    const { isHeadless, downloadDir, userdataDir, userProfile, width, height } =
      options;

    const chromeOptions = new ChromeOptions()
      .addArguments(`user-data-dir=${userdataDir}`)
      .addArguments(`profile-directory=${userProfile}`)
      .setUserPreferences({ "download.default_directory": downloadDir })
      .addArguments(`window-size=${width},${height}`)
      .excludeSwitches("enable-logging");

    if (isHeadless) chromeOptions.headless();

    // Set the chrome options
    builder.setChromeOptions(chromeOptions);

    // Create a Chrome Web Driver instance
    this.thenableDriver = builder.build();
  }

  /**
   * Construct and return a Chrome WebDriver instance to start a session with a Chrome browser and control it.
   * @param options Give options to the chrome webdriver.
   * @return Returns a chrome web driver instance.
   */
  static readonly construct = async (
    options: ChromeDriverOptions = ChromeDriver.DefaultOptions
  ) => {
    // Construct a new thenable chrome driver instance
    const { thenableDriver } = new ChromeDriver(options);

    // Set the implicit wait of the driver
    await thenableDriver
      .manage()
      .setTimeouts({ implicit: options.implicitWait });

    // Set the resize of the browser window
    if (options.resize === "max")
      await thenableDriver.manage().window().maximize();
    else await thenableDriver.manage().window().minimize();

    // return the instance
    return await thenableDriver;
  };
}
