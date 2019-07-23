import { Pool, PoolClient, QueryResult } from 'pg';

import { AbstractDatastore, IDatastore, SchemaConfig, DynamicConnection, ConnectionType,
	datastoreService } from 'myrmeke-colony';

import { PostgresSchemaService } from '../service/postgres-schema.service';

export class PostgresDatastore<T> extends AbstractDatastore<any> implements IDatastore<T> {
	private pool: Pool;

	constructor(config: SchemaConfig) {
		super(config, new PostgresSchemaService());
	}

	protected init(): void {
		this.pool = this.connection.getConnection();
		const config: string = this.schemaService.generate(this.config);

		this.observe(config).then((value) => {
			console.log(`Registered datastore ${this.config.name}`);
		}, (error) => {
			console.log(`Failed for ${this.config.name}`);
		});
	}

	protected getConnection(): DynamicConnection<any> {
		return datastoreService.getConnection(ConnectionType.POSTGRES);
	}

	public observe(config: string): Promise<T & Array<T>> {
		const promise: Promise<T & Array<T>> = new Promise((resolve, reject) => {
			this.pool.connect().then((client: PoolClient) => {
				client.query(config).then((value: QueryResult) => {
					client.release();
					resolve(<any>value.rows);
				}, (error) => {
					client.release();
					console.error('Error', error);
					reject(error);
				});
			}, (error) => {
				console.error('Error', error);
				reject(error);
			});
		});

		return promise;
	}

	/**
	 * Get all the Models of type T from the database.
	 */
	public getAll(): Promise<Array<T>> {
		const config = `SELECT * FROM ds_${this.config.name}`;

		return this.observe(config);
	}

	/**
	 * Get a Model of type T by it's id.
	 */
	public getById(id: string | T): Promise<T> {
		return null;
	}

	/**
	 * Create a Model of type T and return it.
	 */
	public create(model: T): Promise<T> {
		const keys: string = Object.keys(model).join(', ');
		const values: string = Object.values(model).map((item) => {
			return `'${item}'`;
		}).join(', ');

		const config = `INSERT INTO ds_${this.config.name} (${keys}) VALUES (${values})`;

		return this.observe(config);
	}
}