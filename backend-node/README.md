# Insemble GraphQL backend

# Tech Stacks

Runtime: NodeJS

Language: TypeScript

Framework: Nexus GraphQL server

ORM: Prisma2

Database: PostgresQL + Mongo(existing DB)

## Setup & Installation

1.  Run `yarn`
2.  If you don't have docker please install it from here `https://www.docker.com/get-started`
3.  Run `docker-compose up -d` for initialize docker this would initialize your postgres db inside docker, If you meet any error regarding port already used try runing `docker ps` to see which container use your port and then run `docker stop "id"` with running docker container id you want to stp
4.  Run `prisma2 migrate up --experimental` to migrate your db structure on file to postgres db. if you prisma2 doesn't work then you probably want to install it globally with `yarn add global prisma2` or add node_modules/.bin path to your .bashrc(or whatever terminal you are using)
5.  `yarn start:watch` to start the server.
