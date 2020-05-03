import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyDWv4SWXcPxLvJnhz-cGx-iCUPRrpu0Koc';

  userToken: string;

  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient ) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem( 'token' );
  }

  login( usuario: UsuarioModel ) {

    const AUTHDATA = {
      email: usuario.email,
      password: usuario.password,
      // ...usuario,
      returnSecureToken: true
    };

    return this.http.post( `${ this.url }signInWithPassword?key=${ this.apiKey }`,
    AUTHDATA
    ).pipe(map(resp => {
      this.guardarToken( resp[`idToken`]);
      return resp;
    }));

  }

  nuevoUsuario( usuario: UsuarioModel ) {
    const AUTHDATA = {
      email: usuario.email,
      password: usuario.password,
      // ...usuario,
      returnSecureToken: true
    };

    return this.http.post( `${ this.url }signUp?key=${ this.apiKey }`,
    AUTHDATA
    ).pipe(map(resp => {
      this.guardarToken( resp[`idToken`]);
      return resp;
    }));

  }

  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    const HOY = new Date();
    HOY.setSeconds(3600);

    localStorage.setItem('expira', HOY.getTime().toString());
  }

  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const EXPIRA = Number(localStorage.getItem('expira'));
    const EXPIRA_DATE = new Date();
    EXPIRA_DATE.setTime(EXPIRA);

    if ( EXPIRA_DATE > new Date() ) {
      return true;
    } else {
      return false;
    }

  }

}

