import { logger } from '../service/logger';
import { User } from '@model/app/user';
import { UserPersist } from '@model/persist/userPersist';
import { buildUserForPersisting, buildUserFromDB, buildMessageForPersisting, buildMessageFromDB } from './builder';
import { UserResource, MessagesResource } from './resources';
import { PutItemInput, PutItemOutput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createErrorForService } from '../service/error';
import { Message } from '@model/app/message';
import { MessagePersist } from '@model/persist/messagePersist';
import { transformDateForDB } from './util';


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
            logger.error(`Can't save into table <${this.tableName}> the item ${JSON.stringify(item)}`, e);
            throw false;
        }

        return true;
    }

    async executeQuery(query: Partial<DocumentClient.QueryInput>): Promise<DocumentClient.QueryOutput> {
        const documentInput: DocumentClient.QueryInput = this.createDynamoQueryModel(query);

        try {
            return await (dynamoDBResources.query(documentInput).promise());
        } catch (e) {
            createErrorForService(`Can't perform query into table <${this.tableName}>`, e);
        }

    }

    async executeScan(query: Partial<DocumentClient.ScanInput>): Promise<DocumentClient.ScanOutput> {
        const documentInput: DocumentClient.QueryInput = this.createDynamoQueryModel(query);

        try {
            return await (dynamoDBResources.scan(documentInput).promise());
        } catch (e) {
            createErrorForService(`Can't perform scan into table <${this.tableName}>`, e);
        }

    }


    private createDynamoPutModel(item: DocumentClient.PutItemInputAttributeMap): PutItemInput {
        return {
            TableName: this.tableName,
            Item: item,
        };
    }

    private createDynamoQueryModel(
        query: Partial<DocumentClient.QueryInput | DocumentClient.ScanInput>
    ): DocumentClient.QueryInput | DocumentClient.ScanInput {
        return {
            ...query,
            TableName: this.tableName,
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
            const result: DocumentClient.QueryOutput = await this.tableService.executeQuery({ KeyConditionExpression, ExpressionAttributeValues });
            if (result && result.Count > 0) {
                const userPersist: UserPersist = result.Items[0] as UserPersist;
                return buildUserFromDB(userPersist);
            }
        } catch (e) {
            createErrorForService(`Can't find user`, e);
        }
    }

    async getUserByIdList(userIds: string[]): Promise<User[] | undefined> {

        const userReplace: string[] = userIds.map((current: string, index: number) => (`:userId${index + 1}`));
        const FilterExpression: string = `userId IN (${userReplace.join(',')})`;
        const ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = userReplace.reduce(
            (acc: DocumentClient.ExpressionAttributeValueMap, current: string, index: number) => ({
                ...acc,
                [current]: userIds[index],
            }), {},
        );
        try {
            const result: DocumentClient.QueryOutput = await this.tableService.executeScan({ FilterExpression, ExpressionAttributeValues });

            if (!result || result.Count === 0) {
                return Promise.reject('No user found');
            }

            return result.Items.map(
                (item: UserPersist): User => (buildUserFromDB(item)),
            );
        } catch (e) {
            createErrorForService(`Can not perform user`, e);
        }
    }
}


export const userDynamoResource = new UserDynamoResource();

export class MessageDynamoResource implements MessagesResource {
    tableService: DynamoDBTableService;

    constructor() {
        this.tableService = new DynamoDBTableService(process.env.messagesTableName);
    }

    postMessage(message: Message): Promise<boolean> {
        const messageToSave: MessagePersist = buildMessageForPersisting(message);
        return this.tableService.putItem(messageToSave);
    }

    async getMessagesPerPage(lastMessageDate: Date): Promise<Message[]> {
        const FilterExpression: string = 'createdAt > :lastMessageDate';
        const ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = {
            ':lastMessageDate': transformDateForDB(lastMessageDate),
        };
        const IndexName = 'createdIndex';

        try {
            const result: DocumentClient.QueryOutput = await this.tableService.executeScan({
                IndexName,
                FilterExpression,
                ExpressionAttributeValues,
                Limit: 20
            });

            if (!result || result.Count === 0) {
                return Promise.reject('No messages found');
            }

            return result.Items.map(
                (item: MessagePersist): Message => (buildMessageFromDB(item))
            );
        } catch (e) {
            createErrorForService(`Can not perform messages search`, e);
        }
    }


}
export const messageDynamoResource = new MessageDynamoResource();
