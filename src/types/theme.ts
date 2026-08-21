import Category from "@/enums/themeCategory.enum";

// Positional identifier (category + sub-category + index in themes.json),
// computed in code rather than stored as data — lets two entries with
// otherwise identical content (e.g. duplicate placeholder colors) still be
// told apart. Optional because it's only meaningful for themes coming from
// the picker; other Theme values (e.g. defaults) don't need one.
type Theme =
  | { category: Category; colors: [string, string]; isPremium: boolean; key?: string }
  | { category: Category; image: string; isPremium: boolean; key?: string };

export default Theme;
