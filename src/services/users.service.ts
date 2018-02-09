import { Injectable} from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FatherDbServices} from './father.db.service';

@Injectable()
// Heredamos los metodos de FatherDbServices
export class UsersDbServices extends FatherDbServices{    
    
    constructor(platform:Platform){   
        // se crea la instancea de la BD users.db con la ayuda de FatherDbServices
        // el parametro que de el nombre de la BD debe de coincidir con la que guardamos en 'assets'
        super(platform,'users.db');
    }      
}