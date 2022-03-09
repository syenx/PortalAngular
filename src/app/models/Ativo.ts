export class Ativo {
    nome: string;
    data: Date;

    constructor(nome: string = null, data: Date = null) {
        this.nome = nome;
        this.data = data;
    }
}