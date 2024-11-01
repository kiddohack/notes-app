This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This app was created to combine few technologies, such as NextJS, NodeJS in pair with Express, Prisma for ORM and PostgreSQL for database storage. Everything is stored locally, on my server(laptop).

If you want to run it on your machine:

```
~/notes-app/$ npm run dev
~/notes-app/$ cd notes-app-server
~/notes-app/notes-app-server/$ npm start
```

First will run the FrontEnd part, second will run the BackEnd. Don't forget to have a database named "notes" in `psql` and a table 'note' with an ID-primary key, title-string, content-string.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
