import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  @ViewChild('loginCardWrapper', { read: ElementRef, static: true }) loginCardWrapper!: ElementRef;
  logindata: any = {
    username: '',
    password: ''
  
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private platform: Platform,
    public toastController: ToastController,
    private animationCtrl: AnimationController,
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
    const validationMessage = this.validateModel(this.logindata);
    const isAuthenticated = await this.userService.login(this.logindata.username, this.logindata.password);
    if (validationMessage === 'success') {

      if (isAuthenticated){
      // Autenticación exitosa
      this.presentToast('Bienvenido');
      await this.playLoginAnimation();
      this.router.navigate(['/home']);
    }
    } else {
      // Mostrar mensaje de error si las credenciales son incorrectas (Por consola).
      this.presentToast('Credenciales incorrectas');
    }
  } catch (error) {
    // Maneja los errores de la autenticación
    console.error('Error en la autenticación:', error);
  }
}

restore(){
  this.router.navigate(['/restore']);
}

validateModel(model: any): string {
  if (model.username.length < 3 || model.username.length > 8) {
    return 'El usuario debe tener al menos 3 caracteres y un máximo de 8';
  }
  if (model.password.length !== 4) {
    return 'La contraseña debe tener exactamente 4 caracteres';
  }
  return 'success';
}

async presentToast(message: string, duration?: number) {
  const toast = await this.toastController.create({
    message: message,
    duration: duration ? duration : 2000,
  });
  toast.present();
}

async playLoginAnimation() {
  const cardElement = this.loginCardWrapper.nativeElement.querySelector('.login-card');

  const animation = this.animationCtrl
    .create()
    .addElement(cardElement)
    .duration(800)
    .iterations(1)
    .fromTo('transform', 'translateY(0)', 'translateY(-100px)')
    .fromTo('opacity', '1', '0');

  await animation.play();
}

}
