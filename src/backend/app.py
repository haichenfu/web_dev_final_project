from flask import * 
import sqlite3
from blueprints import user, channel, message, reaction


app = Flask(__name__)

# These should make it so your Flask app always returns the latest version of
# your HTML, CSS, and JS files. We would remove them from a production deploy,
# but don't change them here.
app.debug = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache"
    return response

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# ==== blueprint registration ======
app.register_blueprint(user.bp, url_prefix='/api/user')
app.register_blueprint(channel.bp, url_prefix='/api/channel')
app.register_blueprint(message.bp, url_prefix='/api/message')
app.register_blueprint(reaction.bp, url_prefix='/api/reaction')


if __name__ == '__main__':
    app.run(debug=True)