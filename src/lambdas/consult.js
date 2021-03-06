const main = require('../templates/main')
const axios = require('axios')
const convert = require('xml-js')
require('dotenv').config()

const sendEmail = async ({ body:corpo }) => {
    const {cep, peso, comprimento, altura, largura, valor, servico} = corpo
    const numberServico = (servico) => {
        if(servico === 'sedex') return '04014'
        if(servico === 'pac') return '04510'
        if(servico === 'sedex12') return '04782'
        if(servico === 'sedex10') return '04790'
        if(servico === 'sedexHOJE') return '04804'
    }
    const config = {
        method:'POST',
        url: 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx',
        params: {
            nCdEmpresa: ' ',
            sDsSenha: ' ',
            nCdServico: numberServico(servico),
            sCepOrigem: '01123010',
            sCepDestino: cep,
            nVlPeso: peso,
            nCdFormato: '1',
            nVlComprimento: comprimento,
            nVlAltura: altura,
            nVlLargura: largura,
            nVlDiametro: '0',
            sCdMaoPropria: 'n',
            nVlValorDeclarado: valor,
            sCdAvisoRecebimento: 'n',
            StrRetorno:'xml',
            nIndicaCalculo:'3'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
    }
    try {
        const result = await axios(config)
        const convertido = convert.xml2json(result.data, { compact: true, spaces: 4 })
        const obj = JSON.parse(convertido)
        return {
            statusCode: 200,
            body: JSON.stringify(obj)
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify('Erro ao consultar a API dos correios')
        }
    }
}

module.exports = { handler: main(sendEmail) }