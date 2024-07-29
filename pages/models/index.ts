import type { Sequelize, Model } from "sequelize";
import { Game } from "./Game";
import { Tag } from "./Tag";
import { HomeBanner } from "./HomeBanner";
import { HomeRecommend } from "./HomeRecommend";
import { HomeHot } from "./HomeHot";
import { WeekRecommend } from "./WeekRecommend";
import { User } from "./User";
import { Role } from "./Role";
import { Menu } from "./Menu";
import { Button } from "./Button";
import { UserMenuPermission } from "./UserMenuPermission";
import { UserButtonPermission } from "./UserButtonPermission";

export {
  Game,
  Tag,
  HomeBanner,
  HomeRecommend,
  HomeHot,
  WeekRecommend,
  User,
  Role,
  Menu,
  Button,
  UserMenuPermission,
  UserButtonPermission,
};

export function initModels(sequelize: Sequelize) {
  Game.initModel(sequelize);
  Tag.initModel(sequelize);
  HomeBanner.initModel(sequelize);
  HomeRecommend.initModel(sequelize);
  HomeHot.initModel(sequelize);
  WeekRecommend.initModel(sequelize);
  User.initModel(sequelize);
  Role.initModel(sequelize);
  Menu.initModel(sequelize);
  Button.initModel(sequelize);
  UserMenuPermission.initModel(sequelize);
  UserButtonPermission.initModel(sequelize);

  return {
    Game,
    Tag,
    HomeBanner,
    HomeRecommend,
    HomeHot,
    WeekRecommend,
    User,
    Role,
    Menu,
    Button,
    UserMenuPermission,
    UserButtonPermission,
  };
}
