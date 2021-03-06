import { Inject, Injectable } from "@angular/core";
import { Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { Product } from "../models/product";
import { ProductFilter } from "../models/product-filter";
import { BackendUri } from "../app.settings";

@Injectable()
export class ProductService {

    constructor(
        @Inject(BackendUri) private _backendUri: string,
        private _http: Http) { }

    getProducts(filter: ProductFilter = undefined): Observable<Product[]> {

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pink Path                                                        |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos ordenados de más   |
        | reciente a menos, teniendo en cuenta su fecha de publicación.    |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo hacer |
        | la ordenación de los datos en tus peticiones, pero te ayudo      |
        | igualmente. La querystring debe tener estos parámetros:          |
        |                                                                  |
        |   _sort=publishedDate&_order=DESC                                |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        
        if (filter === null) {
            return this._http
                   .get(`${this._backendUri}/products?_sort=publishedDate&_order=DESC`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Red Path                                                         |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | texto y/ por categoría.                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | querystring debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por texto:                                          |
        |       q=x (siendo x el texto)                                    |
        |   - Búsqueda por categoría:                                      |
        |       category.id=x (siendo x el identificador de la categoría)  |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        if (filter !== null) {
            if (filter.text !== undefined && filter.category !== undefined) {
                return this._http
                   .get(`${this._backendUri}/products?q=${filter.text}&category.id=${filter.category}`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));       
            } else if (filter.text !== undefined) {
                return this._http
                   .get(`${this._backendUri}/products?q=${filter.text}`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
            } else if (filter.category !== undefined) {
                return this._http
                   .get(`${this._backendUri}/products?category.id=${filter.category}`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
            }
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Yellow Path                                                      |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | estado.                                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | querystring debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por estado:                                         |
        |       state=x (siendo x el estado)                               |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        if (filter !== null) {
            if (filter.state !== undefined) {
                return this._http
                   .get(`${this._backendUri}/products?state=${filter.state}`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));       
            }

            // busqueda por rango
            if (filter.rangeFrom !== undefined && filter.rangeTo !== undefined) {
                return this._http
                   .get(`${this._backendUri}/products?price_gte=${filter.rangeFrom}&price_lte=${filter.rangeTo}`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));       
            }
        }

        return this._http
                   .get(`${this._backendUri}/products?_sort=publishedDate&_order=DESC`)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));

    }

    getProduct(productId: number): Observable<Product> {
        return this._http
                   .get(`${this._backendUri}/products/${productId}`)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }

    buyProduct(productId: number): Observable<Product> {
        let body: any = { "state": "sold" };
        return this._http
                   .patch(`${this._backendUri}/products/${productId}`, body)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }

    setProductAvailable(productId: number): Observable<Product> {
        let body: any = { "state": "selling" };
        return this._http
                   .patch(`${this._backendUri}/products/${productId}`, body)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }
}
