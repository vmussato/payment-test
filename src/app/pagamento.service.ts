import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }             from '@angular/core';
import { Dados }                  from './dados.class';


/* CLASSE SERVIÇO: RESPONSÁVEL POR ESTABELECER COMUNICAÇÃO COM O SERVIDOR */

@Injectable()
export class PagamentoService {
constructor(private http: HttpClient) {}

  url = `https://api.filonared.com.br/api/`;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuZmlsb25hcmVkLmNvbS5iclwvYXBpXC9yZWdpc3RlciIsImlhdCI6MTU2OTc4ODcxNSwiZXhwIjoxNTcxMDg0NzE1LCJuYmYiOjE1Njk3ODg3MTUsImp0aSI6IjBCT2lLbDBRYjNXQlRuUXMiLCJzdWIiOjEsInBydiI6IjZlNmJiNTMwNzg2MTFjN2I4M2UxZGJkMmY3YWExODlkZjI4ZTgwN2YifQ.dhgypuVZLH3YP3VaworHMeIqkHSkDknEy5CsueFjAro'
  });

  public startSession (token){

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: this.headers };

    return this.http.get( this.url+'payment/session', options);
  }

  public store (data, token){

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: this.headers };
    
    let body = JSON.stringify(data);
    return this.http.post(this.url+'payment', body, options);
  }

  public cancel (){

    let options = { headers: this.headers };
    
    return this.http.get(this.url, options).toPromise().then((data:any) => {

    })
  }


}