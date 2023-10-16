import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService,
    private router: Router
  ) {}

  login() {
    if (this.userService.login(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      // Mostrar mensaje de error si las credenciales son incorrectas.
      // Por ejemplo, utilizando un Toast de Ionic.
    }
  }
}
