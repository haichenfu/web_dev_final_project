from db import query_db
from flask import *
from utils import require_api_key
from functools import wraps

bp = Blueprint('channel', __name__)

# get a list of channels and amount of unread messages

@bp.route('/all', methods=['GET'])
@require_api_key
def get_all_channels():
    api_key = request.headers.get('x-api-key')
    user = query_db('select * from users where api_key = ?', [api_key], one=True)
    channels = query_db(
        """ select c.id as id, c.name as name, 
        count(case
            when m.post_time > ifnull(mr.read_timestamp, '1970-01-01 00:00:00') 
              then m.id 
              else null
            end) as unread_count
        from channels c
        left join messages m on c.id = m.channel_id and m.replies_to is null
        left join message_reads mr on c.id = mr.channel_id and mr.user_id = ?
        GROUP BY c.id, c.name;
    """, [user['id']])
    if channels:
        channels_list = [{'id': channel['id'], 'name': channel['name'], 'unread_count': channel['unread_count']} for channel in channels]
        return jsonify({"channels": channels_list}), 200
    else:
        return jsonify({"message": "no existing channels"}), 404


# create new channel
@bp.route('/create', methods=["POST"])
@require_api_key
def create_channel():
    data = request.get_json()
    channel_name = data.get('name')
    try:
        channel = query_db('insert into channels (name) values (?) returning id, name', [channel_name], one=True)
        return jsonify({"id": channel['id'], "name": channel_name}), 200
    except Exception as e:
        return jsonify({"message": "channel name already exist"}), 400
        




