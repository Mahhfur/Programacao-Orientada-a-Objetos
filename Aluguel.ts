import {Bicicleta}from "./Bicicleta"
import {Cliente }from "./Cliente"
import {Funcionario}from "./Funcionario"

class Aluguel {
    NumeroPedido:Number
    Cliente: Cliente
    Funcionario:Funcionario
    Bicicleta: Bicicleta
    Valor:number = 0.0 //inicializa com zero
    Tempo:number = 0.0
    DataPedido: string
    DataDevolucao: string

    constructor(NumeroPedido:number, Cliente:Cliente, Funcionario:Funcionario, Bicicleta: Bicicleta, Valor:number, Tempo:number, DataPedido:string, DataDevolucao:string) {
        this.NumeroPedido = NumeroPedido;
        this.Cliente=Cliente;
        this.Funcionario = Funcionario;
        this.Bicicleta = Bicicleta;
        this.Valor
        this.Tempo
        this.DataPedido = DataPedido;
        this.DataDevolucao = DataDevolucao;
    }

    aluguel (Tempo:number):void {
        this.Valor = this.Valor + (Tempo* this.Bicicleta.valor);
        this.Tempo+=Tempo
    }
	
    Alterardata(data:string):void {
        this.DataDevolucao= data;
    }
}