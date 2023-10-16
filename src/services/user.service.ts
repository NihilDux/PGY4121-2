import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000'; // Ruta de la API

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform // Agrega el Platform para verificar la plataforma actual
  ) {
    this.platform.ready().then(() => {
      this.storage.create().then(() => {
        // La base de datos se ha creado, ahora puedes acceder a ella
      });
    });
  }

  async initializeStorage() {
    await this.platform.ready();
    await this.storage.create();
  }

  async login(username: string, password: string): Promise<boolean> {
    const data = { user: username, password };

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/login`, data).toPromise();

      if (response.access_token) {
        // Autenticación exitosa
        // Almacena el token JWT en el almacenamiento local
        await this.storage.set('access_token', response.access_token);

        return true;
      } else {
        // Autenticación fallida
        return false;
      }
    } catch (error) {
      // Manejar errores de conexión con el servidor
      console.error('Error en la autenticación:', error);
      return false;
    }
  }

  async logout() {
    // Cierre de sesión
    // Elimina el token JWT del almacenamiento local
    await this.storage.remove('access_token');
    window.location.reload();
  }

  async getIsAuthenticated(): Promise<boolean> {
    // Comprueba si el token JWT existe en el almacenamiento local
    const access_token = await this.storage.get('access_token');
    
    return access_token !== null;
  }
  
  async getCurrentUser(): Promise<any | null> {
    // Decodifica el token JWT para obtener información del usuario
    const access_token = await this.storage.get('access_token');
    if (access_token) {
      const decodedUser = await this.decodeJWT(access_token);
      console.log(decodedUser);
      return decodedUser || null;
    } else {
      return null;
    }
  }

  private decodeJWT(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64));
      return JSON.parse(jsonPayload); // Devuelve los datos del usuario del token (ajusta esto según la estructura de tus tokens)
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }
}
