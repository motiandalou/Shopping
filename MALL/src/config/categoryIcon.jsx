import {
  ShoppingOutlined,
  UserOutlined,
  CoffeeOutlined,
  SkinOutlined,
  CrownOutlined,
  BookOutlined,
  CarOutlined,
  BugOutlined,
  HomeOutlined,
  AppstoreOutlined,
  CustomerServiceOutlined,
  MedicineBoxOutlined,
  RocketOutlined,
  ShopOutlined,
  ClearOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  MobileOutlined,
  DesktopOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const CATEGORY_ICON_MAP = {
  Clothing: {
    iconComp: ShoppingOutlined,
    label: "Clothing",
  },
  "Mom & Baby": {
    iconComp: UserOutlined,
    label: "Mom & Baby",
  },
  "Food & Drinks": {
    iconComp: CoffeeOutlined,
    label: "Food & Drinks",
  },
  "Beauty Care": {
    iconComp: SkinOutlined,
    label: "Beauty Care",
  },
  Jewelry: {
    iconComp: CrownOutlined,
    label: "Jewelry",
  },
  "Books & Media": {
    iconComp: BookOutlined,
    label: "Books & Media",
  },
  "Auto Goods": {
    iconComp: CarOutlined,
    label: "Auto Goods",
  },
  "Pet Products": {
    iconComp: BugOutlined,
    label: "Pet Products",
  },
  "Home Hardware": {
    iconComp: HomeOutlined,
    label: "Home Hardware",
  },
  "Furniture & Linens": {
    iconComp: AppstoreOutlined,
    label: "Furniture & Linens",
  },
  "Toys & Instruments": {
    iconComp: CustomerServiceOutlined,
    label: "Toys & Instruments",
  },
  "Health Care": {
    iconComp: MedicineBoxOutlined,
    label: "Health Care",
  },
  "Travel & Lifestyle": {
    iconComp: RocketOutlined,
    label: "Travel & Lifestyle",
  },
  "Wines & Spirits": {
    iconComp: ShopOutlined,
    label: "Wines & Spirits",
  },
  "Cleaning Goods": {
    iconComp: ClearOutlined,
    label: "Cleaning Goods",
  },
  "Garden Supplies": {
    iconComp: EnvironmentOutlined,
    label: "Garden Supplies",
  },
  "Gifts & Flowers": {
    iconComp: GiftOutlined,
    label: "Gifts & Flowers",
  },
  Electronics: {
    iconComp: MobileOutlined,
    label: "Electronics",
  },
  "Office & PC": {
    iconComp: DesktopOutlined,
    label: "Office & PC",
  },
  "Sports & Outdoors": {
    iconComp: TrophyOutlined,
    label: "Sports & Outdoors",
  },
};

export const getCategoryIconComp = (categoryName) => {
  const target = CATEGORY_ICON_MAP[categoryName];
  return target ? target.iconComp : ShoppingOutlined;
};

export const getCategoryLabel = (categoryName) => {
  const target = CATEGORY_ICON_MAP[categoryName];
  return target ? target.label : categoryName;
};

export default CATEGORY_ICON_MAP;
