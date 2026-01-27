from flask import request, send_file, jsonify
from model.db_connect import DbConnect
import os
import tempfile

class DatabaseController:
    def __init__(self):
        self.db = DbConnect()

    def exportar(self):
        try:
            usuario = request.form.get('usuario')
            contrasena = request.form.get('contrasena')
            
            # Crear un archivo temporal para el backup
            with tempfile.NamedTemporaryFile(mode='w+', suffix='.sql', delete=False) as temp_file:
                output_file = temp_file.name
            
            # Exportar la base de datos
            if self.db.exporte(output_file, usuario, contrasena):
                # Enviar el archivo como respuesta
                return send_file(output_file, as_attachment=True, download_name='backup_insai.sql', mimetype='application/sql')
            else:
                return jsonify({'error': 'Error al exportar la base de datos o credenciales inválidas'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Limpiar el archivo temporal si existe
            if 'output_file' in locals() and os.path.exists(output_file):
                os.unlink(output_file)

    def importar(self):
        try:
            usuario = request.form.get('usuario')
            contrasena = request.form.get('contrasena')
            
            if 'sql_file' not in request.files:
                return jsonify({'error': 'No se encontró el archivo'}), 400
            
            file = request.files['sql_file']
            if file.filename == '':
                return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
            
            if not file.filename.endswith('.sql'):
                return jsonify({'error': 'El archivo debe ser .sql'}), 400
            
            # Guardar el archivo temporalmente
            with tempfile.NamedTemporaryFile(mode='wb', suffix='.sql', delete=False) as temp_file:
                file.save(temp_file.name)
                input_file = temp_file.name
            
            # Importar la base de datos
            if self.db.importe(input_file, usuario, contrasena):
                return jsonify({'message': 'Base de datos importada exitosamente'}), 200
            else:
                return jsonify({'error': 'Error al importar la base de datos o credenciales inválidas'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Limpiar el archivo temporal
            if 'input_file' in locals() and os.path.exists(input_file):
                os.unlink(input_file)