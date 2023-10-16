import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    await this.userService.initializeStorage(); // Asegúrate de que la base de datos se haya creado

    const isAuthenticated = await this.userService.getIsAuthenticated();
    
    if (isAuthenticated) {
      return true; // El usuario está autenticado y puede acceder a la ruta
    } else {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      return this.router.parseUrl('/login');
    }
  }
}
