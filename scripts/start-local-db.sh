#!/bin/bash
#
# Start DynamoDB Local and create tables
# Usage: ./scripts/start-local-db.sh

set -e

echo "Starting DynamoDB Local..."
docker run -d --name dynamodb-local \
  -p 8000:8000 \
  amazon/dynamodb-local:latest \
  -jar DynamoDBLocal.jar -sharedDb 2>/dev/null || \
  docker start dynamodb-local

sleep 2

echo "Creating tables..."

# Create decision table
aws dynamodb create-table \
  --endpoint-url http://localhost:8000 \
  --table-name safari-index-decisions \
  --attribute-definitions \
    AttributeName=decision_id,AttributeType=S \
    AttributeName=traveler_id,AttributeType=S \
    AttributeName=lead_id,AttributeType=S \
    AttributeName=created_at,AttributeType=S \
  --key-schema \
    AttributeName=decision_id,KeyType=HASH \
  --global-secondary-indexes \
    '[
      {"IndexName":"traveler-created-index","KeySchema":[{"AttributeName":"traveler_id","KeyType":"HASH"},{"AttributeName":"created_at","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}},
      {"IndexName":"lead-created-index","KeySchema":[{"AttributeName":"lead_id","KeyType":"HASH"},{"AttributeName":"created_at","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}
    ]' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1 \
  2>/dev/null || echo "Decision table already exists"

# Create event table
aws dynamodb create-table \
  --endpoint-url http://localhost:8000 \
  --table-name safari-index-events \
  --attribute-definitions \
    AttributeName=event_id,AttributeType=S \
    AttributeName=traveler_id,AttributeType=S \
    AttributeName=event_type,AttributeType=S \
    AttributeName=session_id,AttributeType=S \
    AttributeName=created_at,AttributeType=S \
  --key-schema \
    AttributeName=event_id,KeyType=HASH \
  --global-secondary-indexes \
    '[
      {"IndexName":"traveler-created-index","KeySchema":[{"AttributeName":"traveler_id","KeyType":"HASH"},{"AttributeName":"created_at","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}},
      {"IndexName":"type-created-index","KeySchema":[{"AttributeName":"event_type","KeyType":"HASH"},{"AttributeName":"created_at","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}},
      {"IndexName":"session-created-index","KeySchema":[{"AttributeName":"session_id","KeyType":"HASH"},{"AttributeName":"created_at","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}
    ]' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1 \
  2>/dev/null || echo "Event table already exists"

echo ""
echo "DynamoDB Local ready at http://localhost:8000"
echo ""
echo "To run tests with local DynamoDB:"
echo "  export AWS_ACCESS_KEY_ID=fakeKey"
echo "  export AWS_SECRET_ACCESS_KEY=fakeSecret"
echo "  export DYNAMODB_ENDPOINT=http://localhost:8000"
echo ""
