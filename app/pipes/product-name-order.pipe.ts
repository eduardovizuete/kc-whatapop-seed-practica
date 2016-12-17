import { Pipe, PipeTransform} from "@angular/core";
import { Product } from "../models/product";

@Pipe({
    name: "productNameOrder"
})
export class ProductNameOrderPipe implements PipeTransform{

transform(products: Product[], orden:string): Product[] {

        let productosOrdenados: Product[];

        // En caso de ordenacion ascendente
        if (orden === "asc") {
            productosOrdenados = products.sort((prodA: Product, prodB: Product): number => {
                let nombreProdA: string = `${prodA.name}`.toLowerCase();
                let nombreProdB: string = `${prodB.name}`.toLowerCase();
                return nombreProdA > nombreProdB 
                    ? 1 
                    : nombreProdA < nombreProdB 
                        ? -1
                        : 0; 
            });
        }
        // En caso de ordenacion descendente 
        else {
             productosOrdenados = products.sort((prodA: Product, prodB: Product): number => {
                let nombreProdA: string = `${prodA.name}`.toLowerCase();
                let nombreProdB: string = `${prodB.name}`.toLowerCase();
                return nombreProdB > nombreProdA 
                    ? 1 
                    : nombreProdB < nombreProdA 
                        ? -1
                        : 0; 
            });
        }

        return productosOrdenados; 
    }

}