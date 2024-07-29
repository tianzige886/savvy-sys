import {
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class UserMenuPermission extends Model<
  InferAttributes<UserMenuPermission>,
  InferCreationAttributes<UserMenuPermission>
> {
  declare id: CreationOptional<number>;
  declare user_id: number | null;
  declare menu_id: number | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof UserMenuPermission {
    UserMenuPermission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
        },
        menu_id: {
          type: DataTypes.BIGINT,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize,
        modelName: "user_menu_permission",
        freezeTableName: true,
        timestamps: false,
        tableName: "user_menu_permission",
      }
    );

    return UserMenuPermission;
  }
}
