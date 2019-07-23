
import { ISchemaService, SchemaConfig, SchemaFieldConfig, SchemaFieldType } from 'myrmeke-colony';

export class PostgresSchemaService implements ISchemaService {
	public generate(config: SchemaConfig): string {
		let text: string = `CREATE TABLE IF NOT EXISTS ds_${config.name} (`;

		config.fields.forEach((field: SchemaFieldConfig, index: number) => {
			text += `${field.name} ${this.getFieldType(field.type)}`;
			text += index < config.fields.length - 1 ? ',': ')';
		});

		return text;
	}

	// TODO: make a function for each type in ISchemaService
	public getFieldType(type: SchemaFieldType) {
		switch (type) {
			case SchemaFieldType.ID: {
				return 'SERIAL PRIMARY KEY';
			}
			case SchemaFieldType.STRING: {
				return 'VARCHAR(100)';
			}
		}
	}
}