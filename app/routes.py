import os
from flask import Flask, render_template, request, url_for, flash, redirect, make_response, jsonify, Blueprint
from app.forms import FormularioCadastro
from app.models import Aluno, Curso, Tema, AlunoTema, Adocao, SugestaoManual
from . import db
from sqlalchemy import func
import random
import datetime


main = Blueprint('main', __name__)


@main.route('/')
def index():
    veteranos_count = Aluno.query.filter(Aluno.semestre > 1).count()
    calouros_count = Aluno.query.filter(Aluno.semestre == 1).count()
    adocoes_count = Adocao.query.count()

    semestre_atual = get_semestre_atual()

    # Consultando o nome do tema e a quant de alunos interessados
    temas = db.session.query(
        Tema.nome, 
        func.count(AlunoTema.aluno_id).label('quantidade_alunos')
    ).join(AlunoTema, AlunoTema.tema_id == Tema.id) \
    .group_by(Tema.id) \
    .order_by(func.count(AlunoTema.aluno_id).desc()) \
    .all()

    return render_template(
        'index.html',
        veteranos_count=veteranos_count,
        calouros_count=calouros_count,
        temas=temas,
        adocoes_count=adocoes_count,
        semestre_atual=semestre_atual
    )


@main.route('/manual', methods=['GET'])
def manual():
    semestre_atual = get_semestre_atual()

    return render_template('manual-dos-bixos.html', semestre_atual=semestre_atual)


@main.route('/form', methods=['GET', 'POST'])
def form():
    temas = Tema.query.all()
    random.shuffle(temas)
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


@main.route('/admin', methods=['GET'])
def admin():
    pw = os.environ.get('admin_pw')
    if pw != None:
        cursos = Curso.query.all()

        return render_template('admin.html', cursos=cursos)
    else:
        return redirect('/')
    

@main.route('/get_alunos_sem_adocao', methods=['GET'])
def get_alunos_sem_adocao():
    curso_id = request.args.get('curso')

    alunos = Aluno.query.filter(
        Aluno.id.notin_(
            db.session.query(Adocao.veterano_id)
        )
    )

    curso = Curso.query.get(curso_id) if curso_id else None
    alunos = alunos.filter(Aluno.curso == curso) if curso != None else alunos

    veteranos = [aluno.to_dict() for aluno in alunos.filter(Aluno.semestre > 1).all()]
    calouros = [aluno.to_dict() for aluno in alunos.filter(Aluno.semestre == 1).all()]

    return jsonify({'veteranos': veteranos, 'calouros': calouros})


@main.route('/get_tabelas', methods=['GET'])
def get_tabelas():
    adocoes = Adocao.query.all()
    adocoes = [adocao.to_dict() for adocao in adocoes]

    veteranos = Aluno.query.filter(Aluno.semestre > 1).all()
    veteranos = [veterano.to_dict() for veterano in veteranos]
    
    calouros = Aluno.query.filter(Aluno.semestre == 1).all()
    calouros = [calouro.to_dict() for calouro in calouros]

    return jsonify({'adocoes': adocoes, 'veteranos': veteranos, 'calouros': calouros })


@main.route('/add_adocao', methods=['POST'])
def add_adocao():
    calouro = request.form.get('select-calouro-id')
    veterano = request.form.get('select-veterano-id')

    novaAdocao = Adocao(calouro_id=calouro, veterano_id=veterano)

    try:
        db.session.add(novaAdocao)
        db.session.commit()
        return '1'
    except:
        db.session.rollback()
        return '0'


@main.route('/conferir_whatsapp_inscricao', methods=['GET'])
def conferir_whatsapp_inscricao():
    whatsapp = request.args.get('whatsapp')
    print(whatsapp)
    tipo_aluno = request.args.get('tipo_aluno')
    print(tipo_aluno)

    inscricao = Aluno.query.filter(Aluno.whatsapp == whatsapp)
    if tipo_aluno == 'calouro':
        inscricao.filter(Aluno.semestre == 0)
    else:
        inscricao.filter(Aluno.semestre > 0)

    print(inscricao)

    if (len(inscricao.all()) > 0):
        return '1'
    else:
        return '0'


@main.route('/enviar_sugestao', methods=['GET', 'POST'])
def enviar_sugestao():
    cursos = Curso.query.all()

    if request.method == 'POST':
        sugestao = request.form.get('sugestao')
        curso = int(request.form.get('curso'))

        novaSug = SugestaoManual(sugestao, curso) if curso > 0 else SugestaoManual(sugestao)
        db.session.add(novaSug)
        db.session.commit()

    return render_template('form-sugestao.html', form=form, cursos=cursos)


def get_semestre_atual():
    now = datetime.datetime.now()
    ano = now.year
    semestre = 1 if now.month < 8 else 2
    semestre_atual = f"{ano}-{semestre}"

    return semestre_atual
