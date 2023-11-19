import path from "node:path";
import { Builder, ThenableWebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";

/**
 * Defines the options type for the constructor of the ChromeDriver class.
 */
export interface WrapperOptions {
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

export type SupportedBrowsers = "chrome" | "firefox" | "brave";

export default class DriverWrapper {
  private static Paths = {
    chromeBinary: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    braveBinary:
      "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
    firefoxBinary: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  };

  public static readonly DefaultOptions: WrapperOptions = {
    isHeadless: false,
    userProfile: "Default",
    userdataDir: path.resolve(__dirname, "./../userdata"),
    uploadDir: path.resolve(__dirname, "./../resources/upload"),
    downloadDir: path.resolve(__dirname, "./../resources/download"),
    screenshotDir: path.resolve(__dirname, "./../resources/screenshot"),
    sourceDir: path.resolve(__dirname, "./../resources/source"),
    width: 1920,
    height: 1080,
    resize: "max",
    implicitWait: 0,
  };

  private readonly thenableDriver: ThenableWebDriver;

  private constructor(
    browser: SupportedBrowsers,
    options: WrapperOptions = DriverWrapper.DefaultOptions
  ) {
    // Define the builder configurations:
    let builder: Builder;
    switch (browser) {
      case "chrome": {
        builder = DriverWrapper.configureChromeDriver(options);
        break;
      }
      case "brave": {
        builder = DriverWrapper.configureBraveDriver(options);
        break;
      }
      case "firefox": {
        builder = DriverWrapper.configureFirefoxDriver(options);
        break;
      }
    }

    // Create a thenable driver instance
    this.thenableDriver = builder.build();
  }

  private static configureChromeDriver = (options: WrapperOptions) => {
    // Define a Driver builder instance
    const builder = new Builder().forBrowser("chrome");

    // Define the chrome builder options
    const { isHeadless, downloadDir, userdataDir, userProfile, width, height } =
      options;

    const chromeOptions = new ChromeOptions()
      .setChromeBinaryPath(DriverWrapper.Paths.chromeBinary)
      .addArguments(`user-data-dir=${userdataDir + "_chrome"}`)
      .addArguments(`profile-directory=${userProfile}`)
      .setUserPreferences({ "download.default_directory": downloadDir })
      .addArguments(`window-size=${width},${height}`)
      .excludeSwitches("enable-logging");

    if (isHeadless) chromeOptions.headless();

    // Set the chrome options
    return builder.setChromeOptions(chromeOptions);
  };

  private static configureFirefoxDriver = (options: WrapperOptions) => {
    // Define a driver builder instance
    const builder = new Builder().forBrowser("firefox");

    // Define the firefox builder options
    const { isHeadless, downloadDir, userdataDir, userProfile, width, height } =
      options;

    const firefoxOptions = new FirefoxOptions()
      .setBinary(DriverWrapper.Paths.firefoxBinary)
      .addArguments(`user-data-dir=${userdataDir}` + "_firefox")
      // .setProfile(userProfile)
      .setPreference(`download.default_directory`, downloadDir)
      .windowSize({ width, height });

    if (isHeadless) firefoxOptions.headless();

    // Set the firefox options
    return builder.setFirefoxOptions(firefoxOptions);
  };

  private static configureBraveDriver = (options: WrapperOptions) => {
    // Define a driver builder instance
    const builder = new Builder().forBrowser("chrome");

    // Define the brave builder options
    const { isHeadless, downloadDir, userdataDir, userProfile, width, height } =
      options;

    const braveOptions = new ChromeOptions()
      .setChromeBinaryPath(DriverWrapper.Paths.braveBinary)
      .addArguments(`user-data-dir=${userdataDir}` + "_brave")
      .addArguments(`profile-directory=${userProfile}`)
      .setUserPreferences({ "download.default_directory": downloadDir })
      .addArguments(`window-size=${width},${height}`)
      .excludeSwitches("enable-logging");

    if (isHeadless) braveOptions.headless();

    // Set the brave options
    return builder.setChromeOptions(braveOptions);
  };

  /**
   * Construct and return a Chrome WebDriver instance to start a session with a Chrome browser and control it.
   * @param options Give options to the chrome webdriver.
   * @return Returns a chrome web driver instance.
   */
  static readonly construct = async (
    browser: SupportedBrowsers,
    options: Partial<WrapperOptions> = DriverWrapper.DefaultOptions
  ) => {
    // Set the default options
    const d = DriverWrapper.DefaultOptions;
    const completedOptions: WrapperOptions = {
      isHeadless: options.isHeadless || d.isHeadless,
      userProfile: options.userProfile || d.userProfile,
      userdataDir: options.userdataDir || d.userdataDir,
      uploadDir: options.uploadDir || d.uploadDir,
      downloadDir: options.downloadDir || d.downloadDir,
      screenshotDir: options.screenshotDir || d.screenshotDir,
      sourceDir: options.sourceDir || d.sourceDir,
      width: options.width || d.width,
      height: options.height || d.height,
      resize: options.resize || d.resize,
      implicitWait: options.implicitWait || d.implicitWait,
    };

    // Construct a new thenable chrome driver instance
    const { thenableDriver } = new DriverWrapper(browser, completedOptions);

    // Set the implicit wait of the driver
    await thenableDriver
      .manage()
      .setTimeouts({ implicit: completedOptions.implicitWait });

    // Set the resize of the browser window
    if (completedOptions.resize === "max")
      await thenableDriver.manage().window().maximize();
    else await thenableDriver.manage().window().minimize();

    // return the instance
    return await thenableDriver;
  };
}
