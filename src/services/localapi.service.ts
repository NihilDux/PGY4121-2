import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { alumnos } from 'src/models/alumnos';

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
    console.log("REVISAR"+data);
    return this.http.post(`${this.apiUrl}/buscar_profesor`, data, { headers: headers });
  }

  getCursosPorProfesor(profesorId: number):Observable<any> {
    return this.http.get<any>(this.apiUrl+'/profesores/'+profesorId+'/cursos', this.httpOptions);
  }

  getAlumnosPorCurso(profesorId: number, cursoId: number){
    return this.http.get<alumnos[]>(this.apiUrl+'/profesores/'+profesorId+'/cursos/'+cursoId+'/alumnos', this.httpOptions);

  }
  
}
