import {
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Menu extends Model<
  InferAttributes<Menu>,
  InferCreationAttributes<Menu>
> {
  declare id: CreationOptional<number>;
  declare name: string | null;
  declare path: string | null;
  declare label: string | null;
  declare button_id: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof Menu {
    Menu.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        path: {
          type: DataTypes.STRING,
        },
        label: {
          type: DataTypes.STRING,
        },
        button_id: {
          type: DataTypes.STRING,
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
        modelName: "menu",
        freezeTableName: true,
        timestamps: false,
        tableName: "menu",
      }
    );

    return Menu;
  }
}
