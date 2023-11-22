import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/product.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public cart: Observable<Cart[]>;

  constructor(private cartService:CartService) {

    this.cart =this.cartService.getCartH()
    this.getHistory();
  }

  public getHistory(){
    return this.cart.forEach((result)=>{
      console.log(result.forEach(product=>{
        console.log(product.itemCount,product.total, product.items);
      }));
    });
  }
}
