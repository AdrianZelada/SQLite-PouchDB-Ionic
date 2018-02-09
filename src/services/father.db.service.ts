import { Platform } from 'ionic-angular';
import { InitialDB} from './init.db'; 
import { Observable } from 'rxjs/Observable';
import { fromPromise} from 'rxjs/observable/fromPromise';
import { Subject} from 'rxjs/Subject';

export class FatherDbServices{    
    // Referencia de la Base de Datos que se Instanciá
    db:any={};   
    // Observable que puede contener alguna llamada antes de la inicialización de la Base de Datos
    $init:Subject<any>=new Subject();
    // variable de control de inicialización
    private _initial:boolean=false;
      
    constructor(private platform:Platform,dbName:string){      
        this.platform.ready().then(()=>{
          // si la aplicación inicia correctamente se llamara a la clase encargada de instanciar la Base de Datos
            let init=InitialDB.initDB(dbName).subscribe((db:any)=>{
              // nos devuelve la instancia de BD la almacenamos en la variable para poder referenciarla 
                this.db=db;  
              // cambiamos el estado de nuestra variable de control
                this._initial=true;    
              // damos el aviso de que se inicializo la BD
                this.$init.next();
              // nos desligamos de la subscribcion para no crear varias instancias de la BD
                init.unsubscribe();
            })
        })
    }   

    getAllData(): Observable<any>{    
         // obtenemos todos los datos de la BD instanceada    
        return this.interceptorDB('allDocs',{include_docs:true});        
    }

    // Método que nos ayuda a tener un mejor orden en las llamadas a la BD y tambien ejecuta metodos 
    // que se hicieron alguna peticion antes de que la BD iniciara correctamente 
    interceptorDB(promiseQuery:any,options:any): Observable<any>{
        if(this._initial){
            return fromPromise(this.db[promiseQuery](options)).map((data:any)=>{                                
                return data.rows || data;
            });
        }else{            
            return this.$init.switchMap(()=>{
                return fromPromise(this.db[promiseQuery](options)).map((data:any)=>{                                    
                    return data.rows || data;
                });
            }) 
        }                
    }
}