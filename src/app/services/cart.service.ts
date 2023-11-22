import { Injectable } from '@angular/core';
import { Cart, Product, CartItem } from '../models/product.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = {
    items: [],
    total: 0,
    itemCount: 0
  };
  private cartHistorial: Observable<Cart[]>;

  private cartCollection:AngularFirestoreCollection<Cart>;

  constructor(private firestore:AngularFirestore) { 
    this.cartCollection = this.firestore.collection<Cart>('carts');
    this.cartHistorial = this.cartCollection.valueChanges();
  }

  public getCartH(): Observable<Cart[]> {
    return this.cartHistorial;
  }
  public getCart(): Cart {
    return this.cart;
  }

  public addToCart(product: Product): Cart {

    const existingCartItem = this.cart.items.find((item) => item.product.name === product.name);

    if (existingCartItem) {
      // El producto ya existe en el carrito, actualiza la cantidad
      existingCartItem.quantity += 1;
    } else {
      // El producto no existe en el carrito, agrégalo como un nuevo elemento
      const newItem: CartItem = {
        product: product,
        quantity: 1,
      };
      this.cart.items.push(newItem);
    }

    // Actualiza el total y la cantidad de artículos
    this.cart.total = this.calculateTotal(this.cart);
    this.cart.itemCount = this.calculateItemCount(this.cart);

    return this.cart;
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private calculateItemCount(cart: Cart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  public removeItemFromCart(item: CartItem, quantityToRemove: number) {
    const index = this.cart.items.findIndex((cartItem) => cartItem === item);
    if (index !== -1) {
      if (item.quantity > quantityToRemove) {
        item.quantity -= quantityToRemove;
      } else {
        // Si la cantidad a eliminar es igual o mayor que la cantidad en el carrito, elimina el elemento por completo.
        this.cart.items.splice(index, 1);
      }
  
      // Actualiza el total y la cantidad de artículos
      this.cart.total = this.calculateTotal(this.cart);
      this.cart.itemCount = this.calculateItemCount(this.cart);
    }

  }
  buyProducts(cart:Cart):Promise<string>{
    return this.cartCollection.add(cart)
      .then((doc)=>{
        console.log('Productos comprados' + doc.id);
        this.cart = {
          items: [],
          total: 0,
          itemCount: 0
        };
        return 'success'
      })
      .catch((error)=>{
        console.log('error de:'+ error);
        return 'Error'
      });
  }
}
