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

export class HomeRecommend extends Model<
  InferAttributes<HomeRecommend>,
  InferCreationAttributes<HomeRecommend>
> {
  declare id: CreationOptional<number>;
  declare create_time: Date | null;
  declare sequence: number | null;
  declare review_status: number;
  declare update_time: Date | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare game_id: number; // 添加 game_id 字段

  static initModel(sequelize: Sequelize): typeof HomeRecommend {
    HomeRecommend.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        create_time: {
          type: DataTypes.DATE,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        update_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
        game_id: {
          type: DataTypes.INTEGER,
        },
        review_status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "home_recommend",
        freezeTableName: true,
        timestamps: false,
        tableName: "home_recommend",
      }
    );

    return HomeRecommend;
  }
}
