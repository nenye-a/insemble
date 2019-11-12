class SpacesRouter:
    """
    Router to control all actions within the spacess class
    """

    def db_for_read(self, model, **hints):
        """
        Attempts to read spaces models go to spacesData.
        """
        if model._meta.app_label == 'spaces':
            return 'spacesData'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write spaces models go to spacesData.
        """
        if model._meta.app_label == 'spaces':
            return 'spacesData'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the spaces app is involved.
        """
        if obj1._meta.app_label == 'spaces' or \
           obj2._meta.app_label == 'spaces':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the spaces app only appears in the 'spacesData'
        database.
        """
        if app_label == 'spaces':
            return db == 'spacesData'
        return None
