import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, ToastController, AnimationController } from '@ionic/angular';
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
  @ViewChild('titulo', { read: ElementRef }) titulo: ElementRef;
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
    private alertController: AlertController,
    private toastController: ToastController,
    private animationCtrl: AnimationController,
  ) {
    this.titulo = ElementRef.prototype as any;
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

  async listarCurso(){ //No funciona el catch, seguramente no da error pero 
    try{               //no me trae los datos ya que el error está dentro del Flask
      this.localApiService.getCursosPorProfesor(this.idProfesor).subscribe(data => {
        this.cursos = data;
      });

    } catch(error){
      this.presentToast('No hay cursos para listar');
    }

  }

  //Animaciones y esas cosas (Pero aun no funciona bien, sólo al click)
  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }
  
  async animatedTitle() {
    const titleElement = this.titulo.nativeElement;

    const translateAnimation = this.animationCtrl
      .create()
      .addElement(titleElement)
      .keyframes([
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.5, transform: 'translateX(50%)' },
        { offset: 1, transform: 'translateX(0)' },
      ])
      .duration(1500);

    const opacityAnimation = this.animationCtrl
      .create()
      .addElement(titleElement)
      .keyframes([
        { offset: 0, opacity: '1' },
        { offset: 0.5, opacity: '0.2' },
        { offset: 1, opacity: '1' },
      ])
      .duration(1000);

    const combinedAnimation = this.animationCtrl
      .create()
      .addAnimation([translateAnimation, opacityAnimation]);

    const repeatAnimation = async () => {
      await combinedAnimation.play();
      setTimeout(repeatAnimation, 2500);
    };

    repeatAnimation();
  }

}
