Insemble
============

Insemble is a react-django platform that both provides location analytics to retailers and connects them directly to landlords who could meet there needs. Given an address of an existing establishment in our service area, or qualities of a retail business, we generate hotspot locations for a business expansion. We suplement recomendations with details of the location that are of interest to the retailer.

--
## Technologies

Product structure was expedited using two high-level boiler plates:

- [Django-React-Boilerplate](https://github.com/vintasoftware/django-react-boilerplate) for app creation, set-up, and organization
- [Shards-React](https://designrevision.com/downloads/shards-react/) for initial UI templating

Main technologies utilized are:

**Backend**

- [Django](https://www.djangoproject.com/) as backend framework utilizing python (python version currently used is 3.6.8)
- [Celery](http://www.celeryproject.org/) + [Redis](https://redis.io/topics/introduction) for background worker tasks
- [MongoDB](https://www.mongodb.com/) for database

**Frontend**

- [React](https://facebook.github.io/react/) for interactive UI
- [Redux](https://redux.js.org/) for universal state management
- [Bootstrap 4](https://v4-alpha.getbootstrap.com/) for responsive styling
- [Sass](https://sass-lang.com/) for extended CSS styling
- [Webpack](https://webpack.js.org/), for bundling static assets

**Middleware**

- [WhiteNoise](http://whitenoise.evans.io/en/stable/) with [brotlipy](https://github.com/python-hyper/brotlipy), for efficient static files serving

Currently underutilized, but available and installed (via templates) technologies:

- [Prospector](https://prospector.landscape.io/en/master/) and [ESLint](https://eslint.org/) with [pre-commit](http://pre-commit.com/) for automated quality assurance
- [Flux](https://facebook.github.io/flux/) for inplace state management
- [PostgresSQL](https://www.postgresql.org/) for database

--

## Structure & Org

Directory Structure (not all-inclusive: only directories of note displayed):

```
frontend
├── docs  # Shards React documenation
├── public  # public facing folder
└── src  # main front-end directory
    ├── assets  # Sass types
    ├── common
    ├── components # Shards-React pre-created assets for a variety of usecases
    ├── data # [Unused] Shards-React stock data
    ├── flux
    ├── images 
    ├── layouts # Main page layouts
    ├── redux
    │   ├── actions
    │   └── reducers
    ├── styles
    ├── utils
    └── views  # All application page components

backend
├── common  # commonents applicable accross all django apps
├── data_insights  # analytics package
├── feedback  # django app for feedback
├── insembleapp  # main django back-end app
│   ├── settings  # django settings directory, organized into local and production configurations
├── templates
│   ├── includes
│   └── insembleapp  # folder for html templates & entry-point index for react & django
└── users  # folder for user interactions
```

## Installation & Running

To set-up and platform on your system

- Clone repository
- Open a command line window and go to the project's directory.
- `pip install -r requirements.txt && pip install -r dev-requirements.txt`
- `npm install`
- Ensure that you have redis installed. Detailed Installation instructions can be found at [Redis.io](https://redis.io/topics/quickstart), but the folllowing should do the trick

```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make test (optional)
sudo make install 
```

To run platform locally

- Contact administrator for .env keys (file should replace .env.example present in backend)
- Ensure that .env file has all necessary keys. API keys for Google, Foursquare, Redis, Sentry, etc. are required to run platform
- Ensure that redis server is up with `redis-server` call
- In backend folder `python manage.py runserver` to start backend server
- In seperate commmand line `python manage.py celery` to start backend worker tasks
- In seperate command line run `npm start` or `yarn start` to run the npm

## Warnings & Addition Notes

- Insemble does not use Postgres, so psycog2 (a depenedency initially listed by django-react-framework) was deleted from the requirements in file of insemble application
- There are a lot of underutilized or redundant files in the front-end that will need to be removed
