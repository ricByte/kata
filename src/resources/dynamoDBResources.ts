import { AWSError } from 'aws-sdk'
import { DynamoDB } from "aws-sdk";
import { logger } from '../service/logger';
import { User } from '@model/app/user';
import { UserPersist } from '@model/persist/userPersist';
import { buildUserForPersisting } from './builder';
import { UserResource } from './resources';
import { PutItemInput, PutItemOutput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

const DocumentClient = DynamoDB.DocumentClient;

const dynamoDBResources = new DocumentClient();


class DynamoDBTableService {
    tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async putItem(item: any): Promise<boolean> {

        const documentInput: PutItemInput = this.createDynamoPutModel(item);
        try {
            const putAction: PutItemOutput = await (dynamoDBResources.put(documentInput).promise());
        } catch (e) {
            logger.error(`Can't save into table <${this.tableName}> the item ${JSON.stringify(item)}`);
            throw false;
        }

        return true;
    }

    private createDynamoPutModel(item: PutItemInputAttributeMap): PutItemInput {
        return {
            TableName: this.tableName,
            Item: item,
        };
    }
}

export class UserDynamoResource implements UserResource {
    tableService: DynamoDBTableService;

    constructor() {
        this.tableService = new DynamoDBTableService(process.env.usersTableName);
    }

    saveUser(user: User): Promise<boolean> {
        const userToSave: UserPersist = buildUserForPersisting(user);
        return this.tableService.putItem(userToSave);
    }
}


export const userDynamoResource = new UserDynamoResource();
