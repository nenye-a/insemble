from .base import *  # noqa
from pymongo import MongoClient
import urllib


DEBUG = True

HOST = 'http://localhost:8000'

SECRET_KEY = 'secret'

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        'HOST': 'mongodb+srv://nenye:' + urllib.parse.quote(config('MONGO_DB_PASS', cast=str)) + '@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE',
        'USER': 'nenye',
        'PASSWORD': config('MONGO_DB_PASS', cast=str),
    },
    'spaceData': {
        'ENGINE': 'djongo',
        'NAME': 'spaceData',
        'HOST': 'mongodb+srv://nenye:' + urllib.parse.quote(config('MONGO_DB_PASS', cast=str)) + '@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE',
        'USER': 'nenye',
        'PASSWORD': config('MONGO_DB_PASS', cast=str),
    },
    'learn': {
        'ENGINE': 'djongo',
        'NAME': 'learn',
        'HOST': 'mongodb+srv://nenye:' + urllib.parse.quote(config('MONGO_DB_PASS', cast=str)) + '@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE',
        'USER': 'nenye',
        'PASSWORD': config('MONGO_DB_PASS', cast=str),
    },
}

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_TASK_ALWAYS_EAGER = True

# Email
INSTALLED_APPS += ('naomi',)
EMAIL_BACKEND = 'naomi.mail.backends.naomi.NaomiBackend'
EMAIL_FILE_PATH = base_dir_join('tmp_email')

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

JS_REVERSE_JS_MINIFY = False
