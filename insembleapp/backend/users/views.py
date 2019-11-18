from django.shortcuts import render  # noqa
from django.contrib.auth.views import LoginView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
from django.http import HttpResponseRedirect, QueryDict
from django.views.decorators.debug import sensitive_post_parameters

# Create your views here.

class DangerousLoginView(LoginView):
    
    # @method_decorator(csrf_exempt)
    # @method_decorator(never_cache)
    # def dispatch(self, request, *args, **kwargs):
    #     print("############################## made it here ################################")
    #     if self.redirect_authenticated_user and self.request.user.is_authenticated:
    #         redirect_to = self.get_success_url()
    #         if redirect_to == self.request.path:
    #             raise ValueError(
    #                 "Redirection loop for authenticated user detected. Check that "
    #                 "your LOGIN_REDIRECT_URL doesn't point to a login page."
    #             )
    #         return HttpResponseRedirect(redirect_to)
    #     return super().dispatch(request, *args, **kwargs)
    template_name = 'exampleapp/itworks.html'
    @method_decorator(sensitive_post_parameters())
    @method_decorator(csrf_exempt)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        if self.redirect_authenticated_user and self.request.user.is_authenticated:
            redirect_to = self.get_success_url()
            if redirect_to == self.request.path:
                raise ValueError(
                    'Redirection loop for authenticated user detected. Check that '
                    'your LOGIN_REDIRECT_URL doesn\'t point to a login page.')
            return HttpResponseRedirect(redirect_to)
        return super(LoginView, self).dispatch(request, *args, **kwargs)