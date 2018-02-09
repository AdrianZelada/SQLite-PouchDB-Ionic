//importamos todas las librerias que usaremos para el desarrollo
import  PouchDB from 'pouchdb';
import { File} from '@ionic-native/file'; 
import { fromPromise} from 'rxjs/observable/fromPromise';
import { Observable} from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';

import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite'; 

declare let window:any;
// integracion de pouchdb-adapter-cordova-sqlite con PouchDB
PouchDB.plugin(cordovaSqlitePlugin);

// Los metodos de esta clase son Estáticos para poder ser referenciados sin crear
// alguna instancia de ellos 

export class InitialDB{   
    // Instancia de manejo se archivos. 
    static file:File = new File();

    // Método encargado en llamar los subprocesos para la inicialización de la Base de Datos
    static initDB(dbName:string){            
      // Obtiene el path o ruta de la base de datos
      let sourceFileName = `${InitialDB.file.applicationDirectory}www/assets/${dbName}`;    
      // Obtiene el lugar donde será o esta el archivo SQLite (Base de Datos)
      let targetDirName = InitialDB.file.dataDirectory;    
     
      return InitialDB.resolveLoadDB(dbName,sourceFileName,targetDirName)
        .switchMap((resource:any)=>{  
          // Nos percatamos de que sea un Observable lo que nos devuelve 
          if(resource.subscribe){   
          // si es un Observable lo devolvemos sin modificar
              return resource;
          }else{                
          // si no es un Observable creamos uno para no tener problemas al subscribirnos 
              return Observable.from('a');                                
          }      
      }).map(()=>{     
          // En este paso ya tenemos la certeza de que la Base de Datos ya ha sido 
          // movida en el lugar que necesitamos 
          return  InitialDB.initializeDB(dbName);   
      });                                 
    }
    
    // Método que verifica y obtiene el contenido de cada path o ruta pasada como parámetro
    static resolveFile(path){
      return fromPromise(InitialDB.file.resolveLocalFilesystemUrl(path)).catch((data)=>{        
          return Observable.throw(data);
        }
      )
    }
    
    // Método que obtiene la Base de Datos   
    static resolveLoadDB(dbName,path1,path2){      
      return Observable.forkJoin(
          InitialDB.resolveFile(path1),
          InitialDB.resolveFile(path2),      
      ).switchMap((files)=>{
        // una vez ejecutado las anteriores promesas obtenemos los resultados
        let sourceFile:any = files[0];
        let targetDir:any = files[1];
        // Inicializamos un Promise esta obtendra la Base de Datos.
        return fromPromise(new Promise((res,rej)=>{        
          // Vereficamos si existe la Base de Datos en el path de archivos de la aplicación
          // si existe entonces devolvemos la base de datos para la inicialización con PouchDB
          targetDir.getFile(dbName,{},res,rej);
          // Caso contrario ocurrira un error que lo capturamos
        }).catch((e)=>{      
          // Al capturar el error podemos ver q el archivo de la Base de Datos no esta localizado
          // en el lugar adecuado entonces copeamos el archivo que colocamos en assets y lo localizaremos 
          // en el path de uso de la aplicación
          return fromPromise(new Promise((reso,reje)=>{          
            sourceFile.copyTo(targetDir,dbName,reso,reje);
          }));
        }));           
      });
    }
    
    // Método que Inicializa con PouchDB
    static initializeDB(dbName){
      // Inicializamos la Base de Datos con PouchDB con el adaptador cordova-sqlite
      return new PouchDB(`${dbName}`,{
        adapter: 'cordova-sqlite',            
      });
    }
}