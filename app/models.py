from flask import Flask
from . import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func


class Aluno(db.Model):
    __tablename__ = 'aluno'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    sobrenome = db.Column(db.String(255), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    whatsapp = db.Column(db.String(20), nullable=False)
    semestre = db.Column(db.SmallInteger)
    sobre = db.Column(db.Text)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=False)
    
    curso = db.relationship('Curso', backref='alunos')

    def __init__(self, nome, sobrenome, idade, whatsapp, semestre, sobre, curso_id):
        self.nome = nome
        self.sobrenome = sobrenome
        self.idade = idade
        self.whatsapp = whatsapp
        self.semestre = semestre
        self.sobre = sobre
        self.curso_id = curso_id

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'sobrenome': self.sobrenome,
            'idade': self.idade,
            'whatsapp': self.whatsapp,
            'curso': self.curso.sigla + ' - ' + self.curso.turno,
            'semestre': self.semestre,
            'sobre': self.whatsapp,
        }


class Curso(db.Model):
    __tablename__ = 'curso'
    id = db.Column(db.Integer, primary_key=True)
    sigla = db.Column(db.String(10), nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    turno = db.Column(db.String(10), nullable=False)


class Tema(db.Model):
    __tablename__ = 'tema'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(255), nullable=False)


class AlunoTema(db.Model):
    __tablename__ = 'aluno_tema'
    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    tema_id = db.Column(db.Integer, db.ForeignKey('tema.id'), nullable=False)
    
    aluno = db.relationship('Aluno', backref='alunoTema')
    tema = db.relationship('Tema', backref='alunoTema')
    
    def __init__(self, aluno_id, tema_id):
        self.aluno_id = aluno_id
        self.tema_id = tema_id


class Adocao(db.Model):
    __tablename__ = 'adocao'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now())
    calouro_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    veterano_id = db.Column(db.Integer, db.ForeignKey('aluno.id'), nullable=False)
    notificados = db.Column(db.Boolean, nullable=False)
    
    calouro = db.relationship('Aluno', foreign_keys=[calouro_id])
    veterano = db.relationship('Aluno', foreign_keys=[veterano_id])
    
    def __init__(self, calouro_id, veterano_id):
        self.calouro_id = calouro_id
        self.veterano_id = veterano_id

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at.strftime("%d/%m - %H:%M"),
            'calouro': self.calouro.nome + self.calouro.sobrenome,
            'veterano': self.veterano.nome + self.veterano.sobrenome,
            'notificados': self.notificados,
            'curso': self.veterano.curso.sigla + ' - ' + self.veterano.curso.turno
        }


class SugestaoManual(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now())
    sugestao = db.Column(db.Text)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=True)

    curso = db.relationship('Curso', backref='sugestao')

    def __init__(self, sugestao, curso_id = 0):
        self.sugestao = sugestao
        if curso_id > 0:
            self.curso_id = curso_id


class SugestaoTema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now())
    sugestao = db.Column(db.Text)

    def __init__(self, sugestao, curso_id = 0):
        self.sugestao = sugestao

