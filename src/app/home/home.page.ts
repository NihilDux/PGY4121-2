import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/services/user.service';
import { LocalApiService } from 'src/services/localapi.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user : any;
  profesores : any;


  constructor(
    private http: HttpClient,
    private userService : UserService,
    private localApiService : LocalApiService,
  ) {}

  async ngOnInit() {
    // Obtener la lista de profesores desde el servicio
    this.profesores = await this.localApiService.getProfesores().toPromise();
    
    this.user = await this.userService.getCurrentUser();

    if (this.user) {
      console.log('Usuario en sesión:', this.user);
    } else {
      // No hay usuario en sesión, puedes redirigirlo a la página de inicio de sesión
      console.log('No hay usuario en sesión, redirigiendo...');
      // Redirige o toma la acción apropiada aquí
    }
  }
  
}
