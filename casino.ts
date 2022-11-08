import fs from 'fs'
import path from 'path'
interface ITragamonedas{
    
    tematica: string;
    probabilidadDeGanar: number;
    apuestas: number[];
    valorDeApuesta?: number
    jugadorTiradas?: Tirada[]
    cantidadDeTiradas?: number
    
    getNombre():string
    getProbabilidadDeGanar():number
    getJugadorTiradas(): Tirada[]
    realizarApuesta(dineroDisponible: number, valorDeApuesta:number):void
    addJugadorTirada(tirada:Tirada):void
    getResultados():void 
}

interface Tirada {
    perdio: number,
    gano: number,
    ganoPremioMaximo?: boolean
}

const obtenerNumeros = (numeroProbabilidad: number) => {     
    let numero1 = 0
    let numero2 = 0
    let numero3 = 0

    switch(true){
        case (numeroProbabilidad < 0.2) :
            numero1 = getRandom(10)
            numero2 = getRandom(10)
            numero3 = getRandom(10)
            break; 
        case (numeroProbabilidad < 0.4) :
            numero1 = getRandom(8)
            numero2 = getRandom(8)
            numero3 = getRandom(8)
            break; 
        case (numeroProbabilidad < 0.6):
            numero1 = getRandom(6)
            numero2 = getRandom(6)
            numero3 = getRandom(6)
            break; 
        case (numeroProbabilidad < 0.8):
            numero1 = getRandom(4)
            numero2 = getRandom(4)
            numero3 = getRandom(4)
            break; 
        case (numeroProbabilidad < 0.99):
            numero1 = getRandom(2)
            numero2 = getRandom(2)
            numero3 = getRandom(2)
            break; 
        default:
            numero1 = getRandom(1) 
            numero2 = getRandom(1)
            numero3 = getRandom(1)
    }

    return [numero1,numero2,numero3]
}

class Tragamonedas implements ITragamonedas{
    tematica: string;
    probabilidadDeGanar: number;
    apuestas: number[]
    valorDeApuesta: number;
    jugadorTiradas: Tirada[] 
    cantidadDeTiradas: number

    constructor(tematica: string,  apuestas: number[]){
        this.tematica = tematica;
        this.apuestas = apuestas
        this.probabilidadDeGanar =  0
        this.valorDeApuesta = 0;
        this.jugadorTiradas = []
        this.cantidadDeTiradas = 0
    }

    getNombre():string {
        console.log("El nombre de la tematica es: " + this.tematica)
        return "El nombre de la tematica es: " + this.tematica
    }

    getProbabilidadDeGanar():number{
        return this.probabilidadDeGanar = Math.random()
    }

    getJugadorTiradas(): Tirada[] {
        return this.jugadorTiradas
    }

    realizarApuesta(dineroDisponible: number, valorDeApuesta:number):void {
        const verificarValorDeApuesta = this.apuestas.find(valor => valor === valorDeApuesta)
        if(!verificarValorDeApuesta){
            throw new Error('El valor de la apuesta no es correcto')
        }
        const cantidadDeTiradas = dineroDisponible / valorDeApuesta
        this.valorDeApuesta = valorDeApuesta
        this.cantidadDeTiradas = cantidadDeTiradas
    }

    addJugadorTirada(tirada:Tirada):void{
        this.jugadorTiradas?.push(tirada)
    }

    getResultados() {
        
        const resultados = this.getJugadorTiradas()
        console.log(resultados)
        const total = resultados.map(tirada => {
            return tirada.gano - tirada.perdio
        })
       
        const resultadoFinal = total.reduce((a,b) =>a+b)
       
        fs.appendFile(this.tematica + '.txt', "En el juego de "+  this.tematica  + " el resultado en dinero del jugador es de $" + resultadoFinal.toString() + "." + "\n" , (err) => {
            if(err) throw err
            console.log('el archivo se creo exitosamente')
        } )
    }
}


class Tragamonedas1 extends Tragamonedas {

    premioMaximo: number
    constructor(nombreDeJuego: string, apuestas: number[]){
        super(nombreDeJuego, apuestas)
        this.premioMaximo = 0
    }

    setPremioMaximo(valorApuesta: number, ganoPremioMaximo: boolean):void{
        if(ganoPremioMaximo === true  ) {
            this.premioMaximo = 0
        }else {
            this.premioMaximo += (valorApuesta/2)

        }
    }

    ejecutarJuego(dineroDisponible:number,valorDeApuesta:number) {
        this.getNombre()
        this.realizarApuesta(dineroDisponible,valorDeApuesta)

        const numeroPremioMaximo = getRandom(10) 

        let numeroDeTiradas = this.cantidadDeTiradas ?? 0
        
        for(let i=0; i< numeroDeTiradas; i++){

        const numeroProbabilidad = this.getProbabilidadDeGanar()
        const numerosJuego = obtenerNumeros(numeroProbabilidad)
        let numero1 = numerosJuego[0]
        let numero2 = numerosJuego[1]
        let numero3 = numerosJuego[2]       

        if (numero1 === numero2 && numero2 === numero3 ) {
            if(numero3 === numeroPremioMaximo){
                this.addJugadorTirada({
                    perdio: 0,
                    gano: this.premioMaximo,
                    ganoPremioMaximo: true
                })
                
                this.setPremioMaximo(0, true)   
            }else {
                this.addJugadorTirada({
                    perdio: 0,
                    gano: this.valorDeApuesta * getRandom(10),
                    ganoPremioMaximo: false
                })
            }
        }else{
            this.addJugadorTirada({
                perdio: this.valorDeApuesta,
                gano: 0,
                ganoPremioMaximo: false
            })     
            this.setPremioMaximo(this.valorDeApuesta, false)   
        }
        }
        this.getJugadorTiradas()
    }
}



class Tragamonedas2 extends Tragamonedas {

    constructor(nombreDeJuego: string,  apuestas: number[]){
        super(nombreDeJuego,  apuestas)
    }

    ejecutarJuego(dineroDisponible:number,valorDeApuesta:number) {
        this.getNombre()
        this.realizarApuesta(dineroDisponible,valorDeApuesta)
          
        for(let i=0; i< this.cantidadDeTiradas; i++){

        const numeroProbabilidad = this.getProbabilidadDeGanar()        
        const numerosJuego = obtenerNumeros(numeroProbabilidad)
        let numero1 = numerosJuego[0]
        let numero2 = numerosJuego[1]
        let numero3 = numerosJuego[2]
        if (numero1 === numero2 && numero2 === numero3 || (((numero1 + 1) === numero2) &&( (numero2 + 1) === numero3))) { //que tambien gane con escalera por ejemplo 3,4,5
                this.addJugadorTirada({
                    perdio: 0,
                    gano: this.valorDeApuesta * getRandom(10)
                })
        }else{
            this.addJugadorTirada({
                perdio: this.valorDeApuesta,
                gano: 0,
            })     
        }
        }
        this.getJugadorTiradas()
    }
}


let archivoTexto: string = fs.readFileSync(path.join(__dirname, 'archivo.txt'), 'utf-8')
const archivo = JSON.parse(archivoTexto)
let tragamoneda1;
let tragamoneda2;
switch (archivo.tematica) {
    case 'Juego de Dados':
        
        tragamoneda1 = new Tragamonedas1(archivo.tematica, [1,2,5,10,20,50,100])
        tragamoneda1.ejecutarJuego(archivo.dineroDisponible, archivo.valorDeApuesta)
        tragamoneda1.getResultados()
        break;
    case 'Juego de Toros':
        
        tragamoneda2 = new Tragamonedas2(archivo.tematica,[50,100,500,1000] ) 
        tragamoneda2.ejecutarJuego(archivo.dineroDisponible, archivo.valorDeApuesta)
        tragamoneda2.getResultados()
        break;
    default:
        throw new Error('El nombre del juego no existe')
}

function getRandom(valorMaximo: number) {
    return Math.floor(Math.random() * valorMaximo);
}