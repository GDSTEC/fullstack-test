import { Request, Response } from "express";
import Aluno from "../../models/aluno/Aluno";

export default {
  async registrarAluno(req: Request, res: Response) {
    try {
      const { nome, dataDeNascimento } = req.body;

      if(!nome || nome.length < 2) {
        return res.status(400).send({message: "Nome vazio ou inválido"});
      };
      
      if (/\d/.test(nome)) {
       return res.status(400).send({ message: "O nome não pode conter números" });
      };

      const procurarAlunoExistente = await Aluno.findOne({ nome, dataDeNascimento });

      if (procurarAlunoExistente) {
        return res.status(400).send({ message: "Aluno já cadastrado" });
      };

      const newAluno = new Aluno({
        nome,
        dataDeNascimento
      });

      newAluno.save((error: any) => {
        if (error) {
          return res.status(400).send({ message: "Preencha os campos corretamente", error });
        } 
        return res.status(200).send({ message: "Registrado(a) com sucesso!" });
      });

    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error", error })
    }
  },

  async buscarTodosAlunos(req: Request, res: Response) {
    try {
      const buscarTodosAlunos = await Aluno.find();

      if (buscarTodosAlunos) {
        return res.status(200).send(buscarTodosAlunos);
      } else {
        return res.status(404).send({ alunos: 'Nenhum aluno encontrado!' });
      }
    } catch (error) {
     return res.status(500).send({ message: "Internal Server Error", error })
    }
  },

  async buscarAluno(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const buscarAluno = await Aluno.findById({ _id });

      if (buscarAluno) {
        return res.status(200).send(buscarAluno);
      } else {
        return res.status(404).send({ alunos: 'Aluno não encontrado!' });
      }
    } catch (error) {
     return res.status(500).send({ message: "Internal Server Error", error })
    }
  },

  async atualizarDadosAlunos(req: Request, res: Response) {
    try {
      const { _id } = req.params;
      const { nome, dataDeNascimento } = req.body;

      !nome && !dataDeNascimento && res.status(400).send({ message: "Preencha os dados corretamente" });

      await Aluno.findByIdAndUpdate({ _id }, {
        $set: { nome: nome, dataDeNascimento: dataDeNascimento }
      })
        .then(() => {
          return res.status(200).send({ message: 'Dados atualizados' });
        }).catch((error) => {
          return res.status(400).send({ message: "Falha ao atualizar dados", error });
        })

    } catch (error) {
     return res.status(500).send({ message: "Internal Server Error", error });
    }
  },

  async deletarAluno(req: Request, res: Response) {
    try {
      const { _id } = req.params;

      await Aluno.findByIdAndDelete(_id)
        .then(() => {
          return res.status(200).send({ message: "Aluno deletado!" })
        })
        .catch(() => {
          return res.status(400).send({ message: "Falha ao deletar o aluno!" })
        });
    } catch (error) {
     return res.status(500).send({ message: "Internal Server Error", error })
    }
  },

  async filtrarAlunosPorIdade(req: Request, res: Response) {
    try {
      await Aluno.find()
        .then(alunos => {
          function calcularIdade(dataDeNascimento: string) {

            const hoje = new Date();
            const [dia, mes, ano] = dataDeNascimento.split('/');
            const dataNascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));

            let idade = hoje.getFullYear() - dataNascimento.getFullYear();
            const mesAtual = hoje.getMonth();
            const diaAtual = hoje.getDate();

            if (mesAtual < dataNascimento.getMonth() || (mesAtual === dataNascimento.getMonth() && diaAtual < dataNascimento.getDate())) {
              idade--;
            }

            return idade;
          }
          function filtrarAlunosPorFaixaEtaria(alunos: any) {
            const faixasEtarias = [
              { faixa: '18-25', quantidade: 0, porcentagem: 0 },
              { faixa: '26-35', quantidade: 0, porcentagem: 0 },
              { faixa: '36-45', quantidade: 0, porcentagem: 0 },
              { faixa: '46-55', quantidade: 0, porcentagem: 0 },
              { faixa: '55-99', quantidade: 0, porcentagem: 0 }
            ];

            const totalAlunos = alunos.length;

            alunos.forEach((aluno: any) => {
              const idade = calcularIdade(aluno.dataDeNascimento);

              const faixaEtaria = faixasEtarias.find(faixa => {
                const [min, max] = faixa.faixa.split('-');
                return idade >= parseInt(min) && idade <= parseInt(max);
              });

              if (faixaEtaria) {
                faixaEtaria.quantidade++;
              }
            });

            faixasEtarias.forEach(faixaEtaria => {
              faixaEtaria.porcentagem = (faixaEtaria.quantidade / totalAlunos) * 100;
            });

            return faixasEtarias;
          }
          const resultados = filtrarAlunosPorFaixaEtaria(alunos);
          return res.status(200).send(resultados);
        })
        .catch((error) => {
          return res.status(400).send({ message: "Falha ao filtrar alunos", error })
        });
    } catch (error) {
     return res.status(500).send({ message: "Internal Server Error", error })
    }
  }
}
