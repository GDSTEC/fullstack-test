import mongoose from "mongoose";
import { IAlunoModel } from "./interfaceIAlunoModel";

const AlunoModelSchema = new mongoose.Schema<IAlunoModel>({
  nome: {
    type: String,
    required: true,
    minlength: 2,
  },

  dataDeNascimento: {
    type: String,
    required: true
  }

});

const Aluno = mongoose.model<IAlunoModel>("Alunos", AlunoModelSchema);
export default Aluno;