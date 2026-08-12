const { withDangerousMod, CodeGenerator } = require("@expo/config-plugins");
const { mergeContents } = CodeGenerator;
const fs = require("fs");
const path = require("path");

// Custom fonts used inside src/components/Widget.tsx. The widget extension
// (ExpoWidgetsTarget) is only actually created as an Xcode native target
// during `pod install`, from the `target "ExpoWidgetsTarget" do ... end`
// block expo-widgets injects into the Podfile — it doesn't exist yet at any
// point config plugins run (dangerous/xcodeproj mods all run before
// CocoaPods). Neither expo-widgets nor expo-font register fonts for it —
// only for the main app target — so without this, SwiftUI silently falls
// back to the system font inside the widget. We hook into the same
// `post_install` block expo-widgets already uses (see the Podfile) to add
// the font once the target actually exists.
const FONT_FILES = ["src/assets/fonts/NotoSerif-Variable.ttf"];

const rubyPostInstallSnippet = () => {
  const relativePaths = FONT_FILES.map(
    (font) => `../${font}`,
  );
  const basenames = FONT_FILES.map((font) => path.basename(font));

  return `  main_project = installer.aggregate_targets.first&.user_project
  widget_target = main_project&.targets&.find { |t| t.name == 'ExpoWidgetsTarget' }
  if widget_target
    [${relativePaths.map((p) => `'${p}'`).join(", ")}].each do |relative_path|
      file_ref = main_project.main_group.find_file_by_path(relative_path)
      file_ref ||= main_project.new_file(relative_path)
      existing = widget_target.resources_build_phase&.files_references || []
      unless existing.any? { |f| f.path == relative_path }
        widget_target.add_resources([file_ref])
      end
    end

    info_plist_path = File.join(__dir__, 'ExpoWidgetsTarget', 'Info.plist')
    if File.exist?(info_plist_path)
      info_plist = Xcodeproj::Plist.read_from_path(info_plist_path)
      fonts = info_plist['UIAppFonts'] || []
      info_plist['UIAppFonts'] = (fonts + [${basenames.map((b) => `'${b}'`).join(", ")}]).uniq
      Xcodeproj::Plist.write_to_path(info_plist, info_plist_path)
    end
  end`;
};

const withWidgetFonts = (config) =>
  withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile",
      );

      const contents = fs.readFileSync(podfilePath, "utf8");
      const merged = mergeContents({
        src: contents,
        newSrc: rubyPostInstallSnippet(),
        tag: "widget-fonts",
        anchor: /expo_widgets_post_install\(installer\)/,
        offset: 1,
        comment: "#",
      });

      fs.writeFileSync(podfilePath, merged.contents);

      return config;
    },
  ]);

module.exports = withWidgetFonts;
