from db import query_db
from flask import *
from utils import require_api_key

bp = Blueprint('reaction', __name__)

# GET - get a list of user names of reactions
# POST - add a reaction to the message
@bp.route('/<int:message_id>', methods=['POST'])
@require_api_key
def get_or_add_reaction_to_message(message_id):
    
    # add a new reaction to the message
    api_key = request.headers.get('x-api-key')
    user = query_db('select * from users where api_key = ?', [api_key], one=True)
    data = request.get_json()
    emoji = data.get('emoji')

    reaction = query_db("""insert into reactions (message_id, user_id, emoji) values (?, ?, ?) 
                        returning id, message_id, user_id, emoji""", (message_id, user['id'], emoji), one=True)
    if reaction:
        return jsonify({"id": reaction['id'],
                        'message_id': reaction['message_id'],
                        'user_id': reaction['user_id'],
                        'emoji': reaction['emoji']}), 200
    else:
        return jsonify({"message": f"error adding reaction to {message_id} by {user['name']}"}), 400

@bp.route('/user/<int:message_id>', methods=['POST'])
@require_api_key
def get_user_reactions(message_id):
    data = request.get_json()
    emoji = data.get('emoji')
    reactions = query_db(
        """select distinct u.name as user_name
        from reactions r
        left join users u on r.user_id = u.id
        where r.message_id = ? and r.emoji = ?""", [message_id, emoji])
    user_name_set = set()
    for reac in reactions:
        name = reac["user_name"]
        if name not in user_name_set:
            user_name_set.add(name)
    user_name_list = list(user_name_set)
    if user_name_list:
        return jsonify({"message_id": message_id, 
                        "emoji": emoji, 
                        "user_name_list": user_name_list}), 200
    else:
        return jsonify({"message": "no users find"}), 404   