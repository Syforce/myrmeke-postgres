export { SchemaConfig, SchemaFieldType, DatastoreService, datastoreService, ConnectionType } from 'myrmeke-colony';

export { PostgresDatastore } from './instance/postgres.datastore';
export { PostgresSchemaService } from './service/postgres-schema.service';

import { registerAlgorithm } from './service/postgres-connection.component';

registerAlgorithm();