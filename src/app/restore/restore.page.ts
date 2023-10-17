import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.page.html',
  styleUrls: ['./restore.page.scss'],
})
export class RestorePage implements OnInit {
  user: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  async restoreUser(){
    await this.presentToast('PONDRE ACA LA PASS O ALGUNA COSA JE');
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 4000,
    });
    toast.present();
  }
}
