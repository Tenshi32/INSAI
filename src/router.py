from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app) # Evita errores de bloqueo en el navegador 

@app.route('/EditDepartamento', methods=['PUT'])
def editar():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron:", datos_recibidos)
    return jsonify({"status": False, "mensaje": "Departamento ha sido editado exitosamente"})

@app.route('/CreateDepartamento', methods=['POST'])
def crear():
    datos_recibidos = request.form.to_dict()
    print("Datos que llegaron:", datos_recibidos)
    return jsonify({"status": True, "mensaje": "Departamento creado exitosamente"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)