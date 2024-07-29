import {
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class WeekRecommend extends Model<
  InferAttributes<WeekRecommend>,
  InferCreationAttributes<WeekRecommend>
> {
  declare id: CreationOptional<number>;
  declare cover_url: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare game_ids: string;
  declare is_set_home: number;
  declare sequence: number | null;
  declare review_status: number | null;

  static initModel(sequelize: Sequelize): typeof WeekRecommend {
    WeekRecommend.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        cover_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        game_ids: {
          type: DataTypes.STRING,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        is_set_home: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
        review_status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "week_recommend",
        tableName: "week_recommend",
        timestamps: false,
      }
    );

    return WeekRecommend;
  }
}
