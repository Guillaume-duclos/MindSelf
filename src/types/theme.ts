import Category from "@/enums/themeCategory.enum";

type Theme =
  | { category: Category; colors: [string, string]; isPremium: boolean }
  | { category: Category; image: string; isPremium: boolean };

export default Theme;
