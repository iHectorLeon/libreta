import { Injectable } from '@angular/core';
//import { Http,Response,Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map} from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Injectable()
export class HomeService{
  public url:string;
  public identiti;
  public token;
  public roles;

  constructor(private http:HttpClient){
    this.url = environment.url;
  }

  /*
  metodo para traer los datos del usuario logueado
  */
  getIdentiti(){
    let identiti = JSON.parse(localStorage.getItem('identiti'));
    if(identiti != 'undefined'){
      this.identiti = identiti;
    }else{
      this.identiti = null;
    }
    return this.identiti;
  }

  /*
  metodo para poner el token del usuario logueado donde el api lo requiera
  */
  getToken(){
    let token = localStorage.getItem('token');
    if (token != 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  /*
  metodo para obtener los roles del usuario logueado
  */
  getRolSup(){
    let roles = JSON.parse(localStorage.getItem('roles'));
    if (roles.isSupervisor != 'undefined'){
      console.log("si hay rol de supervisor");
      this.roles = roles;
    }
    return this.roles;
  }

  /*
  Metodo para obtener los roles del usuario
  */
  getRoles(){
    let isOrg:any=[];
    let httpaccess = {
      headers : new HttpHeaders({
        'x-access-token':localStorage.getItem('token')
      })
    }
    return this.http.get(this.url+'api/v1/user/myroles',httpaccess);
  }

  /*
  Funcion para obtener los estados de la republica
  */
  getStates(org:string, query:any):Observable<any>{
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/orgunit/list?org='+org+"&query="+json+"&limit=100");
  }

  /*
  Metodo para traer los cursos de la organizacion
  */
  getCoursesOrg():Observable<any>{
    return this.http.get(this.url+'api/course/list?org=conalep',{observe:'response'});
  }

  /*
  Metodo para mostrar el contenido del temario del curso al usuario final
  */
  showBlocks(id:any):Observable<any>{
    return this.http.get(this.url+'api/course/getblocklist?id='+id,{observe:'response'});
  }
  //metodo para obtener las areas de educacion
  getAreas(org:string):Observable<any>{
    return this.http.get(this.url+'api/career/listareas?org='+org,{observe:'response'});
  }

  //metodo para obtener las carreras en base a area de educacion
  getCarreras(org:string, query:any):Observable<any>{
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/career/list?org='+org+"&query="+json+"&limit=50",{observe:'response'});
  }

  getTerms(org:string,query:any):Observable<any>{
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/term/list?org='+org+"&query="+json+"&limit=50",{observe:'response'})//.map(res=>res.json());
  }

}
