import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '98IXUbZnJjfRJm9WeAnJQ73p9jEcNSTL';
  private _historal: string[] = [];
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historal];
  }

  constructor( private http: HttpClient ) {
    this._historal = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs( query: string ) {

    query = query.trim().toLocaleLowerCase();

    if( query.trim().length === 0 ){
      return;
    }

    if( !this._historal.includes( query ) ) {
      this._historal.unshift( query );
      this._historal = this._historal.splice(0,10);
      localStorage.setItem('historial', JSON.stringify( this._historal ));
      
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
    .subscribe( ( resp ) => {
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados) );
    });

  }

}