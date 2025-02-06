import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configurações do app
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres.otehdyoibzmgrqufxbgm:m4BS9EOVC3NsiVzM@aws-0-sa-east-1.pooler.supabase.com:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('secret_key')

    # Inicializa o SQLAlchemy com o app
    db.init_app(app)

    # Importa e registra as rotas
    from . import routes
    app.register_blueprint(routes.main)
    
    # port = int(os.environ.get('PORT', 5000))
    # app.run(debug=True, host='0.0.0.0', port=port)

    return app