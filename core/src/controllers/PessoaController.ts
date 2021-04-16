import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { FirebirdConnection } from '../config/Firebird';

export class PessoaController {
  public static getAll(req: Request, res: Response) {
    let whereCondition = ''
    if (req.query) {
      Object.keys(req.query).forEach((key: string) => {
        whereCondition += `${key} = '${req.query[key]}'`
      })
    }
    const query = `SELECT * FROM TPESSOA WHERE ${whereCondition}`
    FirebirdConnection.getConnection().then((db) => {
      db.query(query, (err: any, result: any[]) => {
          const response: any[] = []
          if (err)
            res.status(500).send({error: true, message: 'Algo deu errado ao consultar esse cliente'})
          if (result && result.length > 0) {
            result.forEach((row: any) => {
              let obj: any = {}
              Object.keys(row).forEach((key: string) => {
                if (row[key] && typeof row[key] == 'object') {
                  obj[key.toLocaleLowerCase()] = row[key].toString('utf8')
                } else {
                  obj[key.toLocaleLowerCase()] = row[key]
                }
              })
              response.push(obj)
            })
            res.send(response)
          } else {
            res.status(500).send({error: true, message: 'Registro não econtrado'})
          }
        }
      )
    }).catch((error) => {
      res.status(500).send({error: true, message: 'Algo deu errado ao conectar no banco de dados'})
    })
  }

  public static save(req: Request, res: Response) {
    try {
      if (!req.file) {
        const directory = path.join(__dirname, `../storage/images/${req.params.id}`)
        fs.unlink(directory, () => {})
      }
      res.send({message: 'Salvo com sucesso!'})
    } catch (error) {
      res.status(500).send({message: 'Não foi possível salvar o registro'})
    }
  }
}