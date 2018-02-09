import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsersDbServices} from '../../services/users.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users:Array<any>=[];
  constructor(
    public navCtrl: NavController,
    private usersDb : UsersDbServices ) {
      // Obtenemos todos los datos guardados en la BD
      this.usersDb.getAllData().subscribe((result:any)=>{        
        // hacemos un mapeo para poder obtener los valores de registro
        this.users = result.map((data)=>{
          return data.doc
        });        
      });
  }

}
