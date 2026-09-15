const {
  withAppDelegate,
  withInfoPlist,
  withXcodeProject,
  withDangerousMod,
  IOSConfig,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// iOS 27 (Xcode 27) removed the compatibility shim that auto-synthesized a
// UIScene for apps only implementing the legacy AppDelegate/window life
// cycle, so apps built against the iOS 27 SDK now fail to launch at all
// ("UIScene life cycle is required for apps built with this SDK", see Apple
// Technote TN3187) unless they adopt the UIKit scene-based life cycle.
// Expo only ships this natively starting with SDK 58 (still in preview as of
// writing), so until that's stable this plugin recreates the same shape by
// hand on every prebuild: it adds a SceneDelegate, registers it in
// Info.plist, and moves window/React Native startup out of AppDelegate.
// Delete this plugin (and its app.json entry) once the project upgrades to
// Expo SDK 58+.

const SCENE_DELEGATE_SOURCE = `import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let factory = appDelegate.reactNativeFactory
    else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    appDelegate.window = window
    self.window = window

    factory.startReactNative(withModuleName: "main", in: window)

    if let url = connectionOptions.urlContexts.first?.url {
      _ = appDelegate.application(UIApplication.shared, open: url, options: [:])
    }
    if let userActivity = connectionOptions.userActivities.first {
      _ = appDelegate.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate
    else {
      return
    }
    _ = appDelegate.application(UIApplication.shared, open: url, options: [:])
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
      return
    }
    _ = appDelegate.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
  }
}
`;

const OLD_LAUNCH_BLOCK = `#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)`;

const NEW_LAUNCH_BLOCK = `// The window is created and React Native is started by \`SceneDelegate\` under the
    // UIKit scene-based life cycle (required to launch on the iOS 27 SDK).
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)`;

const LINKING_API_MARKER = "\n  // Linking API";

const SCENE_CONFIG_METHOD = `
  // Not \`override\`: \`ExpoAppDelegate\` doesn't implement this UIApplicationDelegate
  // method, so this is our own first implementation of it, not an override.
  public func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: nil, sessionRole: connectingSceneSession.role)
    configuration.delegateClass = SceneDelegate.self
    return configuration
  }
`;

const withUISceneLifecycle = (config) => {
  config = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: "$(PRODUCT_MODULE_NAME).SceneDelegate",
          },
        ],
      },
    };
    return config;
  });

  config = withAppDelegate(config, (config) => {
    const { contents } = config.modResults;

    if (!contents.includes(OLD_LAUNCH_BLOCK)) {
      throw new Error(
        "withUISceneLifecycle: AppDelegate.swift template changed upstream — could not find the " +
          "window/launch block to patch for the UIScene life cycle. Update plugins/withUISceneLifecycle.js.",
      );
    }
    if (!contents.includes(LINKING_API_MARKER)) {
      throw new Error(
        "withUISceneLifecycle: AppDelegate.swift template changed upstream — could not find the " +
          "'// Linking API' marker to insert the scene configuration method. Update plugins/withUISceneLifecycle.js.",
      );
    }

    let newContents = contents.replace(OLD_LAUNCH_BLOCK, NEW_LAUNCH_BLOCK);
    newContents = newContents.replace(
      LINKING_API_MARKER,
      `\n${SCENE_CONFIG_METHOD}${LINKING_API_MARKER}`,
    );

    config.modResults.contents = newContents;
    return config;
  });

  config = withDangerousMod(config, [
    "ios",
    (config) => {
      const sourceRoot = IOSConfig.Paths.getSourceRoot(
        config.modRequest.projectRoot,
      );
      fs.writeFileSync(
        path.join(sourceRoot, "SceneDelegate.swift"),
        SCENE_DELEGATE_SOURCE,
      );
      return config;
    },
  ]);

  config = withXcodeProject(config, (config) => {
    const sourceRoot = IOSConfig.Paths.getSourceRoot(
      config.modRequest.projectRoot,
    );
    const groupName = path.basename(sourceRoot);
    const project = config.modResults;
    const groupKey = project.findPBXGroupKey({ name: groupName });
    const target = project.getTarget("com.apple.product-type.application");

    project.addSourceFile(
      `${groupName}/SceneDelegate.swift`,
      { target: target?.uuid },
      groupKey,
    );

    return config;
  });

  return config;
};

module.exports = withUISceneLifecycle;
