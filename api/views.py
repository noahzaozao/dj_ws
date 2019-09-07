from django.http.response import JsonResponse
from django.views.generic import View


def api_common(data={}, code=0, message='success'):
    response = {
        'data': data,
        'return_code': code,
        'return_message': message
    }
    return response


class APILoginView(View):
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not username or not password:
            return JsonResponse(api_common({}, -1, 'username or password is empty'))

        data = {
            'username': username
        }
        return JsonResponse(api_common(data=data))
