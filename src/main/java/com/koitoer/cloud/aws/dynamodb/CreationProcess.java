package com.koitoer.cloud.aws.dynamodb;

import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.model.*;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClient;
import com.amazonaws.services.securitytoken.model.AssumeRoleWithWebIdentityRequest;
import com.amazonaws.services.securitytoken.model.AssumeRoleWithWebIdentityResult;
import org.springframework.social.connect.support.ConnectionFactoryRegistry;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;
import org.springframework.social.oauth2.AccessGrant;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by koitoer on 4/2/16.
 */
public class CreationProcess {

    private static final String tableName = "ItemTable";
    private static Long capacityUnits = 5L;
    private static Collection<KeySchemaElement> keySchemaElementCollection  = new ArrayList<KeySchemaElement>();
    private static final int DEFAULT_SESSION_CREDENTIALS_DURATION = 3600;


    private static final String ROLE_ARN = "arn:aws:iam:::role/dynamo_role";
    private static final String FB_APP_CLIENT_ID = "";
    private static final String FB_APP_CLIENT_SECRET = "";

    public static void main(String[] args) {

        CreationProcess creationProcess =  new CreationProcess();
        DynamoDB dynamoDB = new DynamoDB(new AmazonDynamoDBClient(new ProfileCredentialsProvider()));
        creationProcess.dropTableIfExists(dynamoDB);
        creationProcess.createIndex();
        Collection<AttributeDefinition> attributeDefinitions =  new ArrayList<AttributeDefinition>();
        attributeDefinitions.add(new AttributeDefinition().withAttributeName("Id").withAttributeType(ScalarAttributeType.N));
        CreateTableRequest createTableRequest =
                creationProcess.createTable(tableName, keySchemaElementCollection, capacityUnits, capacityUnits, attributeDefinitions);

        dynamoDB.createTable(createTableRequest);
        creationProcess.addData(dynamoDB);

    }

    private void addData(DynamoDB dynamoDB) {
        TableWriteItems tableWriteItems = new TableWriteItems(tableName);
        for (Item item : this.getRawData()) {
            tableWriteItems.addItemToPut(item);
        }
        BatchWriteItemOutcome batchWriteItemOutcome = dynamoDB.batchWriteItem(tableWriteItems);
    }

    private void dropTableIfExists(DynamoDB dynamoDB) {
        Table table = null;
        try {
            table = dynamoDB.getTable(tableName);
            System.out.println(table);
        }catch (ResourceNotFoundException rnfe){
            return;
        }
        if(table.getDescription() != null){
            DeleteTableResult deletableResult = table.delete();
            System.out.println(deletableResult);
        }
    }

    public AccessGrant getFacebookToken(){
        org.springframework.social.facebook.connect.FacebookConnectionFactory facebookConnectionFactory =
                new FacebookConnectionFactory(FB_APP_CLIENT_ID, FB_APP_CLIENT_SECRET);

        ConnectionFactoryRegistry registry = new ConnectionFactoryRegistry();
        registry.addConnectionFactory(facebookConnectionFactory);

        AccessGrant accessGrant = facebookConnectionFactory.getOAuthOperations().authenticateClient();
        System.out.println(accessGrant.getAccessToken());
        System.out.println(facebookConnectionFactory.getProviderId());
        return  accessGrant;
    }



    private void createIndex() {
        keySchemaElementCollection.add(new KeySchemaElement("Id", KeyType.HASH).withAttributeName("Id"));
    }

    public CreateTableRequest createTable(String tableName, Collection<KeySchemaElement> keySchema, Long readCapacityUnits,
                            Long writeCapacityUnits, Collection<AttributeDefinition> attributeDefinitions){

        return new CreateTableRequest()
                .withTableName(tableName)
                .withKeySchema(keySchema)
                .withAttributeDefinitions(attributeDefinitions)
                .withProvisionedThroughput(new ProvisionedThroughput()
                        .withReadCapacityUnits(readCapacityUnits)
                        .withWriteCapacityUnits(writeCapacityUnits));

    }

    /**
     * This method applies only when we have a valid access token to call the API
     * @param accessGrant
     * @return
     */
    public BasicSessionCredentials retrieveSessionCredentials(AccessGrant accessGrant) {
        AWSSecurityTokenServiceClient client = new AWSSecurityTokenServiceClient();
        AssumeRoleWithWebIdentityRequest assumeRoleWithWebIdentityRequest = new AssumeRoleWithWebIdentityRequest()
                .withWebIdentityToken(accessGrant.getAccessToken())
                .withRoleArn(ROLE_ARN)
                .withRoleSessionName("ProviderSession")
                .withProviderId("facebook")
                .withDurationSeconds(DEFAULT_SESSION_CREDENTIALS_DURATION);

        AssumeRoleWithWebIdentityResult result = client.assumeRoleWithWebIdentity(assumeRoleWithWebIdentityRequest);
        System.out.println(result.getProvider());
        System.out.println(result.getAssumedRoleUser().getArn());

        /*
        AssumeRoleRequest assumeRoleRequest = new AssumeRoleRequest()
                .withDurationSeconds(DEFAULT_SESSION_CREDENTIALS_DURATION)
                .withExternalId(externalId)
                .withRoleArn(ROLE_ARN)
                .withRoleSessionName("ProviderSession");
        AssumeRoleResult result = client.assumeRole(assumeRoleRequest);*/

        return new BasicSessionCredentials(
                result.getCredentials().getAccessKeyId(),
                result.getCredentials().getSecretAccessKey(),
                result.getCredentials().getSessionToken());
    }

    public List<Item> getRawData() {
        List<Item> items =  new ArrayList<Item>();
        items.add(new Item().with("name","bananas").with("price", 0.94));
        return items;
    }
}
