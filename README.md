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

# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
bun dlx turbo build
bun exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
bun exec turbo build --filter=docs
bun exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
bun exec turbo dev
bun exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
bun exec turbo dev --filter=web
bun exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
bun exec turbo login
bun exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
bun exec turbo link
bun exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
