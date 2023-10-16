import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: any[] = []; // Aquí puedes almacenar los datos de los usuarios

  constructor() {}

  // Agregar un usuario
  addUser(user: any) {
    this.users.push(user);
  }

  // Obtener todos los usuarios
  getUsers() {
    return this.users;
  }

  // Obtener un usuario por ID
  getUserById(userId: number) {
    return this.users.find(user => user.id === userId);
  }

  // Actualizar un usuario
  updateUser(userId: number, updatedUser: any) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  // Eliminar un usuario por ID
  deleteUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
  }
}
