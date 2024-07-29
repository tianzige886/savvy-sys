import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  InferCreationAttributes,
  InferAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

export class Game extends Model<
  InferAttributes<Game>,
  InferCreationAttributes<Game>
> {
  declare id: CreationOptional<number>;
  declare name: string | null;
  declare tags: string | null;
  declare status: number | null;
  declare status_name: string | null;
  declare token: number | null;
  declare token_name: string | null;
  declare platform: string | null;
  declare platform_name: string | null;
  declare size: string | null;
  declare release_time: number;
  declare media: string | null;
  declare introduction: string | null;
  declare gameplay_show: string | null;
  declare gameplay_description: string | null;
  declare other_description: string | null;
  declare cover_url: string | null;
  declare logo: string | null;
  declare website: string | null;
  declare networks: string | null;
  declare review_status: number;
  declare pictures: string | null;
  declare languages: string | null;
  declare online: number | null;
  declare short_introduction: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof Game {
    Game.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.INTEGER,
        },
        status_name: {
          type: DataTypes.STRING,
        },
        token: {
          type: DataTypes.INTEGER,
        },
        token_name: {
          type: DataTypes.STRING,
        },
        platform: {
          type: DataTypes.STRING,
        },
        platform_name: {
          type: DataTypes.STRING,
        },
        size: {
          type: DataTypes.STRING,
        },
        release_time: {
          type: DataTypes.BIGINT,
        },
        media: {
          type: DataTypes.TEXT,
        },
        introduction: {
          type: DataTypes.TEXT,
        },
        gameplay_show: {
          type: DataTypes.TEXT,
        },
        gameplay_description: {
          type: DataTypes.TEXT,
        },
        other_description: {
          type: DataTypes.TEXT,
        },
        cover_url: {
          type: DataTypes.TEXT,
        },
        logo: {
          type: DataTypes.STRING,
        },
        website: {
          type: DataTypes.STRING,
        },
        networks: {
          type: DataTypes.STRING,
        },
        review_status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        pictures: {
          type: DataTypes.TEXT,
        },
        languages: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        online: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        short_introduction: {
          type: DataTypes.TEXT,
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
        tags: DataTypes.TEXT,
      },
      {
        sequelize,
        modelName: "game",
        freezeTableName: true,
        timestamps: false,
        tableName: "game",
      }
    );

    return Game;
  }
}
