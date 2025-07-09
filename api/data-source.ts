import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as config from './ormconfig.json';    

const options = config as DataSourceOptions;

export const AppDataSource = new DataSource(options);
