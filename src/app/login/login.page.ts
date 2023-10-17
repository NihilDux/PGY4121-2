// login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private platform: Platform,
    private storage: Storage,
  ) {
    this.platform.ready().then(() => {
      this.userService.initializeStorage(); // Asegúrate de que la base de datos se haya creado
    });

    this.userService.getIsAuthenticated().then((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/home']);
      }
    });
  }

async login() {
  // Comprueba si el usuario y la contraseña coinciden con los datos del servidor.
  try {
    const isAuthenticated = await this.userService.login(this.username, this.password);

    if (isAuthenticated) {
      // Autenticación exitosa
      this.router.navigate(['/home']);
    } else {
      // Mostrar mensaje de error si las credenciales son incorrectas (Por consola).
      console.log('Credenciales incorrectas');
    }
  } catch (error) {
    // Maneja los errores de la autenticación
    console.error('Error en la autenticación:', error);
  }
}

}
