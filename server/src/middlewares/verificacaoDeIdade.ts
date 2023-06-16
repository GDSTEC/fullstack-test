import { Request, Response, NextFunction } from "express"

function isOver18(req: Request, res: Response, next: NextFunction) {
  const { dataDeNascimento } = req.body;

  if (!dataDeNascimento) {
    return res.status(400).send({ message: 'Data de nascimento inválida!' });
  }

  if (dataDeNascimento.length < 10) {
    return res.status(400).send({message: "Data inválida"});
  }

  const [day, month, year] = dataDeNascimento.split('/').map(Number);

  if (month > 12) {
    return res.status(400).send({ message: 'Mês inválido!' });
  }

  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  const ageDiffMs = currentDate.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 18) {
    return res.status(403).send({ message: 'O aluno precisa ser maior de 18 anos!' });
  }

  if (age > 99) {
    return res.status(403).send({ message: 'O aluno não pode ter mais de 99 anos!' });
  }

  next();
}

export default isOver18;
