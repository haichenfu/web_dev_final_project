from db import query_db
from flask import *
from utils import require_api_key

bp = Blueprint('message', __name__)

# GET - get all messages for a channel for a specific user 
# update the message_read table correspondingly
# POST - post a new message to a channel
@bp.route("/<int:channel_id>", methods=['GET', 'POST'])
@require_api_key
def get_or_post_messages_of_channel(channel_id):
    if request.method == "GET": 
        # get a list of messages for channel
        messages = query_db(
            """select m.id as id, u.name as user_name, m.channel_id as channel_id, m.body as body, 
            m.post_time as post_time, count(r.id) as num_replies, 
            COALESCE(json_group_array(json_object('emoji', reac.emoji, 'count', reac.emoji_count)), '[]') as reactions
            from messages m
            left join messages r on m.id = r.replies_to
            left join users u on m.user_id = u.id
            left join (
                select message_id, emoji, count(emoji) as emoji_count
                from reactions
                group by message_id, emoji
            ) reac on m.id = reac.message_id
            where m.channel_id = ? and m.replies_to is null
            group by m.id 
            order by m.post_time asc;""", 
            [channel_id])
        messages_list = [{'id': message['id'], 
                        'user_name': message["user_name"], 
                        'channel_id': message['channel_id'], 
                        'body': message['body'],
                        'post_time': message['post_time'],
                        'num_replies': message['num_replies'],
                        'reactions': message['reactions']} for message in messages]
        # update the latest timestamp of message_read
        api_key = request.headers.get('x-api-key')
        user = query_db('select * from users where api_key = ?', [api_key], one=True)
        message_read = query_db('select * from message_reads where user_id = ? and channel_id = ?', [user['id'], channel_id], one=True)
        if message_read:
            query_db("update message_reads set read_timestamp = CURRENT_TIMESTAMP where user_id = ? and channel_id = ?", [user['id'], channel_id])
        else:
            query_db("insert into message_reads (user_id, channel_id, read_timestamp) values (?, ?, CURRENT_TIMESTAMP)", [user['id'], channel_id])
        if messages_list:
            return jsonify({"messages": messages_list}), 200
        else:
            return jsonify({"message": "messages does not exist"}), 404
    # post a new message to the channel
    elif request.method == 'POST':
        api_key = request.headers.get('x-api-key')
        user = query_db('select * from users where api_key = ?', [api_key], one=True)
        data = request.get_json()
        body = data.get('body')
        message = query_db("""insert into messages (user_id, channel_id, body) values (?, ?, ?) 
                 returning id, user_id, channel_id, body, post_time""", (user['id'], channel_id, body), one=True)
        if message:
            return jsonify({"id": message['id'],
                            "user_id": message['user_id'],
                            "channel_id": message['channel_id'],
                            'body': message['body'],
                            'post_time': message['post_time']}), 200
        else:
            return jsonify({"message": f"fail to add a new message to channel {channel_id}"}), 400
        

# GET - get a list of all replies to a message
# POST - post a reply to a message 
@bp.route('/reply/<int:message_id>', methods=['GET', 'POST'])
@require_api_key
def get_or_post_reply(message_id):
    # get the list of replies of the message
    if request.method == 'GET':
        replies = query_db(
            """select m.id as id, u.name as user_name, m.replies_to as replies_to, m.channel_id as channel_id, m.body as body, 
            m.post_time as post_time,
            COALESCE(json_group_array(json_object('emoji', reac.emoji, 'count', reac.emoji_count)), '[]') as reactions
            from messages m
            left join users u on m.user_id = u.id
            left join (
                select message_id, emoji, count(emoji) as emoji_count
                from reactions
                group by message_id, emoji
            ) reac on m.id = reac.message_id
            where m.replies_to = ?
            group by m.id
            order by m.post_time asc;
            """, [message_id], one=False)
        replies_list = [{'id': reply['id'],
                         'user_name': reply['user_name'],
                         'channel_id': reply['channel_id'],
                         'replies_to': reply['replies_to'],
                         'body': reply['body'],
                         'post_time': reply['post_time'],
                         'reactions': reply['reactions']} for reply in replies]
        if replies_list:
            return jsonify({"replies_list": replies_list}), 200
        else:
            return jsonify({"message": "no existing replies"}), 404
    # post a new reply to the message
    elif request.method == 'POST':
        api_key = request.headers.get('x-api-key')
        user = query_db('select * from users where api_key = ?', [api_key], one=True)
        data = request.get_json()
        body = data.get('body')
        parent_message = query_db("select * from messages where id = ?", [message_id], one=True)
        channel_id = parent_message['channel_id']
        message = query_db("""insert into messages (user_id, channel_id, body, replies_to) values (?, ?, ?, ?) 
                 returning id, user_id, channel_id, body, replies_to, post_time""", (user['id'], channel_id, body, message_id), one=True)
        if message:
            return jsonify({"id": message['id'],
                            "user_id": message['user_id'],
                            "channel_id": message['channel_id'],
                            'body': message['body'],
                            'replies_to': message['replies_to'],
                            'post_time': message['post_time']}), 200
        else:
            return jsonify({"message": f"fail to add a new message to channel {channel_id}"}), 400


