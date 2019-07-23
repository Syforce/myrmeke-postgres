import { Pool, PoolClient } from 'pg';

import { Connection, ConnectionType, DynamicConnection } from 'myrmeke-colony';

function callAlgorithm(connectionConfig: Connection): Promise<any> {
	const promise: Promise<any> = new Promise((resolve: Function, reject: Function) => {
		const connection = new Pool({
			user: 'postgres',
			host: 'localhost',
			database: 'arcana',
			password: 'swords13',
			port: 5432
		});

		connection.connect().then((client: PoolClient) => {
			client.release();
			console.log('PostgreSQL connection succeded');
			resolve(connection);
		}, (error) => {
			console.error('PostgreSQL connection failed', error);
			reject(error);
		});
	});

	return promise;
}

export function registerAlgorithm() {
	DynamicConnection.addAlgorithm(ConnectionType.POSTGRES, callAlgorithm);
}