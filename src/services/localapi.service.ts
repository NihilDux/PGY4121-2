import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { alumnos } from 'src/models/alumnos';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalApiService {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) }

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/profesores');
  }
  
  getIdProfesor(user: string): Observable<any> {
    const data = { user: user };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/buscar_profesor`, data, { headers: headers });
  }

  getCursosPorProfesor(profesorId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/profesores/' + profesorId + '/cursos', this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error al obtener los cursos:', error);
        if (error.status === 404) {
          console.log('No tiene cursos');
        }
        throw error;
      })
    );
  }
  getAlumnosPorCurso(profesorId: number, cursoId: number){
    return this.http.get<alumnos[]>(this.apiUrl+'/profesores/'+profesorId+'/cursos/'+cursoId+'/alumnos', this.httpOptions);

  }

  async getProfesorIdPorUsuario(user: string) {
    // Usuario a buscar
    const usuarioBuscado = user;
  
    // Paso 1: Enviar el usuario al servidor Flask
    const data = { username: usuarioBuscado };
  
    try {
      const response = await this.http.post<any>('http://localhost:5000/buscar_profesor', data).toPromise();
  
      if (response.id) {
        // ID del profesor encontrado
        const profesorId = response.id;

        return profesorId;
      } else {
        // Profesor no encontrado
        console.log('Profesor no encontrado');
      }
    } catch (error) {
      // Manejar los errores de la solicitud
      console.error('Error en la solicitud:', error);
    }
  }

  async getDataUser(user: string) {
    const data = { user };
    try {      
      return await this.http.post<any>('http://localhost:5000/usuario', data).toPromise();
      
    } catch (error) {
      console.error('Error en la solicitud para obtener el usuario:', error);
      throw error;
    } 
  }
  
  
  
  
  
}
