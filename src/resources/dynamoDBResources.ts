import { AWSError } from 'aws-sdk';
import { logger } from '../service/logger';
import { User } from '@model/app/user';
import { UserPersist } from '@model/persist/userPersist';
import { buildUserForPersisting, buildUserFromDB } from './builder';
import { UserResource } from './resources';
import {
    PutItemInput,
    PutItemOutput,
    DocumentClient,
} from 'aws-sdk/clients/dynamodb';
import { createErrorForService } from '../service/error';


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

    async executeQuery(KeyConditionExpression: string, ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap): Promise<DocumentClient.QueryOutput> {
        const documentInput: DocumentClient.QueryInput = this.createDynamoQueryModel(KeyConditionExpression, ExpressionAttributeValues);

        try {
            return await (dynamoDBResources.query(documentInput).promise());
        } catch (e) {
            createErrorForService(`Can't perform query into table <${this.tableName}>`, e);
        }

    }

    private createDynamoPutModel(item: DocumentClient.PutItemInputAttributeMap): PutItemInput {
        return {
            TableName: this.tableName,
            Item: item,
        };
    }

    private createDynamoQueryModel(KeyConditionExpression: string, ExpressionAttributeValues: { [key: string]: any }): DocumentClient.QueryInput {
        return {
            TableName: this.tableName,
            KeyConditionExpression: KeyConditionExpression,
            ExpressionAttributeValues: ExpressionAttributeValues
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

    async getUserById(userId: string): Promise<User | undefined> {

        const KeyConditionExpression: string = 'userId = :userId';
        const ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = {
            ':userId': userId,
        };

        try {
            const result: DocumentClient.QueryOutput = await this.tableService.executeQuery(KeyConditionExpression, ExpressionAttributeValues);
            if (result && result.Count > 0) {
                const userPersist: UserPersist = result.Items[0] as UserPersist;
                return buildUserFromDB(userPersist);
            }
        } catch (e) {
            createErrorForService(`Can't find user`, e);
        }
    }
}


export const userDynamoResource = new UserDynamoResource();
