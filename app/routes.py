import os
from flask import Flask, render_template, request, url_for, flash, redirect, make_response, jsonify, Blueprint
from app.forms import FormularioCadastro
from app.models import Aluno, Curso, Tema, AlunoTema
from . import db
from flask_sqlalchemy import SQLAlchemy


main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/form', methods=['GET', 'POST'])
def form():
    temas = Tema.query.all()
    inscricao_concluida = False
    form = FormularioCadastro()

    if form.validate_on_submit():
        nome = form.nome.data
        sobrenome = form.sobrenome.data
        idade = form.idade.data
        whatsapp = form.whatsapp.data
        semestre_atual = form.semestre_atual.data
        curso = form.curso.data
        sobre = form.sobre.data
        temas = form.temas.data
        
        novoAluno = Aluno(nome=nome, sobrenome=sobrenome, idade=idade, whatsapp=whatsapp, semestre=semestre_atual, curso_id=curso, sobre=sobre)
        db.session.add(novoAluno)
        db.session.flush()
        aluno_id = novoAluno.id

        temas = temas.split(',')
        for tema in temas:
            interesse = AlunoTema(aluno_id=aluno_id, tema_id=tema)
            db.session.flush()
            db.session.add(interesse)

        db.session.commit()

        inscricao_concluida = True

    return render_template('inscricao.html', form=form, temas=temas, inscricao_concluida=inscricao_concluida)


@main.route('/admin', methods=['GET', 'POST'])
def admin():
    pw = os.environ.get('admin_pw')
    if pw != None:
        alunos = Aluno.query.all()
        return render_template('admin.html', alunos=alunos)
    else:
        return redirect('/')


# Endpoint para retornar todos os alunos
@main.route('/alunos', methods=['GET'])
def get_alunos():
    alunos = Aluno.query.all()  # Obtém todos os alunos
    alunos_list = []
    for aluno in alunos:
        alunos_list.append({
            'id': aluno.id,
            'nome': aluno.nome,
            'sobrenome': aluno.sobrenome,
            'idade': aluno.idade,
            'whatsapp': aluno.whatsapp,
            'semestre': aluno.semestre,
            'sobre': aluno.sobre,
            'curso': aluno.curso.sigla + ' - ' + aluno.curso.turno
        })
    return render_template('admin.html', alunos=alunos)
