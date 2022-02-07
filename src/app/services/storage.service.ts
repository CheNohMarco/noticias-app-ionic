import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localArticle: Article[] = [];

  constructor( private storage: Storage ) {
    this.init();
  }

  get getLocalArticles() {
    return [ ...this._localArticle ];
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }

  async saveRemoveArticle( article: Article ) {

    const exists = this._localArticle.find( localArticle => localArticle.title === article.title );

    if( exists ) {
      this._localArticle = this._localArticle.filter( localArticle => localArticle.title !== article.title );
    } else {
      this._localArticle = [ article, ...this._localArticle ];
    }

    this._storage.set('articles', this._localArticle);
  }

  async loadFavorites() {
    try {

      const articles = await this._storage.get('articles');
      this._localArticle = articles || [];

    } catch (error) {
      // this._localArticle = [];
    }
  }

  articleInFavorites( article: Article ) {

    return !!this._localArticle.find( localArticle => localArticle.title === article.title );

  }

}
