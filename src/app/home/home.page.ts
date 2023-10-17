import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { UserService } from 'src/services/user.service';
import { LocalApiService } from 'src/services/localapi.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user : any;
  currentUser: any;
  profesores : any;
  idProfesor : any;
  userHome: any;

  cursos: any[] = [];
  

  constructor(
    private router: Router,
    private userService : UserService,
    private localApiService : LocalApiService,
    private platform : Platform,
    private storage : Storage,
    private activeroute: ActivatedRoute,
  ) {
    this.platform.ready().then(() => {
      this.storage.create();
      // Puedes acceder a la base de datos de Ionic Storage aquí
    });
  }

  async ngOnInit() {
    await this.initializeStorage();
    // Obtener la lista de profesores desde el servicio
    const isAuthenticated = await this.userService.getIsAuthenticated();
    if (!isAuthenticated) {
      // Redirigir al usuario a la página de inicio de sesión si no está autenticado
      this.router.navigate(['/login']);
    }

    this.currentUser = await this.userService.getCurrentUser();

    this.profesores = await this.localApiService.getProfesores().toPromise();

    this.user = await this.userService.getCurrentUser();


    if (this.user) {
      //console.log('Usuario en sesión:', this.user.username);
    } else {
      // No hay usuario en sesión, puedes redirigirlo a la página de inicio de sesión
      console.log('No hay usuario en sesión, redirigiendo...');
      // Redirige o toma la acción apropiada aquí
    }
    
    this.idProfesor = await this.localApiService.getProfesorIdPorUsuario(this.user.username);
    console.log("ID del profesorrrr:", this.idProfesor);
 

    this.localApiService.getCursosPorProfesor(this.idProfesor).subscribe(data => {
      this.cursos = data;

    });
    
  }

  async initializeStorage() {
    await this.platform.ready();
    await this.storage.create();
  }
  
  async logout(){
    this.userService.logout();
  }

  async prueba(){
    this.localApiService.getProfesorIdPorUsuario("docente");
  }

}
