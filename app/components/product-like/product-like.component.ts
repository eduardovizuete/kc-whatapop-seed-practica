import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "product-like",
    templateUrl: "./app/components/product-like/product-like.component.html"
})
export class ProductLikeComponent implements OnInit{

    @Input() userId: number;

    _numLikes: number = 0;

    ngOnInit() {
        this._numLikes = parseInt(localStorage.getItem(this.userId.toString()));
        if (isNaN(this._numLikes)) {
            this._numLikes = 0;
            localStorage.setItem(this.userId.toString(), this._numLikes.toString());
        }               
    }

    addLike(): void {
        this._numLikes = parseInt(localStorage.getItem(this.userId.toString()));
        this._numLikes++;
        localStorage.setItem(this.userId.toString(), this._numLikes.toString());
    }
    
}