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

export class HomeBanner extends Model<
  InferAttributes<HomeBanner>,
  InferCreationAttributes<HomeBanner>
> {
  declare id: CreationOptional<number>;
  declare sequence: number | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare game_id: number;
  declare review_status: number;

  static initModel(sequelize: Sequelize): typeof HomeBanner {
    HomeBanner.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        sequence: {
          type: DataTypes.INTEGER,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
        game_id: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        modelName: "home_banner",
        freezeTableName: true,
        timestamps: false,
        tableName: "home_banner",
      }
    );

    return HomeBanner;
  }
}
