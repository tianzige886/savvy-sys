import {
  Association,
  CreationOptional,
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  InferCreationAttributes,
  InferAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

export class HomeHot extends Model<
  InferAttributes<HomeHot>,
  InferCreationAttributes<HomeHot>
> {
  declare id: CreationOptional<number>;
  declare create_time: Date | null;
  declare update_time: Date | null;
  declare sequence: number | null;
  declare review_status: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare game_id: number; // 添加game_id字段
  static initModel(sequelize: Sequelize): typeof HomeHot {
    HomeHot.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        create_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        update_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        sequence: {
          type: DataTypes.INTEGER,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        review_status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        game_id: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        modelName: "home_hot",
        freezeTableName: true,
        timestamps: false,
        tableName: "home_hot",
      }
    );

    return HomeHot;
  }
}
