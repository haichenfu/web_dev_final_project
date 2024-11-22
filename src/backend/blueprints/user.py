from db import query_db
from flask import *
import string 
import random
from utils import require_api_key

bp = Blueprint('user', __name__)

# user login
@bp.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    u = query_db('select * from users where name = ? and password = ?', [username, password], one=True)
    if u:
        return jsonify({"username": u["name"], "api_key": u['api_key']}), 200
    else:
        return jsonify({"message": "invalid login credentials"}), 403

# user signup
@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get("username")
    password = data.get("password")
    api_key = 'haichenfu_'+''.join(random.choices(string.ascii_lowercase + string.digits, k=40))
    try: 
        u = query_db("""insert into users (name, password, api_key) 
                    values (?, ?, ?) returning id, name, password, api_key""",
            (name, password, api_key), one=True)
        return jsonify({"user_id": u['id'], "username": name, "api_key": u['api_key']}), 200
    except Exception as e: 
        return jsonify({"message": "username already exist"}), 400
   
        

# PUT - update username
# GET - get username by x-api-key
@require_api_key
@bp.route('/name', methods=['POST', 'GET'])
def get_or_update_username():
    if request.method == 'POST':
        data = request.get_json()
        api_key = request.headers.get('x-api-key')
        user_name = data.get("username")
        u = query_db("update users set name = ? where api_key = ?", [user_name, api_key])
        if u:
            return jsonify({"message": "success"}), 200
        else:
            return jsonify({"message": "username already exist"}), 400
    if request.method == 'GET':
        api_key = request.headers.get('x-api-key')
        if api_key == None:
            return jsonify({"message": "user not found"}), 404
        user = query_db("select * from users where api_key = ?", [api_key], one=True)
        if user == None:
            return jsonify({"message": "user not found"}), 404
        else:
            return jsonify({"name": user["name"]}), 200

# update user password
@require_api_key
@bp.route("/password", methods = ['POST'])
def update_user_password():
    data = request.get_json()
    user_id = data.get("user_id")
    password = data.get("password")
    query_db("update users set password = ? where id = ?", [password, user_id])
    return jsonify({"message": "success"}), 200


