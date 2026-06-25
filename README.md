# Spot Exchange:

A high-performance spot exchange built using a distributed microservices architecture. The system is designed to handle order placement, matching, real-time market updates, persistence, and recovery while maintaining low latency and scalability.

# Overview

The exchange consists of multiple independent services that communicate through Redis Streams and Consumer Groups. The architecture separates order processing, matching, persistence, and real-time data distribution into dedicated components.

The core idea is to keep the API layer stateless while delegating all matching responsibilities to a dedicated Matching Engine.

# Architecture

# Components:

# 1. Backend API Service

The Backend API is a stateless service responsible for:

Receiving client requests
Validating orders
Performing pre-processing
Publishing orders to Redis Streams
Receiving matching results
Returning responses to clients

Since the backend is stateless, it can be horizontally scaled without any shared state concerns.

# 2. Matching Engine

The Matching Engine is the heart of the exchange.

Responsibilities:

Consumes orders from Redis Streams using Consumer Groups
Maintains in-memory order books
Performs order matching
Generates trades (fills)
Updates order states
Publishes results to downstream services

After processing an order, the matching engine publishes:

Order execution results to the Backend Response Stream
Persistence events to the DB Poller Stream
Real-time market deltas to the WebSocket Service

# 3. DB Poller Service

The DB Poller is responsible for persisting exchange data.

Responsibilities:

Consumes events from the persistence stream
Creates Order History records
Creates Fill records
Maintains Open Orders
Persists data into PostgreSQL

This design keeps database operations completely isolated from the matching engine, allowing the engine to remain focused on low-latency order processing.

# 4. WebSocket Service

The WebSocket Service provides real-time updates to connected clients.

Responsibilities:

Receives market deltas from the matching engine
Broadcasts order book updates
Broadcasts trade executions
Pushes real-time price changes to frontend clients

This ensures traders receive updates with minimal latency.

# 5. Frontend

The frontend connects to the WebSocket service and receives:

Order book updates
Trade executions
Price changes
User order updates

This allows the UI to stay synchronized with the exchange state in real time.

# Order Lifecycle

Client submits an order.
Backend API validates the request.
Backend publishes the order to a Redis Stream.
Matching Engine consumes the order using a Consumer Group.
Matching Engine performs matching.
Matching results are published to:
Backend Response Stream
DB Poller Stream
WebSocket Stream
Backend receives the result and returns a response to the client.
DB Poller persists order and trade information into PostgreSQL.
WebSocket Service broadcasts updates to connected clients.

# Technologies Used:

TypeScript
Express
Bun
PostgreSQL
Redis Streams
Redis Consumer Groups
WebSockets
MinIO
Docker
Microservices Architecture
