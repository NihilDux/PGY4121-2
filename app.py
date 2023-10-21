#Para iniciar la app hay que correr una terminal desde la raiz del proyecto con el siguiente comando "py app.py"


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

@app.route('/usuario', methods=['POST'])
def obtener_usuario_por_username():
    data = request.get_json()
    username = data.get('user')
    usuario = next((u for u in usuarios if u["user"] == username), None)
    if usuario:
        return jsonify(usuario), 200
    return jsonify({"message": "Usuario no encontrado"}, 404)

@app.route('/crear_profesor', methods=['POST'])
def crear_profesor():
    data = request.get_json()
    nuevo_profesor = {
        "id": len(profesores) + 1,
        "nombre": data.get('nombre'),
        "cursos": []
    }
    profesores.append(nuevo_profesor)
    return jsonify({"message": "Profesor creado exitosamente", "profesor": nuevo_profesor}), 201

@app.route('/profesores/update/<int:profesor_id>', methods=['PUT'])
def actualizar_profesor(profesor_id):
    data = request.get_json()
    profesor = next((p for p in profesores if p["id"] == profesor_id), None)
    if not profesor:
        return jsonify({"message": "Profesor no encontrado"}, 404)
    
    profesor["nombre"] = data.get('nombre')
    return jsonify({"message": "Profesor actualizado exitosamente", "profesor": profesor}), 200

@app.route('/profesores/delete/<int:profesor_id>', methods=['DELETE'])
def eliminar_profesor(profesor_id):
    profesor = next((p for p in profesores if p["id"] == profesor_id), None)
    if not profesor:
        return jsonify({"message": "Profesor no encontrado"}, 404)
    
    profesores.remove(profesor)
    return jsonify({"message": "Profesor eliminado exitosamente"}), 200

@app.route('/usuarios/create', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    nuevo_usuario = {
        "id": len(usuarios) + 1,
        "user": data.get('user'),
        "password": data.get('password'),
        "nombre": data.get('nombre'),
        "perfil": data.get('perfil'),
        "correo": data.get('correo')
    }
    usuarios.append(nuevo_usuario)
    return jsonify({"message": "Usuario creado exitosamente", "usuario": nuevo_usuario}), 201

@app.route('/usuarios/update/<int:usuario_id>', methods=['PUT'])
def actualizar_usuario(usuario_id):
    data = request.get_json()
    usuario = next((u for u in usuarios if u["id"] == usuario_id), None)
    if not usuario:
        return jsonify({"message": "Usuario no encontrado"}, 404)
    
    usuario["user"] = data.get('user')
    usuario["password"] = data.get('password')
    usuario["nombre"] = data.get('nombre')
    usuario["perfil"] = data.get('perfil')
    usuario["correo"] = data.get('correo')
    return jsonify({"message": "Usuario actualizado exitosamente", "usuario": usuario}), 200

@app.route('/usuarios/delete/<int:usuario_id>', methods=['DELETE'])
def eliminar_usuario(usuario_id):
    usuario = next((u for u in usuarios if u["id"] == usuario_id), None)
    if not usuario:
        return jsonify({"message": "Usuario no encontrado"}, 404)
    
    usuarios.remove(usuario)
    return jsonify({"message": "Usuario eliminado exitosamente"}), 200



if __name__ == '__main__':
    app.run(debug=True)
