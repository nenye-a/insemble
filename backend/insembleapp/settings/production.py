import sentry_sdk

import os
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *  # noqa
import urllib


DEBUG = False

# SECRET_KEY = config('SECRET_KEY')
SECRET_KEY = os.environ['SECRET_KEY']

GOOG_KEY = os.environ['GOOG_KEY']
YELP_KEY = os.environ['YELP_KEY']
FRSQ_ID = os.environ['FRSQ_ID']
FRSQ_SECRET = os.environ['FRSQ_SECRET']
CRIME_KEY = os.environ['CRIME_KEY']

MONGO_USER = os.environ['MONGO_USER']
MONGO_DB_PASS = os.environ["MONGO_DB_PASS"]
AWS_ACCESS_KEY_ID = os.environ["AWS_ACECSS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]

ANM_KEY = os.environ['ANM_KEY']


DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'appbackend',
        'HOST': "mongodb+srv://" + urllib.parse.quote(MONGO_USER) + ":" + urllib.parse.quote(MONGO_DB_PASS) + "@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE",
        'USER': MONGO_USER,
        'PASSWORD': MONGO_DB_PASS,
    }
}
DATABASES['default']['ATOMIC_REQUESTS'] = True

ALLOWED_HOSTS = os.environ['ALLOWED_HOSTS']

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

SERVER_EMAIL = 'info@insemblegroup.com'

EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = os.environ['SENDGRID_USERNAME']
EMAIL_HOST_PASSWORD = os.environ['SENDGRID_PASSWORD']
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Security
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Webpack
WEBPACK_LOADER['DEFAULT']['CACHE'] = True

CELERY_BROKER_URL = os.environ['REDIS_URL']
CELERY_RESULT_BACKEND = os.environ['REDIS_URL']

CELERY_SEND_TASK_ERROR_EMAILS = True

# Whitenoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MIDDLEWARE.insert(  # insert WhiteNoiseMiddleware right after SecurityMiddleware
    MIDDLEWARE.index('django.middleware.security.SecurityMiddleware') + 1,
    'whitenoise.middleware.WhiteNoiseMiddleware')

# django-log-request-id
MIDDLEWARE.insert(  # insert RequestIDMiddleware on the top
    0, 'log_request_id.middleware.RequestIDMiddleware')

LOG_REQUEST_ID_HEADER = 'HTTP_X_REQUEST_ID'
LOG_REQUESTS = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'request_id': {
            '()': 'log_request_id.filters.RequestIDFilter'
        },
    },
    'formatters': {
        'standard': {
            'format': '%(levelname)-8s [%(asctime)s] [%(request_id)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'filters': ['request_id'],
            'formatter': 'standard',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO'
        },
        'django.security.DisallowedHost': {
            'handlers': ['null'],
            'propagate': False,
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'log_request_id.middleware': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}

JS_REVERSE_EXCLUDE_NAMESPACES = ['admin']

# Sentry
SENTRY_DSN = os.environ['SENTRY_DSN']
COMMIT_SHA = os.environ['HEROKU_SLUG_COMMIT']

sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[DjangoIntegration()],
    release=COMMIT_SHA
)
