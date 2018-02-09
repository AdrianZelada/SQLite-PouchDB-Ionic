import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CitiesDbServices} from '../../services/cities.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  cities : Array<any>=[];
  constructor(
    public navCtrl: NavController,
    private citiesDb:CitiesDbServices
  ) {
    this.citiesDb.getAllData().subscribe((result:any)=>{        
      this.cities = result.map((data)=>{
        return data.doc
      });        
    });
  }

}
