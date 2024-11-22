from flask import *
from functools import wraps
from db import query_db

def require_api_key(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('x-api-key')
        if api_key:
            user = query_db('select * from users where api_key = ?', [api_key], one=True)
            if user:
                return func(*args, **kwargs)
        return jsonify({'error': 'Unauthorized'}), 403
    return decorated