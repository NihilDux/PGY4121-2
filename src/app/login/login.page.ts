import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  async login() {
    // Comprueba si el usuario y la contraseña coinciden con los datos del servidor.
    try {
      const isAuthenticated = await this.userService.login(this.username, this.password);

      if (isAuthenticated) {
        this.router.navigate(['/home']);
      } else {
        // Mostrar mensaje de error si las credenciales son incorrectas.
        console.log('Credenciales incorrectas');
      }
    } catch (error) {
      // Maneja los errores de la autenticación
      console.error('Error en la autenticación:', error);
    }
  }

}
