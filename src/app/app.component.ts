import { Component }         from '@angular/core';
import { PagamentoService }  from './pagamento.service';
import { Dados }             from './dados.class';
import { VariableGlobal }    from './variable.global.service';

declare var PagSeguroDirectPayment:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public dados = new Dados ();
  public sessionId = '';
  public senderHash = '';
  

  public data = {
    plan_id: 2,
    session: "",
    user: {
      name: "Gabriel Medeiros",
      phone: "11979917537",
      email: "gabrielsme@gmail.com",
      cpf: "07251926407",
      birthdate:"12/06/1988"
    },
    address: {
      street: "Rua X",
      number: "123",
      complement: "Apto",
      district: "Bairro",
      postal_code: "01539-010",
      city: "São Paulo",
      state: "SP"
    },
      card: {
          token: ""
      }
  }

  public card = {
    number: "123",
    holder: "456",
    expiration: "789",
    cvv: "666",
    brand: ""
  }

  banCard;

  username = '';
  email = '';
  cpf = '';
  telefone= '';
  birth = '';

  street;
  number;
  complement;
  district;
  city;
  state;
  postal_code;


  numCard;
  mesValidadeCard;
  anoValidadeCard;
  codSegCard;



  constructor(public pagamentoService: PagamentoService, private variableGlobal: VariableGlobal) {
    
    //CARREGA O JAVASCRIPT DO PAGSEGURO 
    this.carregaJavascriptPagseguro();

  }

  //BUSCA A BANDEIRA DO CARTÃO (EX: VISA, MASTERCARD ETC...) E DEPOIS BUSCA AS PARCELAS;
  //ESTA FUNÇÃO É CHAMADA QUANDO O INPUT QUE RECEBE O NÚMERO DO CARTÃO PERDE O FOCO;
  buscaBandeira(){
    
    PagSeguroDirectPayment.getBrand({
					cardBin: JSON.stringify(this.numCard),
					success: response => { 
            
            this.banCard = response.brand.name;
        
          },
					error: response => { console.log(response); }
		});	
 
  }


  //BUSCA AS PARCELAS NA API DO PAGSEGURO PARA O CLIENTE ESCOLHER
  buscaParcelas(){

    PagSeguroDirectPayment.getInstallments({

				amount:  '100',              //valor total da compra (deve ser informado)
				brand: this.dados.bandCard, //bandeira do cartão (capturado na função buscaBandeira)
				maxInstallmentNoInterest: 3,
				success: response => { 

          this.dados.parcelas = response.installments[this.dados.bandCard];
          console.log('parcelas: '+ response);

				},
				error: response => {	console.log( response)	}
		});

  } 
  
  //AO CLICAR NO BOTÃO PAGAR
  onSubmit(f){
      console.log(this.username, 'username')
      console.log(this.email, 'email')
      console.log(this.cpf, 'cpf')
      console.log(this.telefone, 'telefone')
      console.log(this.birth, 'birth')
      console.log(this.street, 'street')
      console.log(this.number, 'number')
      console.log(this.complement, 'complement')
      console.log(this.district, 'district')
      console.log(this.city, 'city')
      console.log(this.state, 'state')
      console.log(this.postal_code, 'postal_code')
      console.log(this.numCard, 'numCard')
      console.log(this.mesValidadeCard, 'mesValidadeCard')
      console.log(this.anoValidadeCard, 'anoValidadeCard')
      console.log(this.codSegCard, 'codSegCard')

        //BUSCA O HASH DO COMPRADOR JUNTO A API DO PAGSEGURO
        this.pagamentoService.startSession().toPromise().then((response:any) => {
          
          console.log(response.session);

          this.sessionId = response.session;
          this.data.session = PagSeguroDirectPayment.getSenderHash();
          PagSeguroDirectPayment.setSessionId(this.sessionId);
          this.card.number = this.numCard;
          this.buscaBandeira();
          PagSeguroDirectPayment.createCardToken({
            
            cardNumber:       this.numCard,
            brand:            this.banCard,
            cvv:              this.codSegCard,
            expirationMonth:  this.mesValidadeCard,
            expirationYear:   this.anoValidadeCard,
            success: response => {
              console.log(response, 'sucessResponse')
              this.data.card.token = response.card.token;
              //NESTE MOMENTO JÁ TEMOS TUDO QUE PRECISAMOS!
              //HORA DE ENVIAR OS DADOS PARA O SERVIDOR PARA CONCRETIZAR O PAGAMENTO
              this.enviaDadosParaServidor();
               
            },
            error: response => { console.log(response) }
  
          });



        }).catch(err => {
          console.log(err);
        });

        //CRIA O HASK DO CARTÃO DE CRÉDITO JUNTO A API DO PAGSEGURO
        
      
    }

    enviaDadosParaServidor(){
      this.data.user.name = this.username;
      this.data.user.phone = this.telefone;
      this.data.user.email = this.email;
      this.data.user.cpf = this.cpf;
      this.data.user.birthdate = this.birth;

      this.data.address.street = this.street;
      this.data.address.number = this.number;
      this.data.address.complement = this.complement;
      this.data.address.district = this.district;
      this.data.address.city = this.city;
      this.data.address.state = this.state;



      //COLOQUE AQUI O CÓDIGO PARA ENVIAR OS DADOS PARA O SERVIDOR (PHP, JAVA ETC..) PARA QUE ELE CONSUMA A API DO PAGSEGURO E CONCRETIZE A TRANSAÇÃO
      this.pagamentoService.store(this.data).toPromise().then((response:any) => {
        console.log(response);
      })
    }

    //CARREGA O JAVASCRIPT DO PAGSEGURO (A EXPLICAÇÃO ESTA FUNÇÃO ESTÁ LOGO ABAIXO)
    carregaJavascriptPagseguro(){
      
      if(!this.variableGlobal.getStatusScript())
      {
        //SEJA O JAVASCRIPT NO CABEÇÁRIO DA PÁGINA
        new Promise((resolve) => {
          let script: HTMLScriptElement = document.createElement('script');
          script.addEventListener('load', r => resolve());
          script.src = 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
          document.head.appendChild(script);      
        });

        //BUSCA UM ID DE SESSÃO NO SERVIDOR (ESTE ID É GERADO PELA API DO PAGSEGURO QUE VOCÊ DEVE CONSUMIR USANDO SEU SERVIDOR. LER DOCUMENTAÇÃO PARA SABER COMO GERAR)
        //this.pagamentoService.startSession().subscribe(result => PagSeguroDirectPayment.setSessionId(result));

        this.variableGlobal.setStatusScript(true);
      }

    }

  
}

/*

  PARA USAR O CHECKOUT TRANSPARENTE DO PAGSEGURO, É NECESSÁRIO CARREGAR UM ARQUIVO JS EXTERNO (pagseguro.directpayment.js). 
  AQUI NÓS USAMOS UM SCRIPT PARA QUE ESSE JS SEJA CARREGADO SOMENTE NA HORA QUE ESTE COMPONENTE FOR CHAMADO (EVITANDO CARREGAR O JS DO PAGSEGURO 
  TODA VEZ QUE O COMPONENTE FOR CHAMADO). PORÉM, SE VOCÊ PREFERIR, O JS PODE SER CARREGADO NO INDEX.HTML (FICA AO SEU CRITÉRIO). 

  O SCRIPT, QUE FICA NA FUNÇÃO carregaJavascriptPagseguro(), CRIA UMA TAG DO TIPO SCRIPT NO HEAD DA PÁGINA E SETA O ARQUIVO JS PARA EVITAR QUE O JS SEJA 
  CARREGADO TODA HORA QUE O COMPONENTE FOR CHAMADO. TAMBÉM CRIAMOS UM SERVIÇO GLOBAL QUE ARMAZENA UMA VARIÁVEL BOOLEANA PARA INFICAR SE O JS JÁ 
  FOI CARREGADO OU NÃO. UMA VEZ CARREGADO, O JS NÃO SERÁ CARREGADO NOVAMENTE.

*/