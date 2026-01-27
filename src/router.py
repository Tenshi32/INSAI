from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
import os

from routes.periodo_router import periodo_bp 
from routes.departamento_router import departamento_bp
from routes.nivel_router import nivel_bp
from routes.select_router import select_bp
from routes.usuario_router import usuario_bp
from routes.comunicatorio_router import comunicatorio_bp
from routes.lineamiento_router import lineamiento_bp
from routes.usuario_data_router import usuario_data_bp
from routes.ubicacion_router import ubicacion_bp
from routes.ticket_router import ticket_bp
from routes.auditoria_router import auditoria_bp
from routes.cabecera_data_router import cabecera_data_bp
from routes.bd_router import database_bp

#Controllers
from controller import *

app = Flask(__name__)

CORS(app, 
     supports_credentials=True, 
     origins=["http://localhost"], 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

app.secret_key = 'insaiPOA2026'

app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False, # Ponlo en True solo cuando uses HTTPS (producción)
    SESSION_COOKIE_HTTPONLY=True
)

# Configuración de la carpeta de subida
UPLOAD_FOLDER = 'assets/img/avatars'

# Crear la carpeta si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # Límite de 5MB


@app.route('/set-cookie')
def set_cookie():
    resp = make_response("Cookie creada con éxito")
    # set_cookie(nombre, valor, tiempo_en_segundos)
    resp.set_cookie('tema_visual', 'oscuro', max_age=60*60*24) # Dura 1 día
    return resp

app.register_blueprint(usuario_data_bp, url_prefix='/UsuarioData')

@app.before_request
def check_auth():
    if request.method == 'OPTIONS':
        return
    if request.path.startswith('/UsuarioData/Login') or request.path == '/set-cookie':
        return
    if 'usuario_id' not in session:
        return jsonify({"status": False, "mensaje": "No autorizado"}), 401
# Registro de blueprints

app.register_blueprint(periodo_bp, url_prefix='/Periodo')

app.register_blueprint(departamento_bp, url_prefix='/Departamento')

app.register_blueprint(nivel_bp, url_prefix='/Nivel')

app.register_blueprint(select_bp, url_prefix='/Select')

app.register_blueprint(usuario_bp, url_prefix='/Usuario')

app.register_blueprint(comunicatorio_bp, url_prefix='/Comunicatorio')

app.register_blueprint(lineamiento_bp, url_prefix='/Lineamiento')

app.register_blueprint(ubicacion_bp, url_prefix='/Ubicacion')

app.register_blueprint(ticket_bp, url_prefix='/Ticket')

app.register_blueprint(auditoria_bp, url_prefix='/Auditoria')

app.register_blueprint(cabecera_data_bp, url_prefix='/CabeceraData')

app.register_blueprint(database_bp, url_prefix='/Database')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)