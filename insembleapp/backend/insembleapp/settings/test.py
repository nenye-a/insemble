from .base import *  # noqa
import urllib


SECRET_KEY = 'test'

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'mongoconnect',
        'HOST': 'mongodb+srv://nenye:' + urllib.parse.quote('helicop251') + '@cluster0-c2jyp.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE',
        'USER': 'nenye',
        'PASSWORD': 'helicop251',
    },
    # removed connection to sqlite3 in order to use original mongo connection
    # 'backup': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': base_dir_join('db.sqlite3'),
    # }
}

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Speed up password hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Celery
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
