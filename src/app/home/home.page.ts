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
  dataUser: any;
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
    });
  }

  async ngOnInit() {
    await this.initializeStorage();
    const isAuthenticated = await this.userService.getIsAuthenticated();
    if (!isAuthenticated) {
      // Redirigir al usuario a la página de inicio de sesión si no está autenticado
      this.router.navigate(['/login']);
    }

    this.user = await this.userService.getCurrentUser();
    this.profesores = await this.localApiService.getProfesores().toPromise();
    this.idProfesor = await this.localApiService.getProfesorIdPorUsuario(this.user.username);
    this.dataUser = await this.localApiService.getDataUser(this.user.username);


    
  }

  async initializeStorage() {
    await this.platform.ready();
    await this.storage.create();
  }
  
  async logout(){
    this.userService.logout();
  }

  async listarCurso(){
    this.localApiService.getCursosPorProfesor(this.idProfesor).subscribe(data => {
      this.cursos = data;
    });
  }

}
