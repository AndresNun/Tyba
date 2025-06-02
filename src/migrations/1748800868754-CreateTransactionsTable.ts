import { Service } from "typedi";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

@Service()
export class CreateTransactionsTable1748800868754 implements MigrationInterface {
    /**
     * Execute stucture change
     */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },{
                        name: "user_id",
                        type: "int"
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["city", "coordinates"]
                    },
                    {
                        name: "location",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "latitude",
                        type: "float",
                        isNullable: true
                    },
                    {
                        name: "longitude",
                        type: "float",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp with time zone",
                        default: "now()",
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    }
                ]
            }), 
        true);
    }
    
    /**
     * Restore
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transactions");
    }
}
