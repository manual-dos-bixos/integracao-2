import os
from flask import Flask, render_template, request, url_for, flash, redirect, make_response, jsonify, Blueprint
from app.forms import FormularioCadastro
from app.models import Aluno, Curso, Tema, AlunoTema
from . import db
from sqlalchemy import func


main = Blueprint('main', __name__)


@main.route('/')
def index():
    veteranos_count = Aluno.query.filter(Aluno.semestre > 1).count()
    calouros_count = Aluno.query.filter(Aluno.semestre == 1).count()

    # Consultando o nome do tema e a quant de alunos interessados
    temas = db.session.query(
        Tema.nome, 
        func.count(AlunoTema.aluno_id).label('quantidade_alunos')
    ).join(AlunoTema, AlunoTema.tema_id == Tema.id) \
    .group_by(Tema.id) \
    .order_by(func.count(AlunoTema.aluno_id).desc()) \
    .all()

    return render_template('index.html', veteranos_count=veteranos_count, calouros_count=calouros_count, temas=temas)


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
        veteranos = Aluno.query.filter(Aluno.semestre > 1)
        calouros = Aluno.query.filter(Aluno.semestre == 1)
        return render_template('admin.html', veteranos=veteranos, calouros=calouros)
    else:
        return redirect('/')

@main.route('/manual', methods=['GET', 'POST'])
def manual():
    return render_template('manual-dos-bixos.html')