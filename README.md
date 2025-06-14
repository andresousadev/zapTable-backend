# Zap Table BE

Restaurant Digital Menu & Order system
Enhances dining experiences by allowing customers to:

- Browse menus
- Place orders
  By simply scanning a QR code placed conveniently at their table, diners can explore detailed menu items, customize orders and view real-time updates without waiting for staff assistance. Streamline restaurant operations, boost customer satisfaction, and embrace a modern, contactless dining solution.

## Project setup

First run the docker compose

```
docker compose up -d
```

Install the depedencies

```bash
npm install
```

If it's your first time running the project then run:
To create the database schema

```
npm run dev:first-run
```

Otherwise run:

```
npm run start:dev
```

## Compile and run the project

```bash
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
