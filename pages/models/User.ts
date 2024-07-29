import {
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare username: string | null;
  declare password: string | null;
  declare status: number | null;
  declare email: string | null;
  declare avatar: string | null;
  declare role_id: number | null;
  declare created_at: Date | null;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING(100), // 明确指定长度
        },
        password: {
          type: DataTypes.STRING(100), // 明确指定长度
        },
        status: {
          type: DataTypes.SMALLINT,
        },
        email: {
          type: DataTypes.STRING(100), // 明确指定长度
        },
        avatar: {
          type: DataTypes.STRING(1000), // 明确指定长度
        },
        role_id: {
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
        modelName: "user",
        freezeTableName: true,
        timestamps: false,
        tableName: "user",
      }
    );

    return User;
  }
}
