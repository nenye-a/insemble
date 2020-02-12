from .base import *  # noqa
import urllib


DEBUG = True

HOST = 'http://localhost:8000'

SECRET_KEY = 'secret'

GOOG_KEY = config('GOOG_KEY')
YELP_KEY = config('YELP_KEY')
FRSQ_ID = config('FRSQ_ID')
FRSQ_SECRET = config('FRSQ_SECRET')
CRIME_KEY = config('CRIME_KEY')

MONGO_USER = config('MONGO_USER', cast=str)
MONGO_DB_PASS = config("MONGO_DB_PASS", cast=str)
AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")


DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        'HOST': "mongodb+srv://" + urllib.parse.quote(MONGO_USER) + ":" + urllib.parse.quote(MONGO_DB_PASS) + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE",
        'USER': MONGO_USER,
        'PASSWORD': MONGO_DB_PASS,
    }
}

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_BROKER_URL = config('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = config('REDIS_URL')
CELERY_TASK_ALWAYS_EAGER = False

# Email
# INSTALLED_APPS += ('naomi',)
# EMAIL_BACKEND = 'naomi.mail.backends.naomi.NaomiBackend'
# EMAIL_FILE_PATH = base_dir_join('tmp_email')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(levelname)-8s [%(asctime)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO'
        },
        'celery': {
            'handlers': ['console'],
            'level': 'INFO'
        }
    }
}

# Sentry
SENTRY_DSN = config('SENTRY_DSN', default='')
COMMIT_SHA = config('HEROKU_SLUG_COMMIT', default='')

JS_REVERSE_JS_MINIFY = False
