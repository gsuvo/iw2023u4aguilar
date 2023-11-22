import { Injectable } from '@angular/core';
import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFirestore,AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import {doc,deleteDoc,Firestore,collection,addDoc,collectionData}from '@angular/fire/firestore';
import { documentId } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Observable<Product[]>;


  public productCollection: AngularFirestoreCollection<Product>;

  private productoGuardado: Product | null = null;

  public pos = 0;
  public productwhere: Product = {
    id: "",
    name: "",
    price: 0,
    description: "",
    type: "",
    photo: ""
  };

  


  constructor(private firestore: AngularFirestore) {
    // this.products.push({
    //   name: "Aguacate",
    //   price: 100,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Frutas y Verduras",
    //   photo: "https://picsum.photos/500/300?random",
    // });
    // this.products.push({
    //   name: "Coca Cola",
    //   price: 20,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Abarrotes",
    //   photo: "https://picsum.photos/500/300?random"
    // });
    // this.products.push({
    //   name: "Jabón Zote",
    //   price: 40,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Limpieza",
    //   photo: "https://picsum.photos/500/300?random"
    // });
    // this.products.push({
    //   name: "Aspirina",
    //   price: 50,
    //   description: "Lorem ipsum dolor sit amet.",
    //   type: "Farmacia",
    //   photo: "https://picsum.photos/500/300?random"
    // });

   // this.productCollection = this.firestore.collection<Product>('products');
   this.productCollection= this.firestore.collection<Product>('products');
    

    this.products = this.productCollection.valueChanges();

 
    
  }

  saveProduct(product: Product): Promise<string> {
    // this.products.push(product);
    // return of(product);.
    return this.productCollection.add(product).then((doc)=>{
      console.log("Producto añadido con id"+doc.id);

      //Obten el ID del documento en el que se enuentra el producto

      this.productCollection.doc(doc.id).update({id:doc.id});

    return "success";
    }).catch((error)=>{
      console.log("Error al anadir el producto"+error);
      return "error";
    })
  }


getProducts(): Observable<Product[]> {
  // return of(this.products);
  return this.products;
 }

 //Obten el id de los documentos
DeleteAndgetId(product: Product) {
  this.firestore.collection('products', ref =>
    ref.where('name', '==', product.name)
       .where('price', '==', product.price)
       .where('type', '==', product.type)
       .where('description', '==', product.description)
       .where('photo', '==', product.photo)
       // Agrega más condiciones según las propiedades de tu producto
  )
  .get()
  .subscribe(querySnapshot => {
    if (querySnapshot.size > 0) {
      const isConfirmed = confirm('¿Estás seguro de que deseas eliminar este producto?');
      
      if (isConfirmed) {
        querySnapshot.forEach(doc => {
          const docId = doc.id;

          this.firestore.collection('products').doc(docId).delete()
            .then(() => {
              console.log('Producto eliminado exitosamente.');
            })
            .catch(error => {
              console.error('Error al eliminar el producto:', error);
            });
        });
      } else {
        console.log('La eliminación del producto fue cancelada.');
      }
    } else {
      console.log('Producto no encontrado.');
    }
  });
}

updateProduct(product:Product):Promise<string>{
  return this.productCollection.doc(product.id).update(product)
  .then((doc)=>{
    console.log('Producto actualizado con id'+ product.id);

    return 'success'
  })
  .catch((error)=>{
    console.log('Error al actualizar producto'+ error);
    return 'Error'
  });
}









}


