Insemble
============

Insemble is a react-django platform that both provides location analytics to retailers and connects them directly to landlords who could meet there needs. Given an address of an existing establishment in our service area, or qualities of a retail business, we generate hotspot locations for a business expansion. We suplement recomendations with details of the location that are of interest to the retailer.

--
### Technologies

Initial product structure used the following boiler plate. This was from the branch as of (10/01/19). [Django-React-Boilerplate](https://github.com/vintasoftware/django-react-boilerplate)

Main technologies utilized are:

**Backend**

Two backend services drive the application:
- Python Backend
- Node Backend

Python Backend:

- [Django](https://www.djangoproject.com/) as backend framework utilizing python (python version currently used is 3.6.8)
- [Celery](http://www.celeryproject.org/) + [Redis](https://redis.io/topics/introduction) for background worker tasks
- [MongoDB](https://www.mongodb.com/) for database

Node Backend:

- [Typescript](https://www.typescriptlang.org) as primary language
- [Prisma](https://www.prisma.io) for object relational mapping
- [Apllo GraphQl](https://www.apollographql.com) to streamline API queries and manage data

**Frontend**

Primarily written in typescript

- [React](https://facebook.github.io/react/) for interactive UI
- [Bootstrap 4](https://v4-alpha.getbootstrap.com/) for responsive styling
- [Sass](https://sass-lang.com/) for extended CSS styling
- [Webpack](https://webpack.js.org/), for bundling static assets
- [Typescript](https://www.typescriptlang.org) as primary language

**Middleware**

- [WhiteNoise](http://whitenoise.evans.io/en/stable/) with [brotlipy](https://github.com/python-hyper/brotlipy), for efficient static files serving
- [Prospector](https://prospector.landscape.io/en/master/) and [ESLint](https://eslint.org/) with [pre-commit](http://pre-commit.com/) for automated quality assurance
- [PostgresSQL](https://www.postgresql.org/) for database

--

### Structure & Org

Directory Structure (not all-inclusive: only directories of note displayed):

```
insemble
├── backend                             # main python backend (see directory readme for more information)
│   ├── backend-archive
│   ├── common
│   ├── data
│   └── insembleapp
├── backend-node                        # main node backend (see directory for more informaiton on running)
│   ├── prisma
│   │   └── migrations
│   └── src
├── bin                                 # insemble shell functions
├── data_testing                        # testing and data aggregatring directory
│   ├── api
│   ├── data_aggregator
│   ├── matching
│   └── scripts
└── frontend                            # main front end folder
    ├── docs
    ├── public
    └── src
```

### Installation & Running

To set-up and platform on your system

- Clone repository
- Open a command line window and go to the project's directory. /insemble
- `pip install -r requirements.txt && pip install -r dev-requirements.txt` to install python dependencies. You will likely want to do this in a virtual environment (see [pyenv](https://github.com/pyenv/pyenv) and [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv))
- `npm install` to install
- Ensure that you have redis installed. Detailed Installation instructions can be found at [Redis.io](https://redis.io/topics/quickstart), but the folllowing should do the trick ***(Please make sure to do this outside of the root project directory)***.

Redis Installation Instructions:

```shell 
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make test (optional)
sudo make install 
```

- To install backend-node: `cd backend-node`
- Install all packages with yarn: `yarn install`
- Ensure that you have [docker](https://www.docker.com/?utm_source=google&utm_medium=cpc&utm_campaign=dockerhomepage&utm_content=namer&utm_term=dockerhomepage&utm_budget=growth&gclid=EAIaIQobChMI-ObJicaM6AIVSdbACh3pBQMuEAAYASAAEgI98PD_BwE) installed.
- Try the `prisma2` command to ensure that you have prisma installed. If you don't, you will need to add `export PATH=./node_modules/.bin:$PATH` to your shell profile or `./node_modules/.bin` to your ENV path (windows).

To run platform locally

- Contact administrator for .env keys (file should replace .env.example present in backend)
- Ensure that .env file has all necessary keys. API keys for Google, Foursquare, Redis, Sentry, etc. are required to run platform

Start the python backend:

- Ensure that redis server is up with `redis-server` call
- `cd backend`
- In backend folder: `python manage.py runserver` to start backend server and `python manage.py celery` to start the background celery process.

Start the node backend (refer to backend-node folder readme for more information):

- go to the backend node folder:`cd backend-node`
- Ensure that you have your docker process running: `docker-compose up -d` (you may have to kill any existing docker processes running on the port).
- Migrate your database to local: `prisma2 migrate up --experimental`
- Start the backend server: `yarn start:watch`

Start the front-end process
- In the insemble root folder:
- After node backend process has started, generate code using `npm run apollo:generate`
- In seperate command line run `npm start`

### Key Branches

- master -> latest code changes
- production -> latest branch in production
- other branches -> other side branches

### Warnings & Addition Notes

- Insemble does not use Postgres, so psycog2 (a depenedency initially listed by django-react-framework) was deleted from the requirements in file of insemble application
- There are a lot of underutilized or redundant files in the front-end that will need to be removed
