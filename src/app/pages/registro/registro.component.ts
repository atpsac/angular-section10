import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor(
    private auth: AuthService,
    private router: Router
     ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    // this.usuario.email = 'paul.angulo.anyosa@gmail.com';
   }

   onSubmit( form: NgForm ) {

    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor',
      icon: 'info'
    });

    Swal.showLoading();

    this.auth.nuevoUsuario( this.usuario ).
    subscribe( resp => {
      console.log( resp );
      Swal.close();
      if ( this.recordarme ) {
        localStorage.setItem('email', this.usuario.email);
      }
      this.router.navigateByUrl('home');
    }, ( err ) => {
      console.log( err.error.error.message);
      Swal.fire({
        title: 'Error al autenticar',
        icon: 'error',
        text: err.error.error.message
      });
    }
    );

   }

}
