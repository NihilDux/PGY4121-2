from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt

app = Flask(__name__)
CORS(app)

SECRET_KEY = 'your-secret-key'  # Cambiar esto por una clave segura.

profesores = [
    {
        "id": 1,
        "nombre": "Nicolas Muñoz",
        "cursos": [
            {
                "id": 1,
                "nombre": "Programación de Apps Moviles",
                "codigo": "PGY4121",
                "seccion": "009V",
                "alumnos": [
                    {"id": 1, "nombre": "Angelo"},
                    {"id": 2, "nombre": "Samira"}
                ]
            },
            {
                "id": 2,
                "nombre": "Programacion Web",
                "codigo": "PGY3121",
                "seccion": "010V",
                "alumnos": [
                    {"id": 1, "nombre": "Angelo"},
                ]
            },
            {
                "id": 3,
                "nombre": "Portafolio",
                "codigo": "PGY4131",
                "seccion": "012V",
                "alumnos": [
                    {"id": 2, "nombre": "Samira"},
                ]
            }
        ]
    }
]

usuarios = [
    {
        "id": 1,
        "user": "docente",
        "password": "0410",
        "nombre": "Nicolas Muñoz",
        "perfil":  1,
        "correo": "docente@duocuc.cl"
    },
    {
        "id": 2,
        "user": "alumno",
        "password": "0410",
        "nombre": "Angelo Curin",
        "perfil": 2,
        "correo": "alumno@duocuc.cl"
    }
]

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('user')
    password = data.get('password')

    # Realiza la verificación de credenciales, por ejemplo, en tu lista de usuarios
    user = next((u for u in usuarios if u["user"] == username and u["password"] == password), None)

    if user:
        # Genera un token JWT con la información del usuario
        token = jwt.encode({'user_id': user['id'], 'username': user['user']}, SECRET_KEY, algorithm='HS256')

        return jsonify({'access_token': token, 'user_id': user['id'], 'username': user['user']}), 200


    return jsonify({"message": "Credenciales incorrectas"}), 401


@app.route('/profesores', methods=['GET'])
def obtener_profesores():
    return jsonify(profesores), 200

@app.route('/profesores/<int:profesor_id>/cursos', methods=['GET'])
def obtener_cursos_profesor(profesor_id):
    profesor = next((p for p in profesores if p["id"] == profesor_id), None)
    if not profesor:
        return jsonify({"message": "Profesor no encontrado"}, 404)
    return jsonify(profesor["cursos"]), 200

@app.route('/profesores/<int:profesor_id>/cursos/<int:curso_id>/alumnos', methods=['GET'])
def obtener_alumnos_curso(profesor_id, curso_id):
    profesor = next((p for p in profesores if p["id"] == profesor_id), None)
    if not profesor:
        return jsonify({"message": "Profesor no encontrado"}, 404)
    curso = next((c for c in profesor["cursos"] if c["id"] == curso_id), None)
    if not curso:
        return jsonify({"message": "Curso no encontrado"}, 404)
    return jsonify(curso["alumnos"]), 200

@app.route('/buscar_profesor', methods=['POST'])
def buscar_profesor_por_usuario():
    data = request.get_json()
    username = data.get('username')
    
    # Paso 2: Buscar el usuario en la lista de usuarios
    user_encontrado = next((u for u in usuarios if u["user"] == username), None)
    
    if user_encontrado:
        # Paso 3: Usar el nombre del usuario para buscar el ID del profesor
        nombre_profesor = user_encontrado['nombre']
        profesor = next((p for p in profesores if p["nombre"] == nombre_profesor), None)
        
        if profesor:
            return jsonify({'id': profesor['id']}), 200
    return jsonify({"message": "Profesor no encontrado"}, 404)




if __name__ == '__main__':
    app.run(debug=True)
